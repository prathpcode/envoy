// Grokmate relay: network state, the bus between Bots, and the redacted event stream. See PROTOCOL.md.
import http from "node:http";
import { inferAsk, scout, finalize, promote, karmaFor } from "./rules.mjs";
import { scripted, webhookDriver, xaiDriver, botHooks, resolveBotTurn, enforce, scoreFit, answerFor, judgeFit, TOPICS_FOR } from "./bots.mjs";
import { YOU, PERSONAS, CAST, SPOTS } from "./seed.mjs";
import { interview, sanitize, whoIs, lookFromSelfie, suggestProfile, TOPICS } from "./onboard.mjs";
import * as google from "./google.mjs";

// local settings (BOT_KEY, PUBLIC_URL, ...) live in apps/relay/.env.local, which is not committed
if (!process.env.NODE_TEST_CONTEXT) try { process.loadEnvFile(new URL("./.env.local", import.meta.url)); } catch { /* no file: defaults */ }
const env = (k, d) => Number(process.env[k] ?? d);
const PACE = env("PACE_MS", 900), APPROVAL_TIMEOUT = env("APPROVAL_TIMEOUT_MS", 60000), TURN_TIMEOUT = env("TURN_TIMEOUT_MS", 20000);
const AUTO = Math.min(2500, PACE * 3), TURNS = 8;
// where a matched pair meets: the key is a place on the campus map (PLACES in apps/mixer/public/map/iso.html)
const MEET_PLACES = [{ key: "tresidder", name: "Coupa Café, Tresidder" }, { key: "green", name: "Green Library steps" }, { key: "dschool", name: "the d.school" },
  { key: "huang", name: "Huang lawn" }, { key: "gates", name: "Gates courtyard" }];
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const hooks = botHooks();

/** `cast` is who is on campus at the start: the demo cast by default; the tests pass the full sample network. */
export function createRelay({ cast = CAST } = {}) {
  let S, n = 0;
  const id = (p) => `${p}_${(++n).toString(36)}`;
  const clients = new Set();                         // { viewer, res, seq }
  const timers = new Set();
  const later = (ms, f) => { const t = setTimeout(() => { timers.delete(t); f(); }, ms); timers.add(t); return t; };

  function reset() {
    for (const t of timers) clearTimeout(t); timers.clear();
    S = { users: new Map(), cards: new Map(), rules: new Map(), facts: new Map(), accepts: new Map(), asks: new Map(), convs: new Map(),
      matches: new Map(), meetings: new Map(), karma: [], log: [], spot: 0, hooks: new Map() };
    for (const p of cast) {
      addUser(p.user, p.card, p.rules, p.facts); S.accepts.set(p.user.id, p.recentAccepts);
      if (p.points) S.karma.push({ id: id("k"), userId: p.user.id, delta: p.points, reason: "seed", at: Date.now() });
    }
  }
  function addUser(user, card, rules, facts) {
    S.users.set(user.id, { ...user, joinedAt: Date.now() }); S.cards.set(user.id, card); S.rules.set(user.id, rules); S.facts.set(user.id, facts);
    emit({ type: "node.joined", user: { id: user.id, name: user.name, place: user.place, kind: user.kind, ...(user.look ? { look: user.look } : {}) } });
  }
  const total = (userId) => S.karma.filter((k) => k.userId === userId).reduce((a, k) => a + k.delta, 0);
  const connected = (userId) => [...clients].some((c) => c.viewer === userId);
  /** A persona's owner is simulated only while nobody is sitting in their seat. */
  const simulated = (userId) => S.users.get(userId)?.kind === "persona" && !connected(userId);

  // ---- the event log and the one place that decides what a viewer may see ----
  function emit(full) {
    const e = { ...full, at: Date.now() }; S.log.push(e);
    for (const c of clients) send(c, e);
  }
  function send(c, e) { const out = redact(e, c.viewer); if (out) c.res.write(`data: ${JSON.stringify({ seq: ++c.seq, ...out })}\n\n`); }

  /** The security boundary. Full events go in; what comes out is all a viewer ever learns. Returns null to drop. */
  function redact(e, viewer) {
    const ask = e.askId ? S.asks.get(e.askId) : null, conv = e.convId ? S.convs.get(e.convId) : null;
    const isAsker = !!ask && viewer === ask.askerId;
    const myConv = ask ? [...S.convs.values()].find((c) => c.askId === ask.id && c.offererId === viewer) : null;
    const base = { type: e.type, at: e.at };
    switch (e.type) {
      case "node.joined": return { ...base, user: e.user };
      case "ask.posted": return { ...base, askId: ask.id, kind: ask.kind, seats: ask.seats, spot: ask.spot, mine: isAsker, text: isAsker || myConv ? ask.text : undefined };
      case "scout.picked": return { ...base, askId: ask.id, candidates: e.convIds.map((cid) => { const c = S.convs.get(cid); return { alias: c.alias, convId: cid, ...(c.offererId === viewer ? { you: true } : {}) }; }) };
      case "conv.started": return { ...base, convId: conv.id, askId: ask.id, alias: conv.alias };
      case "conv.message": {
        // the ask's own words go only to people whose Bots heard them
        const text = e.askText && !isAsker && !myConv ? `My person has a ${ask.kind} ask.` : e.text;
        return { ...base, convId: conv.id, askId: ask.id, from: e.from === "asker" ? "Asker" : conv.alias, text };
      }
      case "conv.withheld": return { ...base, convId: conv.id, askId: ask.id, from: e.from === "asker" ? "Asker" : conv.alias, topic: e.topic };
      case "conv.verdict": return { ...base, convId: conv.id, askId: ask.id, alias: conv.alias, fit: e.fit, fitReason: e.fitReason, willing: e.willing, willingReason: e.willingReason };
      case "match.proposed": case "match.approved": case "match.declined": {
        // a candidate hears about a match only if it is theirs, and only once the asker has said yes
        if (myConv && (myConv.id !== conv.id || e.stage === "asker")) return null;
        const m = S.matches.get(e.matchId), out = { ...base, matchId: m.id, askId: ask.id };
        if (e.type === "match.proposed") return { ...out, convId: conv.id, alias: conv.alias, rank: m.rank, brief: m.brief, awaiting: e.stage, deadline: e.deadline };
        return e.type === "match.approved" ? { ...out, by: e.by } : { ...out, by: e.by, reason: e.reason };
      }
      case "match.revealed": {
        const m = S.matches.get(e.matchId), party = isAsker || viewer === conv.offererId;
        const who = (uid) => ({ id: uid, name: S.users.get(uid).name });
        return { ...base, matchId: m.id, askId: ask.id, convId: conv.id, alias: conv.alias, brief: m.brief, ...(party ? { asker: who(ask.askerId), offerer: who(conv.offererId) } : {}) };
      }
      case "ask.open": case "ask.filled": return { ...base, askId: ask.id };
      case "meeting.proposed": case "meeting.approved": case "meeting.asked": case "meeting.confirmed": case "meeting.scheduled": {
        const mt = S.meetings.get(e.meetingId), party = viewer === mt.askerId || viewer === mt.offererId;
        if (e.type === "meeting.scheduled") return { ...base, meetingId: mt.id, matchId: mt.matchId, askId: mt.askId, slot: mt.slot, place: mt.place };
        if (!party) return null;
        if (e.type === "meeting.proposed") return { ...base, meetingId: mt.id, matchId: mt.matchId, askId: mt.askId, slot: mt.slot, place: mt.place };
        if (e.type === "meeting.approved") return { ...base, meetingId: mt.id, by: e.by };
        if (e.type === "meeting.asked") return { ...base, meetingId: mt.id };
        return e.byUser === viewer ? { ...base, meetingId: mt.id, by: e.by, happened: e.happened } : null;
      }
      case "ask.queued": return e.userId === viewer ? { ...base, text: e.text } : null;      // only the asker knows their Bots were woken
      case "karma.changed": return e.userId === viewer ? { ...base, userId: e.userId, delta: e.delta, total: e.total } : null;
      default: return null;
    }
  }
  function award(entries) {
    for (const k of entries) { S.karma.push({ id: id("k"), ...k, at: Date.now() }); emit({ type: "karma.changed", userId: k.userId, delta: k.delta, total: total(k.userId) }); }
  }

  // ---- a round ----
  function driverFor(userId) {
    if (hooks[userId]) return webhookDriver(hooks[userId], userId, TURN_TIMEOUT);
    if (process.env.XAI_API_KEY && process.env.XAI_MODEL && S.users.get(userId)?.kind === "persona") return xaiDriver(process.env.XAI_API_KEY, process.env.XAI_MODEL);
    return scripted;
  }
  const side = (userId) => ({ card: S.cards.get(userId), facts: S.facts.get(userId), rules: S.rules.get(userId), recentAccepts: S.accepts.get(userId) ?? 0 });

  function postAsk(askerId, text) {
    const { kind, seats } = inferAsk(text);
    const ask = { id: id("ask"), askerId, text, kind, seats, status: "scouting", spot: SPOTS[S.spot++ % SPOTS.length], queue: [], revealed: 0, aliases: 0, rank: 0 };
    S.asks.set(ask.id, ask);
    const picked = scout(ask, [...S.cards.values()], Object.fromEntries(S.accepts));
    const convs = shuffle(picked).map((offererId) => newConv(ask, offererId));
    emit({ type: "ask.posted", askId: ask.id });
    later(Math.min(700, PACE), () => runRound(ask, convs));
    return ask;
  }
  function newConv(ask, offererId) {
    const c = { id: id("conv"), askId: ask.id, askerId: ask.askerId, offererId, alias: String.fromCharCode(65 + ask.aliases++), status: "talking", history: [], shared: [] };
    S.convs.set(c.id, c); return c;
  }
  function shuffle(a) { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; }

  async function runRound(ask, convs) {
    if (!S.asks.has(ask.id)) return;
    emit({ type: "scout.picked", askId: ask.id, convIds: convs.map((c) => c.id) });
    ask.status = "talking";
    const verdicts = await Promise.all(convs.map((c, i) => sleep(i * Math.min(400, PACE / 2)).then(() => runConv(ask, c))));
    if (!S.asks.has(ask.id)) return;                 // reset mid-round
    const heard = verdicts.filter(Boolean);
    let ranked = finalize(heard, ask.seats).ranked;
    // every round ends with a match: if nobody cleared the bar, the closest fit still goes forward
    if (!ranked.length && heard.length) ranked = [[...heard].sort((a, b) => b.fit - a.fit)[0]];
    ask.queue = [...ask.queue, ...ranked];
    ask.status = "matching"; proposeNext(ask);
  }
  async function runConv(ask, conv) {
    const gone = () => S.convs.get(conv.id) !== conv;
    emit({ type: "conv.started", askId: ask.id, convId: conv.id });
    for (let step = 0; step < TURNS; step++) {
      await sleep(PACE); if (gone()) return null;
      const role = step % 2 === 0 ? "asker" : "offerer", me = role === "asker" ? conv.askerId : conv.offererId, other = role === "asker" ? conv.offererId : conv.askerId;
      const ctx = { role, step, ask, convId: conv.id, me: side(me), other: { card: S.cards.get(other) }, shared: conv.shared, history: conv.history };
      const reply = enforce(await driverFor(me).turn(ctx), side(me)) ?? { text: "…" };
      if (gone()) return null;
      if (reply.withheld) { conv.history.push({ from: role, withheld: reply.withheld }); emit({ type: "conv.withheld", askId: ask.id, convId: conv.id, from: role, topic: reply.withheld }); }
      else {
        conv.history.push({ from: role, text: reply.text });
        // a free-form answer still belongs to the topic it was asked about
        if (role === "offerer") conv.shared.push(reply.fact ?? { topic: (TOPICS_FOR[ask.kind] ?? TOPICS_FOR.coffee)[(step - 1) / 2 - 1] ?? "said", text: reply.text });
        emit({ type: "conv.message", askId: ask.id, convId: conv.id, from: role, text: reply.text, askText: !!reply.askText });
      }
    }
    await sleep(PACE); if (gone()) return null;
    // verdicts are the relay's own rules, whoever drove the conversation, so they stay auditable
    let a = scripted.turn({ role: "asker", step: "verdict", ask, me: side(conv.askerId), other: { card: S.cards.get(conv.offererId) }, shared: conv.shared }).verdict;
    if (process.env.XAI_API_KEY && process.env.XAI_MODEL) {
      // with a model configured, it judges fit so an ask in any wording is scored on meaning; the keyword score is the fallback
      a = await judgeFit(process.env.XAI_API_KEY, process.env.XAI_MODEL, ask, S.cards.get(conv.offererId), conv.shared).catch(() => a);
      if (gone()) return null;
    }
    const o = scripted.turn({ role: "offerer", step: "verdict", ask, me: side(conv.offererId), other: { card: S.cards.get(conv.askerId) }, shared: conv.shared }).verdict;
    conv.status = "done"; conv.verdict = { convId: conv.id, ...a, ...o };
    emit({ type: "conv.verdict", askId: ask.id, convId: conv.id, ...a, ...o });
    return conv.verdict;
  }

  // ---- finalization: the Bot picks, the asker approves, then the offerer, then reveal ----
  function proposeNext(ask) {
    if (ask.revealed >= ask.seats) return fill(ask);
    const { next, queue, open } = promote(ask.queue); ask.queue = queue;
    if (open) { if (ask.revealed) return fill(ask); ask.status = "open"; return emit({ type: "ask.open", askId: ask.id }); }
    const conv = S.convs.get(next.convId), { hits } = scoreFit(ask, S.cards.get(conv.offererId), conv.shared);
    const said = conv.shared.filter((f) => f.topic !== "said").map((f) => f.text);
    const m = { id: id("match"), askId: ask.id, convId: conv.id, rank: ++ask.rank, status: "proposed", stage: "asker",
      brief: { why: `${next.fitReason}. ${said.find((t) => /free|busy|only|after|before|usually/i.test(t)) ?? ""}`.trim(), talkAbout: (hits.length ? hits : S.cards.get(conv.offererId).offers).slice(0, 3) } };
    S.matches.set(m.id, m); await_(m);
  }
  function fill(ask) { if (ask.status !== "filled") { ask.status = "filled"; emit({ type: "ask.filled", askId: ask.id }); } }
  /** Announce who a match is waiting on, and arm the timeout (and the simulated owner, if there is one). */
  function await_(m) {
    const ask = S.asks.get(m.askId), conv = S.convs.get(m.convId), who = m.stage === "asker" ? ask.askerId : conv.offererId;
    m.deadline = Date.now() + APPROVAL_TIMEOUT;
    emit({ type: "match.proposed", matchId: m.id, askId: ask.id, convId: conv.id, stage: m.stage, deadline: m.deadline });
    m.timer = later(APPROVAL_TIMEOUT, () => decline(m, m.stage, "timeout"));
    if (simulated(who)) later(AUTO, () => m.status === "proposed" && approve(m, who));
  }
  function approve(m, userId) {
    const ask = S.asks.get(m.askId), conv = S.convs.get(m.convId);
    if (m.status !== "proposed") throw new Error("This match is no longer waiting");
    if (userId !== (m.stage === "asker" ? ask.askerId : conv.offererId)) throw new Error("Not your turn to answer");
    clearTimeout(m.timer);
    emit({ type: "match.approved", matchId: m.id, askId: ask.id, convId: conv.id, stage: m.stage, by: m.stage });
    if (m.stage === "asker") { m.stage = "offerer"; return await_(m); }
    m.status = "revealed"; ask.revealed++; S.accepts.set(conv.offererId, (S.accepts.get(conv.offererId) ?? 0) + 1);
    emit({ type: "match.revealed", matchId: m.id, askId: ask.id, convId: conv.id });
    award(karmaFor({ type: "revealed", helper: conv.offererId }));
    proposeMeeting(m, ask, conv);
    ask.revealed >= ask.seats ? fill(ask) : proposeNext(ask);
  }
  function decline(m, by, reason = "declined") {
    if (m.status !== "proposed") return;
    const ask = S.asks.get(m.askId); clearTimeout(m.timer);
    m.status = reason === "timeout" ? "timed_out" : "declined";
    emit({ type: "match.declined", matchId: m.id, askId: ask.id, convId: m.convId, stage: m.stage, by, reason });
    proposeNext(ask);
  }

  // ---- the meeting ----
  function proposeMeeting(m, ask, conv) {
    const slot = new Date(); slot.setDate(slot.getDate() + 1); slot.setHours(16, 0, 0, 0);
    const place = MEET_PLACES[S.meetings.size % MEET_PLACES.length];
    const mt = { id: id("meet"), matchId: m.id, askId: ask.id, askerId: ask.askerId, offererId: conv.offererId, slot: slot.toISOString(), place, approvals: {}, says: {}, status: "proposed", brief: m.brief };
    S.meetings.set(mt.id, mt);
    announceMeeting(mt);
  }
  function announceMeeting(mt) {
    emit({ type: "meeting.proposed", meetingId: mt.id });
    for (const uid of [mt.askerId, mt.offererId]) if (simulated(uid)) later(AUTO, () => mt.status === "proposed" && !mt.approvals[roleIn(mt, uid)] && approveMeeting(mt, uid));
  }
  const roleIn = (mt, userId) => (userId === mt.askerId ? "asker" : userId === mt.offererId ? "offerer" : null);
  function approveMeeting(mt, userId, slot) {
    const role = roleIn(mt, userId); if (!role) throw new Error("Not your meeting");
    if (slot) moveMeeting(mt, userId, slot);
    if (mt.approvals[role]) return;
    mt.approvals[role] = true; emit({ type: "meeting.approved", meetingId: mt.id, by: role });
    if (mt.approvals.asker && mt.approvals.offerer) { mt.status = "scheduled"; emit({ type: "meeting.scheduled", meetingId: mt.id }); }
  }
  /** A Scheduler Bot that read a real calendar can move the slot. That restarts both approvals and approves nothing. */
  function moveMeeting(mt, userId, slot) {
    if (!roleIn(mt, userId)) throw new Error("Not your meeting");
    if (Number.isNaN(Date.parse(slot))) throw new Error("slot must be an ISO time");
    const moved = new Date(slot).toISOString();
    if (moved !== mt.slot && mt.status === "proposed") { mt.slot = moved; mt.approvals = {}; announceMeeting(mt); }
  }
  /** The web app is the front door: an ask typed there wakes the student's own Manager Bot through its routine webhook. */
  async function wake(userId, hook, text) {
    let r;
    try { r = await fetch(hook.url, { method: "POST", headers: { "content-type": "application/json", authorization: `Bearer ${hook.key}` }, body: JSON.stringify({ ask: text, userId }), signal: AbortSignal.timeout(10000) }); }
    catch { throw Object.assign(new Error("Could not reach your Manager Bot's routine"), { code: 502 }); }
    if (!r.ok) throw Object.assign(new Error(`Your Manager Bot's routine answered ${r.status}`), { code: 502 });
    emit({ type: "ask.queued", userId, text });
  }
  function confirmMeeting(mt, userId, happened, helpful) {
    const role = roleIn(mt, userId); if (!role) throw new Error("Not your meeting");
    if (mt.status !== "asked" || role in mt.says) return;
    mt.says[role] = !!happened; if (role === "asker") mt.helpful = !!helpful;
    emit({ type: "meeting.confirmed", meetingId: mt.id, by: role, byUser: userId, happened: !!happened });
    if ("asker" in mt.says && "offerer" in mt.says) {
      mt.status = mt.says.asker && mt.says.offerer ? "happened" : "no_show";
      award(karmaFor({ type: "meeting", asker: mt.askerId, helper: mt.offererId, askerSays: mt.says.asker, helperSays: mt.says.offerer, helpful: mt.helpful }));
    }
  }
  function advance(what) {
    if (what === "timeout") for (const m of S.matches.values()) if (m.status === "proposed") decline(m, m.stage, "timeout");
    if (what === "slot") for (const mt of S.meetings.values()) if (mt.status === "scheduled") {
      mt.status = "asked"; emit({ type: "meeting.asked", meetingId: mt.id });
      for (const uid of [mt.askerId, mt.offererId]) if (simulated(uid)) later(AUTO, () => confirmMeeting(mt, uid, true, false));
    }
  }

  // ---- Bot-facing API: a student's own team of Grok Bots drives the round step by step ----
  // The relay still stands in for everyone else, still hands out aliases, and still decides what anyone may see.
  const KINDS = ["study", "teammate", "coffee", "cofounder", "advice"], refs = new Map();      // "<viewer>:<ref>" -> userId
  const mine = (cond) => { if (!cond) throw Object.assign(new Error("That is not yours"), { code: 403 }); };
  function refFor(viewer, userId) {
    for (const [k, v] of refs) if (v === userId && k.startsWith(`${viewer}:`)) return k.slice(viewer.length + 1);
    const r = id("cand"); refs.set(`${viewer}:${r}`, userId); return r;
  }
  /** Public cards a Manager Bot may scout: offers and openTo under an opaque ref, never a name. */
  const botCards = (viewer, kind) => [...S.cards.values()].filter((c) => c.userId !== viewer && (!kind || c.openTo.includes(kind)))
    .map((c) => ({ ref: refFor(viewer, c.userId), offers: c.offers, openTo: c.openTo }));
  function botAsk(askerId, body) {
    const text = String(body.text ?? "").trim(); if (!text) throw new Error("Say what you need");
    const guess = inferAsk(text), kind = KINDS.includes(body.kind) ? body.kind : guess.kind;
    const ask = { id: id("ask"), askerId, text, kind, seats: Math.max(1, Math.min(5, Number(body.seats) || guess.seats)), status: "talking",
      spot: SPOTS[S.spot++ % SPOTS.length], queue: [], revealed: 0, aliases: 0, rank: 0, mode: "bot" };
    S.asks.set(ask.id, ask);
    // the Manager's picks, minus anyone whose card is not open to this kind of ask; no picks means the relay scouts
    let picked = [...new Set((body.candidates ?? []).map((r) => refs.get(`${askerId}:${r}`)).filter((u) => u && S.cards.get(u).openTo.includes(kind)))].slice(0, 5);
    if (!picked.length) picked = scout(ask, [...S.cards.values()], Object.fromEntries(S.accepts));
    const convs = picked.map((u) => newConv(ask, u));
    emit({ type: "ask.posted", askId: ask.id }); emit({ type: "scout.picked", askId: ask.id, convIds: convs.map((c) => c.id) });
    for (const c of convs) emit({ type: "conv.started", askId: ask.id, convId: c.id });
    return { askId: ask.id, kind, seats: ask.seats, conversations: convs.map((c) => ({ convId: c.id, alias: c.alias, offers: S.cards.get(c.offererId).offers })) };
  }
  async function botSay(userId, conv, text) {
    const ask = S.asks.get(conv.askId); mine(conv.askerId === userId);
    if (conv.status !== "talking" || conv.history.length >= TURNS) throw new Error("This conversation is over. Send your verdict.");
    if (!String(text ?? "").trim()) throw new Error("Say something");
    emit({ type: "conv.message", askId: ask.id, convId: conv.id, from: "asker", text: String(text), askText: conv.history.length === 0 });
    conv.history.push({ from: "asker", text: String(text) });
    await sleep(Math.min(PACE, 600));
    const ctx = { role: "offerer", step: conv.history.length, ask, convId: conv.id, me: side(conv.offererId), other: { card: S.cards.get(userId) }, shared: conv.shared, history: conv.history, question: String(text) };
    const driver = driverFor(conv.offererId), reply = enforce(driver === scripted ? answerFor(ctx) : await driver.turn(ctx), side(conv.offererId)) ?? { text: "…" };
    if (reply.withheld) { conv.history.push({ from: "offerer", withheld: reply.withheld }); emit({ type: "conv.withheld", askId: ask.id, convId: conv.id, from: "offerer", topic: reply.withheld }); }
    else { conv.history.push({ from: "offerer", text: reply.text }); conv.shared.push(reply.fact ?? { topic: "said", text: reply.text }); emit({ type: "conv.message", askId: ask.id, convId: conv.id, from: "offerer", text: reply.text }); }
    return { reply: reply.withheld ? { withheld: reply.withheld } : { text: reply.text }, turnsLeft: Math.floor((TURNS - conv.history.length) / 2) };
  }
  function botVerdict(userId, conv, body) {
    const ask = S.asks.get(conv.askId); mine(conv.askerId === userId);
    if (!conv.verdict) {
      const fit = Math.max(0, Math.min(10, Math.round(Number(body.fit) || 0))), fitReason = String(body.reason ?? "").trim().slice(0, 140) || "No reason given";
      // the other side's willingness is theirs to give, so it never comes from the asker's Bot
      const o = scripted.turn({ role: "offerer", step: "verdict", ask, me: side(conv.offererId), other: { card: S.cards.get(userId) }, shared: conv.shared }).verdict;
      conv.status = "done"; conv.verdict = { convId: conv.id, fit, fitReason, ...o };
      emit({ type: "conv.verdict", askId: ask.id, convId: conv.id, fit, fitReason, ...o });
    }
    return { fit: conv.verdict.fit, willing: conv.verdict.willing, willingReason: conv.verdict.willingReason };
  }
  function botFinalize(userId, ask) {
    mine(ask.askerId === userId);
    if (ask.status === "talking") {
      const convs = [...S.convs.values()].filter((c) => c.askId === ask.id), waiting = convs.filter((c) => !c.verdict).map((c) => c.alias);
      if (waiting.length) throw new Error(`Still need a verdict for ${waiting.join(", ")}`);
      ask.queue = finalize(convs.map((c) => c.verdict), ask.seats).ranked; ask.status = "matching"; proposeNext(ask);
    }
    return askStatus(userId, ask);
  }
  function askStatus(viewer, ask) {
    const party = (conv) => viewer === ask.askerId || viewer === conv.offererId;
    return {
      askId: ask.id, status: ask.status,
      matches: [...S.matches.values()].filter((m) => m.askId === ask.id).map((m) => { const c = S.convs.get(m.convId); return { matchId: m.id, alias: c.alias, status: m.status, awaiting: m.status === "proposed" ? m.stage : null, brief: m.brief,
        ...(m.status === "revealed" && party(c) ? { person: S.users.get(viewer === ask.askerId ? c.offererId : ask.askerId).name } : {}) }; }),
      meetings: [...S.meetings.values()].filter((mt) => mt.askId === ask.id && roleIn(mt, viewer)).map((mt) => ({ meetingId: mt.id, slot: mt.slot, status: mt.status, approved: mt.approvals })),
    };
  }
  /** Everything waiting on this person: the human checks their Bots should bring to them. */
  function inbox(userId) {
    const out = { approvals: [], meetingsToApprove: [], meetingsToConfirm: [] };
    for (const m of S.matches.values()) if (m.status === "proposed") {
      const ask = S.asks.get(m.askId), conv = S.convs.get(m.convId), role = m.stage === "asker" && ask.askerId === userId ? "asker" : m.stage === "offerer" && conv.offererId === userId ? "offerer" : null;
      if (role) out.approvals.push({ matchId: m.id, role, alias: conv.alias, brief: m.brief, ask: { kind: ask.kind, text: ask.text } });
    }
    for (const mt of S.meetings.values()) { const role = roleIn(mt, userId); if (!role) continue;
      if (mt.status === "proposed" && !mt.approvals[role]) out.meetingsToApprove.push({ meetingId: mt.id, slot: mt.slot });
      if (mt.status === "asked" && !(role in mt.says)) out.meetingsToConfirm.push({ meetingId: mt.id, slot: mt.slot }); }
    return out;
  }

  // a look is palette indices, exact colours from a selfie, facial hair and glasses; anything else is dropped
  function cleanLook(l) {
    const out = {};
    for (const k of ["skin", "hair", "style", "top"]) if (k in l) out[k] = Math.max(0, Math.floor(Number(l[k]) || 0));
    for (const k of ["skinHex", "hairHex", "topHex"]) if (typeof l[k] === "string" && /^#[0-9a-f]{6}$/i.test(l[k])) out[k] = l[k].toLowerCase();
    if (["none", "stubble", "mustache", "goatee", "beard"].includes(l.beard)) out.beard = l.beard;
    if ("glasses" in l) out.glasses = !!l.glasses;
    return out;
  }
  // busy intervals from Google free/busy: ISO start/end pairs only, at most 300
  const cleanBusy = (xs) => xs.slice(0, 300).map((b) => ({ start: new Date(b?.start), end: new Date(b?.end) })).filter((b) => !isNaN(b.start) && !isNaN(b.end) && b.end > b.start).map((b) => ({ start: b.start.toISOString(), end: b.end.toISOString() }));
  function join(body) {
    const uid = id("u"), name = String(body.name ?? "").trim(); if (!name) throw new Error("A name is required");
    // a real person from onboarding brings their own facts, rules and look; the demo desk's newcomers get defaults
    const real = body.kind === "real", p = real ? sanitize(body) : null;
    const openTo = real ? p.openTo : Array.isArray(body.openTo) ? body.openTo : [], offers = real ? p.offers : Array.isArray(body.offers) ? body.offers.map(String) : [];
    const hide = real ? p.hide : ["grades", "contact"];
    const look = body.look && typeof body.look === "object" ? cleanLook(body.look) : undefined;
    addUser({ id: uid, name, place: String(body.place ?? "tresidder"), kind: real ? "real" : "persona", ...(look ? { look } : {}), ...(body.linkedin ? { linkedin: String(body.linkedin) } : {}), ...(real && Array.isArray(body.busy) ? { busy: cleanBusy(body.busy) } : {}) },
      { userId: uid, offers, openTo, affiliation: String(body.affiliation ?? "") },
      TOPICS.map((topic) => ({ topic, share: !hide.includes(topic) })),
      real ? p.facts : [{ topic: "availability", text: "Free most afternoons this week." }]);
    S.accepts.set(uid, 0);
    if (body.invitedBy && S.users.has(body.invitedBy)) award(karmaFor({ type: "invite_briefed", inviter: body.invitedBy }));
    // an open ask is re-scored against the newcomer
    for (const ask of S.asks.values()) if (ask.status === "open" && scout(ask, [S.cards.get(uid)], {}).length) { ask.status = "talking"; runRound(ask, [newConv(ask, uid)]); }
    return { id: uid };
  }
  function ics(mt) {
    const z = (d) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d+/, ""), start = new Date(mt.slot), end = new Date(start.getTime() + 30 * 60000);
    return ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Grokmate//Relay//EN", "BEGIN:VEVENT", `UID:${mt.id}@grokmate`, `DTSTAMP:${z(new Date())}`, `DTSTART:${z(start)}`, `DTEND:${z(end)}`,
      "SUMMARY:Grokmate: meet your match", `LOCATION:${mt.place.name}`, `DESCRIPTION:${`${mt.brief.why} Talk about: ${mt.brief.talkAbout.join(", ")}`.replace(/[,;\\]/g, (c) => `\\${c}`)}`, "END:VEVENT", "END:VCALENDAR"].join("\r\n");
  }

  // ---- HTTP ----
  const CORS = { "access-control-allow-origin": "*", "access-control-allow-methods": "GET,POST,PUT,OPTIONS", "access-control-allow-headers": "content-type,authorization" };
  const json = (res, code, body) => { res.writeHead(code, { ...CORS, "content-type": "application/json" }); res.end(JSON.stringify(body)); };
  const need = (map, key, what) => { const v = map.get(key); if (!v) throw Object.assign(new Error(`No such ${what}`), { code: 404 }); return v; };

  async function handle(req, res) {
    const url = new URL(req.url, "http://relay"), as = url.searchParams.get("as") || "spectator", parts = url.pathname.split("/").filter(Boolean), M = req.method;
    if (M === "OPTIONS") { res.writeHead(204, CORS); return res.end(); }
    let body = {};
    if (M === "POST" || M === "PUT") { let raw = ""; for await (const ch of req) raw += ch; body = raw ? JSON.parse(raw) : {}; }
    const member = () => { if (!S.users.has(as)) throw Object.assign(new Error("Say who you are with ?as=<userId>"), { code: 403 }); return as; };

    if (M === "GET" && parts[0] === "events") {
      res.writeHead(200, { ...CORS, "content-type": "text/event-stream", "cache-control": "no-cache", connection: "keep-alive" });
      const c = { viewer: as, res, seq: 0 }; clients.add(c);
      for (const e of S.log) send(c, e);
      const beat = setInterval(() => res.write(": beat\n\n"), 15000);
      req.on("close", () => { clearInterval(beat); clients.delete(c); });
      return;
    }
    if (M === "GET" && parts[0] === "state") {
      const users = [...S.users.values()].map(({ id, name, place, kind, look }) => ({ id, name, place, kind, ...(look ? { look } : {}) }));
      const leaderboard = users.map((u) => ({ userId: u.id, name: u.name, points: total(u.id) })).sort((a, b) => b.points - a.points || a.name.localeCompare(b.name));
      const me = users.find((u) => u.id === as);
      return json(res, 200, { me: me ? { ...me, botsConnected: S.hooks.has(as) } : null, users, leaderboard, clock: Date.now() });
    }
    if (parts[0] === "card" && parts[1]) {
      const card = need(S.cards, parts[1], "card"), own = as === parts[1];
      if (M === "PUT") {
        if (!own) throw Object.assign(new Error("Only the owner can change a card"), { code: 403 });
        for (const k of ["offers", "openTo", "affiliation"]) if (k in body) card[k] = body[k];
        if (Array.isArray(body.rules)) S.rules.set(as, body.rules.map((r) => ({ topic: String(r.topic), share: !!r.share })));
      }
      return json(res, 200, { card, ...(own ? { disclosure: { rules: S.rules.get(as) }, busy: S.users.get(as)?.busy ?? null } : {}) });
    }
    if (M === "POST" && parts[0] === "join") return json(res, 200, join(body));
    if (M === "GET" && parts[0] === "oauth" && parts[1] === "google") {
      if (!google.googleReady()) return json(res, 501, { error: "Google Calendar isn't set up (no GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET)" });
      if (parts[2] === "start") { res.writeHead(302, { ...CORS, location: google.startUrl(req) }); return res.end(); }
      if (parts[2] === "callback") { res.writeHead(200, { ...CORS, "content-type": "text/html; charset=utf-8" }); return res.end(await google.callback(req, url)); }
    }
    if (M === "GET" && parts[0] === "onboard" && parts[1] === "connections") return json(res, 200, { google: google.googleReady() });
    if (M === "GET" && parts[0] === "onboard" && parts[1] === "gcal") return json(res, 200, google.take(parts[2]));
    if (M === "POST" && parts[0] === "onboard" && parts[1] === "suggest") return json(res, 200, await suggestProfile(body));
    if (M === "POST" && parts[0] === "onboard" && parts[1] === "look") return json(res, 200, await lookFromSelfie(body.photo));
    if (M === "GET" && parts[0] === "onboard" && parts[1] === "who") return json(res, 200, await whoIs(url.searchParams.get("url")));
    if (M === "POST" && parts[0] === "onboard" && parts[1] === "chat") return json(res, 200, await interview(body));
    if (M === "POST" && parts[0] === "asks") {
      const text = String(body.text ?? "").trim(); if (!text) throw new Error("Say what you need");
      const me = member(), hook = S.hooks.get(me);
      if (hook) { await wake(me, hook, text); return json(res, 200, { forwarded: true }); }     // their own Bots run the round
      return json(res, 200, { askId: postAsk(me, text).id });
    }
    if (M === "POST" && parts[0] === "matches") {
      const m = need(S.matches, parts[1], "match"), ask = S.asks.get(m.askId), conv = S.convs.get(m.convId);
      if (parts[2] === "approve") approve(m, member());
      else if (parts[2] === "decline") {
        if (member() !== (m.stage === "asker" ? ask.askerId : conv.offererId)) throw new Error("Not your turn to answer");
        decline(m, m.stage);
      }
      return json(res, 200, { ok: true });
    }
    if (parts[0] === "meetings") {
      const mt = need(S.meetings, parts[1], "meeting");
      if (M === "GET" && parts[2] === "invite.ics") {
        if (!roleIn(mt, as)) throw Object.assign(new Error("Not your meeting"), { code: 403 });
        res.writeHead(200, { ...CORS, "content-type": "text/calendar", "content-disposition": 'attachment; filename="grokmate.ics"' }); return res.end(ics(mt));
      }
      if (M === "POST" && parts[2] === "approve") approveMeeting(mt, member(), body.slot);
      if (M === "POST" && parts[2] === "propose") moveMeeting(mt, member(), body.slot);
      if (M === "POST" && parts[2] === "confirm") confirmMeeting(mt, member(), body.happened, body.helpful);
      return json(res, 200, { ok: true });
    }
    if (M === "POST" && parts[0] === "demo" && parts[1] === "clock") { advance(body.advance); return json(res, 200, { ok: true }); }
    if (M === "POST" && parts[0] === "demo" && parts[1] === "reset") {
      reset(); for (const c of clients) c.res.end(); clients.clear();       // clients reconnect and replay the fresh log
      return json(res, 200, { ok: true });
    }
    if (parts[0] === "bot" && parts[2] !== "turn") {
      // same trust as the web app's own calls (?as=): BOT_KEY guards only the turn-reply path below
      const me = member();
      if (M === "GET" && parts[1] === "cards") return json(res, 200, { cards: botCards(me, url.searchParams.get("kind")) });
      if (M === "GET" && parts[1] === "inbox") return json(res, 200, inbox(me));
      if (parts[1] === "hook") {
        if (M === "PUT") {
          if (!body.url) S.hooks.delete(me);
          else { if (!/^https?:\/\//.test(String(body.url)) || !body.key) throw new Error("Give the routine's url and key"); S.hooks.set(me, { url: String(body.url), key: String(body.key) }); }
        }
        return json(res, 200, { connected: S.hooks.has(me) });       // the key itself is never sent back
      }
      if (M === "POST" && parts[1] === "asks" && !parts[2]) return json(res, 200, botAsk(me, body));
      if (parts[1] === "asks" && parts[2]) {
        const ask = need(S.asks, parts[2], "ask");
        if (M === "POST" && parts[3] === "finalize") return json(res, 200, botFinalize(me, ask));
        if (M === "GET") { mine(ask.askerId === me || [...S.convs.values()].some((c) => c.askId === ask.id && c.offererId === me)); return json(res, 200, askStatus(me, ask)); }
      }
      if (M === "POST" && parts[1] === "convs" && parts[2]) {
        const conv = need(S.convs, parts[2], "conversation");
        if (parts[3] === "say") return json(res, 200, await botSay(me, conv, body.text));
        if (parts[3] === "verdict") return json(res, 200, botVerdict(me, conv, body));
      }
    }
    if (M === "POST" && parts[0] === "bot" && parts[2] === "turn") {
      if (!process.env.BOT_KEY || req.headers.authorization !== `Bearer ${process.env.BOT_KEY}`) throw Object.assign(new Error("Bad bot key"), { code: 401 });
      const reply = body.withheld ? { withheld: String(body.withheld) } : { text: String(body.text ?? "") };
      return json(res, 200, { ok: resolveBotTurn(parts[1], body.convId, reply) });
    }
    json(res, 404, { error: "Not found" });
  }

  reset();
  const server = http.createServer((req, res) => handle(req, res).catch((e) => json(res, e.code ?? 400, { error: e.message })));
  server.on("close", () => { for (const t of timers) clearTimeout(t); for (const c of clients) c.res.end(); });
  return server;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const port = env("PORT", 8787);
  createRelay().listen(port, () => console.log(`Grokmate relay on http://localhost:${port}`));
}
