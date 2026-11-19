import test from "node:test";
import assert from "node:assert/strict";
import { inferAsk, scout, finalize, promote, karmaFor } from "./rules.mjs";
import { YOU, PERSONAS } from "./seed.mjs";

const cards = [YOU, ...PERSONAS].map((p) => p.card);
const ask = (text, askerId = "u_you") => ({ askerId, text, ...inferAsk(text) });

test("kind and seats come from the ask's words", () => {
  assert.deepEqual(inferAsk("find me an iOS teammate for this weekend's hackathon"), { kind: "teammate", seats: 1 });
  assert.deepEqual(inferAsk("I need a study partner for Thursday's linear algebra exam"), { kind: "study", seats: 1 });
  assert.equal(inferAsk("who has interned at a robotics startup and will talk to me about it?").kind, "advice");
  assert.equal(inferAsk("looking for teammates for TreeHacks").seats, 3);
  assert.equal(inferAsk("need two teammates for a hackathon").seats, 2);
  assert.equal(inferAsk("anyone who interned at a robotics startup").seats, 2);
  assert.equal(inferAsk("looking for a cofounder").kind, "cofounder");
});

test("scout: consent filter, never the asker, at most five", () => {
  const a = ask("find me an iOS teammate for this weekend's hackathon");
  const picked = scout(a, cards, {});
  assert.ok(picked.length <= 5);
  assert.ok(!picked.includes("u_you"));
  // Aiko offers iOS but is not open to teammate asks, so she is never routed one
  assert.ok(!picked.includes("u_aiko"));
  for (const id of picked) assert.ok(cards.find((c) => c.userId === id).openTo.includes("teammate"));
  assert.equal(picked[0], "u_kofi");
  assert.ok(picked.includes("u_maya"));
  // everyone is open to coffee in this tiny network, yet the asker is still excluded
  assert.ok(!scout({ askerId: "u_maya", text: "coffee", kind: "coffee" }, cards, {}).includes("u_maya"));
});

test("finalize keeps willing fits of 7 or more, best first, and fills seats from the top", () => {
  const v = [
    { convId: "a", fit: 9, willing: true }, { convId: "b", fit: 10, willing: false }, { convId: "c", fit: 6, willing: true },
    { convId: "d", fit: 7, willing: true }, { convId: "e", fit: 8, willing: true },
  ];
  assert.deepEqual(finalize(v, 1).ranked.map((x) => x.convId), ["a", "e", "d"]);
  const three = finalize(v, 2);
  assert.deepEqual(three.proposed.map((x) => x.convId), ["a", "e"]);
  assert.deepEqual(three.queued.map((x) => x.convId), ["d"]);
});

test("a decline or timeout moves the next match up; an empty queue opens the ask", () => {
  const { ranked } = finalize([{ convId: "a", fit: 9, willing: true }, { convId: "b", fit: 8, willing: true }], 1);
  const first = promote(ranked); assert.equal(first.next.convId, "a");
  const second = promote(first.queue); assert.equal(second.next.convId, "b"); assert.equal(second.open, false);
  assert.equal(promote(second.queue).open, true);
  assert.equal(promote(finalize([{ convId: "a", fit: 6, willing: true }], 1).ranked).open, true);
});

test("karma follows the table and only verifiable events", () => {
  const pts = (e) => Object.fromEntries(karmaFor(e).map((k) => [k.userId + ":" + k.reason, k.delta]));
  assert.deepEqual(pts({ type: "invite_briefed", inviter: "i" }), { "i:invite finished their brief": 10 });
  assert.deepEqual(pts({ type: "revealed", helper: "h" }), { "h:accepted an ask": 5 });
  assert.deepEqual(pts({ type: "meeting", asker: "a", helper: "h", askerSays: true, helperSays: true }), { "h:meeting happened": 20, "a:meeting happened": 10 });
  assert.equal(pts({ type: "meeting", asker: "a", helper: "h", askerSays: true, helperSays: true, helpful: true })["h:marked helpful"], 15);
  // both must say yes; the one who did not confirm while the other did is the no-show
  assert.deepEqual(pts({ type: "meeting", asker: "a", helper: "h", askerSays: true, helperSays: false }), { "h:no-show": -15 });
  assert.deepEqual(pts({ type: "meeting", asker: "a", helper: "h", askerSays: undefined, helperSays: true }), { "a:no-show": -15 });
  assert.deepEqual(karmaFor({ type: "meeting", asker: "a", helper: "h", askerSays: false, helperSays: false }), []);
  assert.deepEqual(karmaFor({ type: "declined", user: "x" }), []);
});
