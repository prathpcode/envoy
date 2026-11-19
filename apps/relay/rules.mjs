// Envoy's rules as pure functions: no clock, no network, no state. See PROTOCOL.md.

const STOP = new Set("a an and the for this that these those with from into about are was were has have had who whom will would can could should may might need needs want wants find looking look get got any anyone some someone her his him its our your their them they she you it's me my mine be been being not but too also just than then when what which how why where there here taken talk talks".split(" "));

/** Lowercase, drop possessives and punctuation, and trim common endings so "interned" meets "internship". */
export function stem(word) {
  let w = word.toLowerCase().replace(/['’]s$/, "").replace(/[^a-z0-9]/g, "");
  for (const suf of ["ships", "ship", "ings", "ing", "ed", "es", "s"]) {
    if (w.endsWith(suf) && w.length - suf.length >= 4) { w = w.slice(0, -suf.length); break; }
  }
  return w;
}
export function keywords(text) {
  const out = new Set();
  for (const raw of String(text).split(/[\s/,.;:!?()"]+/)) { const w = stem(raw); if (w.length >= 3 && !STOP.has(w)) out.add(w); }
  return out;
}
/** How many of the ask's keywords appear in a piece of text. */
export function overlap(askWords, text) {
  const have = keywords(text); let n = 0;
  for (const w of askWords) if (have.has(w)) n++;
  return n;
}

const NUMBERS = { two: 2, three: 3, four: 4, five: 5 };
/** Kind and seats from the ask's own words. Seats default to 1; plural teammates mean 3; "anyone who" means 2. */
export function inferAsk(text) {
  const t = String(text).toLowerCase();
  const kind = /co-?founder/.test(t) ? "cofounder"
    : /teammates?|hackathon|\bteam\b/.test(t) ? "teammate"
    : /study|exam|midterm|final|pset|problem set|homework|tutor/.test(t) ? "study"
    : /intern|advice|talk to me|who has|who's taken|who took/.test(t) ? "advice"
    : "coffee";
  const counted = t.match(/\b(\d|two|three|four|five)\s+(?:\w+\s+)?(?:teammates|people|partners|cofounders)/);
  let seats = 1;
  if (counted) seats = Number(counted[1]) || NUMBERS[counted[1]] || 1;
  else if (kind === "teammate" && /teammates/.test(t)) seats = 3;
  else if (/anyone who/.test(t)) seats = 2;
  return { kind, seats: Math.max(1, Math.min(5, seats)) };
}

/**
 * Top 5 candidates for an ask. `openTo` is a consent filter, not a ranking signal: a card that excludes the
 * ask's kind is never returned, whatever it offers. Ties go to whoever has accepted fewer asks lately.
 */
export function scout(ask, cards, recentAccepts = {}) {
  const words = keywords(ask.text);
  return cards
    .filter((c) => c.userId !== ask.askerId && c.openTo.includes(ask.kind))
    .map((c) => ({ userId: c.userId, score: overlap(words, c.offers.join(" ")) }))
    .sort((a, b) => b.score - a.score || (recentAccepts[a.userId] ?? 0) - (recentAccepts[b.userId] ?? 0) || a.userId.localeCompare(b.userId))
    .slice(0, 5)
    .map((c) => c.userId);
}

/** Verdicts in, ranked queue out: willing and fit of 7 or more, best fit first. The first `seats` get proposed. */
export function finalize(verdicts, seats = 1) {
  const ranked = verdicts
    .filter((v) => v.willing && v.fit >= 7)
    .sort((a, b) => b.fit - a.fit || String(a.convId).localeCompare(String(b.convId)));
  return { ranked, proposed: ranked.slice(0, seats), queued: ranked.slice(seats) };
}

/** What happens to a queue when the match at its head says no or times out: the next one moves up, or the ask opens. */
export function promote(queue) {
  const [next, ...rest] = queue;
  return next ? { next, queue: rest, open: false } : { next: null, queue: [], open: true };
}

/**
 * Ledger entries for one verifiable event. Declining is worth nothing either way, so nobody accepts insincerely.
 *   { type: "invite_briefed", inviter }
 *   { type: "revealed", helper }
 *   { type: "meeting", asker, helper, askerSays, helperSays, helpful }   // says: true | false | undefined
 *   { type: "declined", user }
 */
export function karmaFor(e) {
  switch (e.type) {
    case "invite_briefed": return [{ userId: e.inviter, delta: 10, reason: "invite finished their brief" }];
    case "revealed": return [{ userId: e.helper, delta: 5, reason: "accepted an ask" }];
    case "meeting": {
      if (e.askerSays === true && e.helperSays === true) {
        const out = [{ userId: e.helper, delta: 20, reason: "meeting happened" }, { userId: e.asker, delta: 10, reason: "meeting happened" }];
        if (e.helpful) out.push({ userId: e.helper, delta: 15, reason: "marked helpful" });
        return out;
      }
      // a no-show is the one who did not confirm while the other did
      if (e.askerSays === true && e.helperSays !== true) return [{ userId: e.helper, delta: -15, reason: "no-show" }];
      if (e.helperSays === true && e.askerSays !== true) return [{ userId: e.asker, delta: -15, reason: "no-show" }];
      return [];
    }
    default: return [];
  }
}
