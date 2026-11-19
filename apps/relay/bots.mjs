// Bot drivers. The relay talks to every Bot through one call:
//   turn(ctx) -> { text } | { withheld: topic } | { verdict: {...} }
// ctx = { role: "asker" | "offerer", step, ask, convId, me: { card, facts, rules, recentAccepts }, other: { card }, shared: Fact[], history }
// The relay post-filters whatever comes back, so a driver that ignores a disclosure rule still cannot leak.
import { readFileSync, existsSync } from "node:fs";
import { keywords, overlap } from "./rules.mjs";

const KIND = { study: "study help", teammate: "a teammate", coffee: "a coffee chat", cofounder: "a cofounder", advice: "some advice" };
const QUESTIONS = {
  classes: "Which related classes has your person taken?",
  grades: "How did those classes go for them?",
  internships: "Any internship experience that bears on this?",
  projects: "What have they built or done that's close to this?",
  availability: "When are they free?",
  startup: "Are they working on something of their own?",
};
/** The three things the asker's Bot asks about, by kind. Order matters: it is the order they are asked in. */
export const TOPICS_FOR = {
  study: ["classes", "grades", "availability"], teammate: ["projects", "internships", "availability"], advice: ["internships", "startup", "projects"],
  cofounder: ["startup", "projects", "availability"], coffee: ["projects", "classes", "availability"],
};

/** The fact a Bot would reach for on a topic: the one closest to the ask, else its first. */
export function pickFact(facts, topic, askText) {
  const words = keywords(askText), mine = facts.filter((f) => f.topic === topic);
  return mine.sort((a, b) => overlap(words, b.text) - overlap(words, a.text))[0] ?? null;
}
const shares = (rules, topic) => rules.find((r) => r.topic === topic)?.share !== false;

/** Fit from what the asker's Bot actually learned: the public card plus shared facts. Withheld facts cannot raise it. */
export function scoreFit(ask, otherCard, shared) {
  const words = keywords(ask.text);
  const fromOffers = [...words].filter((w) => keywords(otherCard.offers.join(" ")).has(w));
  const fromShared = [...words].filter((w) => !fromOffers.includes(w) && keywords(shared.map((f) => f.text).join(" ")).has(w));
  const timed = shared.some((f) => f.topic === "availability") ? 1 : 0;
  const backedUp = shared.some((f) => overlap(words, f.text) > 0) ? 1 : 0;      // something said in the room supports the card
  const fit = Math.max(0, Math.min(10, Math.round(2 + 2 * fromOffers.length + 1.5 * fromShared.length + timed + backedUp)));
  const hits = otherCard.offers.filter((o) => overlap(words, o) > 0);
  const fitReason = hits.length ? `Covers ${hits.slice(0, 2).join(" and ")}` : "Little overlap with the ask";
  return { fit, fitReason, hits };
}

/** Deterministic Bots: no key, no network, same lines every run. */
export const scripted = {
  name: "scripted",
  turn(ctx) {
    const topics = TOPICS_FOR[ctx.ask.kind] ?? TOPICS_FOR.coffee;
    if (ctx.step === "verdict") {
      if (ctx.role === "asker") { const { fit, fitReason } = scoreFit(ctx.ask, ctx.other.card, ctx.shared); return { verdict: { fit, fitReason } }; }
      const open = ctx.me.card.openTo.includes(ctx.ask.kind), busy = ctx.me.recentAccepts >= 3;
      return { verdict: { willing: open && !busy, willingReason: !open ? `Not open to ${ctx.ask.kind} asks` : busy ? "Already took on three asks this week" : `Open to ${ctx.ask.kind} asks, and has room this week` } };
    }
    if (ctx.role === "asker") {
      if (ctx.step === 0) return { text: `My person is looking for ${KIND[ctx.ask.kind]}. In their words: "${ctx.ask.text}"`, askText: true };
      return { text: QUESTIONS[topics[ctx.step / 2 - 1]] };
    }
    if (ctx.step === 1) return { text: `My person can help with ${ctx.me.card.offers.slice(0, 2).join(" and ")}.` };
    const topic = topics[(ctx.step - 1) / 2 - 1], fact = pickFact(ctx.me.facts, topic, ctx.ask.text);
    if (!fact) return { text: "Nothing I can add on that one." };
    return shares(ctx.me.rules, topic) ? { text: fact.text, fact } : { withheld: topic };
  },
};

// What a question is about, so a scripted Bot can answer a real Bot's free-form line.
const ABOUT = [
  ["grades", /grade|gpa|score|how (did|do) they do|how well/i], ["internships", /intern|work experience|worked at|job/i],
  ["startup", /startup|company of their own|working on (something|anything) of their own|found(ing|er)/i],
  ["availability", /free|available|availability|when |what time|schedule|this week|weekend|tonight|tomorrow/i],
  ["classes", /class|course|taken|took|enrolled/i], ["projects", /built|build|project|made|shipped|experience|done/i],
];
/** A scripted owner's Bot answering whatever it was just asked, under the same disclosure rules. */
export function answerFor(ctx) {
  const topic = ABOUT.find(([, re]) => re.test(ctx.question ?? ""))?.[0];
  if (!topic) return { text: `My person can help with ${ctx.me.card.offers.slice(0, 2).join(" and ")}.` };
  const fact = pickFact(ctx.me.facts, topic, ctx.ask.text);
  if (!fact) return { text: "Nothing I can add on that one." };
  return shares(ctx.me.rules, topic) ? { text: fact.text, fact } : { withheld: topic };
}

// ---- Real Grok Bots (untested: needs a Bot with a webhook-triggered routine and a public relay URL) ----
// bots.json: { "<userId>": { "url": "<routine webhook URL>", "key": "<routine key>" } }
// The relay POSTs the turn context to the routine; the Bot answers by calling POST /bot/:userId/turn.
const pending = new Map();
export function botHooks(path = new URL("./bots.json", import.meta.url)) {
  return existsSync(path) ? JSON.parse(readFileSync(path, "utf8")) : {};
}
export function resolveBotTurn(userId, convId, reply) {
  const k = `${userId}:${convId}`, done = pending.get(k);
  if (!done) return false;
  pending.delete(k); done(reply); return true;
}
// PUBLIC_URL is where a Bot's cloud computer can reach this relay (a tunnel or a deploy), so each turn says where to answer.
const replyUrl = (userId) => (process.env.PUBLIC_URL ? `${process.env.PUBLIC_URL.replace(/\/$/, "")}/bot/${userId}/turn` : undefined);
export function webhookDriver(hook, userId, timeoutMs) {
  return {
    name: "webhook",
    async turn(ctx) {
      const wait = new Promise((res) => { pending.set(`${userId}:${ctx.convId}`, res); setTimeout(() => res(null), timeoutMs); });
      try {
        await fetch(hook.url, { method: "POST", headers: { "content-type": "application/json", authorization: `Bearer ${hook.key}` }, body: JSON.stringify({ ...publicContext(ctx), userId, replyTo: replyUrl(userId) }) });
      } catch { /* fall through to the timeout */ }
      return (await wait) ?? scripted.turn(ctx);
    },
  };
}

// ---- Personas through the xAI API (untested: no key was available when this was written) ----
// Active only when both XAI_API_KEY and XAI_MODEL are set. XAI_MODEL has no default on purpose: check the current
// model ids in the xAI docs rather than trusting one written here.
export function xaiDriver(key, model, base = process.env.XAI_BASE_URL ?? "https://api.x.ai/v1") {
  return {
    name: "xai",
    async turn(ctx) {
      if (ctx.step === "verdict") return scripted.turn(ctx);            // verdicts stay rule-based and auditable
      const hidden = ctx.me.rules.filter((r) => !r.share).map((r) => r.topic);
      const system = [
        `You are a student's personal Bot in an anonymous matching conversation. Never state your owner's name, dorm or contact details.`,
        ctx.role === "asker" ? `Your owner's ask: "${ctx.ask.text}". Ask one short question to judge fit.` : `Answer the other Bot briefly from what you know about your owner.`,
        `You may use: ${JSON.stringify(ctx.me.facts.filter((f) => !hidden.includes(f.topic)).map((f) => f.text))}.`,
        hidden.length ? `If asked about ${hidden.join(", ")}, reply with exactly WITHHELD:<topic>.` : "",
        `One or two sentences.`,
      ].join(" ");
      try {
        const r = await fetch(`${base}/chat/completions`, {
          method: "POST", headers: { "content-type": "application/json", authorization: `Bearer ${key}` },
          body: JSON.stringify({ model, messages: [{ role: "system", content: system }, ...ctx.history.map((h) => ({ role: h.from === ctx.role ? "assistant" : "user", content: h.text ?? "(withheld)" }))] }),
        });
        const text = (await r.json()).choices?.[0]?.message?.content?.trim();
        if (!r.ok || !text) return scripted.turn(ctx);
        const held = text.match(/^WITHHELD:\s*(\w+)/i);
        return held ? { withheld: held[1].toLowerCase() } : { text };
      } catch { return scripted.turn(ctx); }
    },
  };
}

/** What a Bot outside the relay is sent: its own owner's context only, never the other side's identity. */
function publicContext(ctx) {
  return { convId: ctx.convId, role: ctx.role, step: ctx.step, ask: { kind: ctx.ask.kind, text: ctx.ask.text }, history: ctx.history, otherCard: ctx.other.card.offers };
}

/** If a reply quotes a fact its owner's rules hide, it becomes a withheld line. The model's good behaviour is not the boundary. */
export function enforce(reply, me) {
  if (!reply?.text) return reply;
  const low = reply.text.toLowerCase();
  for (const f of me.facts) if (!shares(me.rules, f.topic) && low.includes(f.text.toLowerCase().replace(/\.$/, ""))) return { withheld: f.topic };
  return reply;
}
