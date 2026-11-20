import test from "node:test";
import assert from "node:assert/strict";
process.env.PACE_MS = "4"; process.env.APPROVAL_TIMEOUT_MS = "60000";
const { createRelay } = await import("./server.mjs");
const { YOU, PERSONAS } = await import("./seed.mjs");

async function boot() {
  const server = createRelay(); await new Promise((r) => server.listen(0, r));
  const base = `http://localhost:${server.address().port}`;
  const call = async (path, as, method = "GET", body) => {
    const r = await fetch(`${base}${path}${path.includes("?") ? "&" : "?"}as=${as}`, { method, headers: { "content-type": "application/json" }, body: body ? JSON.stringify(body) : undefined });
    return { status: r.status, body: await r.json().catch(() => null) };
  };
  /** Follow a viewer's stream into an array. */
  const watch = (as) => {
    const events = [], ctl = new AbortController();
    (async () => {
      const r = await fetch(`${base}/events?as=${as}`, { signal: ctl.signal }); let buf = "";
      for await (const chunk of r.body) { buf += Buffer.from(chunk).toString(); let i; while ((i = buf.indexOf("\n\n")) >= 0) { const f = buf.slice(0, i); buf = buf.slice(i + 2); if (f.startsWith("data: ")) events.push(JSON.parse(f.slice(6))); } }
    })().catch(() => {});
    const until = async (pred, ms = 4000) => { const t0 = Date.now(); for (;;) { const e = events.find(pred); if (e) return e; if (Date.now() - t0 > ms) throw new Error(`timed out waiting as ${as}`); await new Promise((r) => setTimeout(r, 5)); } };
    return { events, until, stop: () => ctl.abort() };
  };
  return { server, call, watch, close: () => new Promise((r) => { server.closeAllConnections?.(); server.close(r); }) };
}

test("happy path: ask, round, approvals, reveal, meeting, follow-through, karma", async () => {
  const R = await boot(), me = R.watch("u_you");
  try {
    const before = (await R.call("/state", "u_you")).body.leaderboard;
    const { body } = await R.call("/asks", "u_you", "POST", { text: "find me an iOS teammate for this weekend's hackathon" });
    assert.ok(body.askId);
    const picked = await me.until((e) => e.type === "scout.picked");
    assert.equal(picked.candidates.length, 5);
    const proposed = await me.until((e) => e.type === "match.proposed" && e.awaiting === "asker");
    assert.equal(me.events.filter((e) => e.type === "conv.verdict").length, 5);
    assert.ok(me.events.some((e) => e.type === "conv.withheld"), "a disclosure rule produced a withheld line");
    assert.ok(!me.events.some((e) => e.type === "match.revealed"), "nothing is revealed before both approve");

    assert.equal((await R.call(`/matches/${proposed.matchId}/approve`, "u_maya", "POST")).status, 400);   // not the asker
    assert.equal((await R.call(`/matches/${proposed.matchId}/approve`, "u_you", "POST")).status, 200);
    const revealed = await me.until((e) => e.type === "match.revealed");                                    // the persona's owner auto-approves
    assert.equal(revealed.offerer.name, "Maya Chen"); assert.equal(revealed.asker.id, "u_you");
    await me.until((e) => e.type === "ask.filled");

    const meeting = await me.until((e) => e.type === "meeting.proposed");
    await R.call(`/meetings/${meeting.meetingId}/approve`, "u_you", "POST");
    await me.until((e) => e.type === "meeting.scheduled");
    const ics = await fetch(`http://localhost:${R.server.address().port}/meetings/${meeting.meetingId}/invite.ics?as=u_you`);
    assert.match(await ics.text(), /BEGIN:VEVENT[\s\S]*SUMMARY:Grokmate/);
    assert.equal((await R.call(`/meetings/${meeting.meetingId}/invite.ics`, "u_dev")).status, 403);

    await R.call("/demo/clock", "u_you", "POST", { advance: "slot" });
    await me.until((e) => e.type === "meeting.asked");
    await R.call(`/meetings/${meeting.meetingId}/confirm`, "u_you", "POST", { happened: true, helpful: true });
    await me.until((e) => e.type === "karma.changed" && e.userId === "u_you" && e.delta === 10);
    const after = (await R.call("/state", "u_you")).body.leaderboard, pts = (b, id) => b.find((r) => r.userId === id).points;
    assert.equal(pts(after, "u_you") - pts(before, "u_you"), 10);
    assert.equal(pts(after, "u_maya") - pts(before, "u_maya"), 5 + 20 + 15);
  } finally { me.stop(); await R.close(); }
});

test("redaction: outsiders never learn who is in an ask, and withheld text never leaves the relay", async () => {
  const R = await boot(), me = R.watch("u_you"), spec = R.watch("spectator"), other = R.watch("u_priya"), maya = R.watch("u_maya");
  try {
    const text = "find me an iOS teammate for this weekend's hackathon";
    await R.call("/asks", "u_you", "POST", { text });
    const proposed = await me.until((e) => e.type === "match.proposed");
    assert.ok(!maya.events.some((e) => e.type.startsWith("match.")), "the offerer hears nothing until the asker says yes");
    await R.call(`/matches/${proposed.matchId}/approve`, "u_you", "POST");
    const mine = await maya.until((e) => e.type === "match.proposed" && e.awaiting === "offerer");   // Maya's seat is taken, so no auto-approve
    await R.call(`/matches/${mine.matchId}/approve`, "u_maya", "POST");
    await me.until((e) => e.type === "match.revealed"); await spec.until((e) => e.type === "match.revealed");
    await new Promise((r) => setTimeout(r, 60));

    const people = [YOU, ...PERSONAS], hidden = people.flatMap((p) => p.facts.filter((f) => !p.rules.find((r) => r.topic === f.topic).share).map((f) => f.text));
    for (const [who, stream] of [["spectator", spec], ["u_priya", other]]) {
      const inAsk = stream.events.filter((e) => e.type !== "node.joined"), blob = JSON.stringify(inAsk);
      for (const p of people) { assert.ok(!blob.includes(p.user.id), `${who} saw ${p.user.id}`); if (p.user.name !== "You") assert.ok(!blob.includes(p.user.name), `${who} saw ${p.user.name}`); }
      assert.ok(!blob.includes(text), `${who} saw the ask's words`);
      assert.ok(!inAsk.some((e) => e.type.startsWith("meeting.") && e.type !== "meeting.scheduled"));
      assert.ok(!inAsk.some((e) => e.type === "karma.changed"));
    }
    for (const stream of [me, spec, other, maya]) { const blob = JSON.stringify(stream.events); for (const h of hidden) assert.ok(!blob.includes(h), `leaked: ${h}`); }

    const names = (evs) => JSON.stringify(evs.filter((e) => e.type !== "node.joined"));
    const iRev = me.events.findIndex((e) => e.type === "match.revealed");
    assert.ok(!names(me.events.slice(0, iRev)).includes("Maya"), "the asker learns the name only at reveal");
    assert.ok(names(me.events.slice(iRev)).includes("Maya Chen"));
    assert.ok(maya.events.some((e) => e.type === "scout.picked" && e.candidates.some((c) => c.you)));
  } finally { for (const w of [me, spec, other, maya]) w.stop(); await R.close(); }
});

test("a timeout moves the next match up, and nothing clearing the bar leaves the ask open", async () => {
  const R = await boot(), me = R.watch("u_you");
  try {
    await R.call("/asks", "u_you", "POST", { text: "I need a study partner for Thursday's linear algebra exam" });
    const first = await me.until((e) => e.type === "match.proposed");
    await R.call("/demo/clock", "u_you", "POST", { advance: "timeout" });
    const gone = await me.until((e) => e.type === "match.declined"); assert.equal(gone.reason, "timeout");
    const second = await me.until((e) => e.type === "match.proposed" && e.matchId !== first.matchId);
    assert.ok(second.rank > first.rank);

    await R.call("/asks", "u_you", "POST", { text: "looking for a cofounder who knows marine biology" });
    await me.until((e) => e.type === "ask.open");
  } finally { me.stop(); await R.close(); }
});

test("a student's own Bots can drive a round through the Bot-facing API", async () => {
  const R = await boot(), me = R.watch("u_you"), spec = R.watch("spectator");
  try {
    const { cards } = (await R.call("/bot/cards?kind=study", "u_you")).body;
    assert.ok(cards.length >= 5); assert.ok(!JSON.stringify(cards).match(/u_|Dev|Eli|Noor/), "scouting never shows who a card belongs to");
    const pick = cards.filter((c) => /linear algebra/i.test(c.offers.join(" "))).map((c) => c.ref);
    const ask = (await R.call("/bot/asks", "u_you", "POST", { text: "I need a study partner for Thursday's linear algebra exam", candidates: pick })).body;
    assert.equal(ask.conversations.length, pick.length);

    for (const c of ask.conversations) {
      await R.call(`/bot/convs/${c.convId}/say`, "u_you", "POST", { text: "My person needs help before a linear algebra exam." });
      const g = (await R.call(`/bot/convs/${c.convId}/say`, "u_you", "POST", { text: "How did they do in those classes?" })).body;
      assert.equal(g.reply.withheld, "grades");                                   // every linear algebra persona hides grades
      const a = (await R.call(`/bot/convs/${c.convId}/say`, "u_you", "POST", { text: "When are they free this week?" })).body;
      assert.ok(a.reply.text);
      assert.equal((await R.call(`/bot/convs/${c.convId}/say`, "u_maya", "POST", { text: "hi" })).status, 403);
      const v = (await R.call(`/bot/convs/${c.convId}/verdict`, "u_you", "POST", { fit: c === ask.conversations[0] ? 9 : 5, reason: "Knows the material and is free before Thursday" })).body;
      assert.equal(v.willing, true);
    }
    const done = (await R.call(`/bot/asks/${ask.askId}/finalize`, "u_you", "POST")).body;
    assert.equal(done.matches.length, 1); assert.equal(done.matches[0].awaiting, "asker"); assert.equal(done.matches[0].person, undefined);
    assert.equal((await R.call("/bot/inbox", "u_you")).body.approvals[0].matchId, done.matches[0].matchId);

    await R.call(`/matches/${done.matches[0].matchId}/approve`, "u_you", "POST");
    await me.until((e) => e.type === "match.revealed");
    const after = (await R.call(`/bot/asks/${ask.askId}`, "u_you")).body;
    assert.ok(after.matches[0].person); assert.equal(after.meetings.length, 1);

    const slot = new Date(Date.now() + 3 * 864e5).toISOString();                  // the Scheduler found a different time
    await R.call(`/meetings/${after.meetings[0].meetingId}/approve`, "u_you", "POST", { slot });
    const set = await me.until((e) => e.type === "meeting.scheduled"); assert.equal(set.slot, slot);

    await spec.until((e) => e.type === "match.revealed");
    const outside = JSON.stringify(spec.events.filter((e) => e.type !== "node.joined"));
    assert.ok(!outside.includes("My person needs help before"), "the opening line's wording stays with the people in the ask");
    assert.ok(!outside.includes(after.matches[0].person));
  } finally { me.stop(); spec.stop(); await R.close(); }
});

test("an ask typed in the web app wakes the student's own Manager Bot instead of the scripted round", async () => {
  const http = await import("node:http"), got = [];
  let status = 200;
  const hook = http.createServer((req, res) => { let raw = ""; req.on("data", (c) => (raw += c)); req.on("end", () => { got.push({ auth: req.headers.authorization, body: JSON.parse(raw) }); res.writeHead(status); res.end(); }); });
  await new Promise((r) => hook.listen(0, r));
  const R = await boot(), me = R.watch("u_you"), spec = R.watch("spectator");
  try {
    assert.equal((await R.call("/bot/hook", "u_you")).body.connected, false);
    const set = await R.call("/bot/hook", "u_you", "PUT", { url: `http://localhost:${hook.address().port}/run`, key: "routine-key" });
    assert.deepEqual(set.body, { connected: true });                                  // the key is never echoed
    assert.equal((await R.call("/state", "u_you")).body.me.botsConnected, true);

    const sent = await R.call("/asks", "u_you", "POST", { text: "I need a study partner for Thursday's exam" });
    assert.deepEqual(sent.body, { forwarded: true });
    assert.deepEqual(got[0], { auth: "Bearer routine-key", body: { ask: "I need a study partner for Thursday's exam", userId: "u_you" } });
    await me.until((e) => e.type === "ask.queued");
    await new Promise((r) => setTimeout(r, 80));
    assert.ok(!me.events.some((e) => e.type === "ask.posted"), "the relay does not run a scripted round for someone with their own Bots");
    assert.ok(!JSON.stringify(spec.events).includes("ask.queued") && !JSON.stringify(spec.events).includes("routine-key"));

    status = 500;
    assert.equal((await R.call("/asks", "u_you", "POST", { text: "again" })).status, 502);
    await R.call("/bot/hook", "u_you", "PUT", {});                                    // disconnect: back to the relay's own round
    assert.ok((await R.call("/asks", "u_you", "POST", { text: "find me an iOS teammate" })).body.askId);
  } finally { me.stop(); spec.stop(); await R.close(); await new Promise((r) => hook.close(r)); }
});
