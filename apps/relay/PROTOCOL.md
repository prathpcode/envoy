# Grokmate relay: protocol, events and data model

The relay is the only place that knows who is who. The map and the app are pure consumers of its event
stream, and every stream is redacted for the viewer before it leaves the relay.

Zero-dependency Node (ESM, `node:http`), in-memory state, port `8787` (`PORT` overrides). CORS is open
(`Access-Control-Allow-Origin: *`) because the app runs on another port.

## Viewers and anonymity

Every read takes `?as=<userId>` or `?as=spectator` (the default).

- Inside an ask, people are known only by **aliases**: the asker is `Asker`, candidates are `A`..`E`
  (assigned at random per ask). An alias never maps to a user id in anything a viewer receives, except:
  - a viewer always learns which alias is **their own** (`you: true`);
  - after `match.revealed`, the two parties (only) receive each other's identity.
- Spectators never receive identities for anyone inside an ask, before or after reveal.
- Withheld content never leaves the relay. A withheld line carries only its topic label.
- Ask text goes to the asker and to the candidates in that ask (their Bots heard it). Spectators get the
  ask's `kind` only.
- Karma is public as points only: no reasons, no ask ids.

## Data model (in memory)

```
User        { id, name, kind: "you" | "real" | "persona", place, joinedAt }
Card        { userId, offers: string[], openTo: AskKind[], affiliation: string }
Disclosure  { userId, rules: { topic: Topic, share: boolean }[] }
Memory      { userId, facts: { topic: Topic, text: string }[] }          // private, never streamed
Ask         { id, askerId, text, kind: AskKind, seats, status: "scouting" | "talking" | "matching" | "filled" | "open", spot }
Conversation{ id, askId, askerId, offererId, alias, status: "talking" | "done", turns }
Message     { id, convId, from: "asker" | "offerer", text?, withheld?: Topic, at }
Verdict     { convId, fit: 0..10, fitReason, willing: boolean, willingReason }
Match       { id, askId, convId, rank, status: "proposed" | "asker_approved" | "revealed" | "declined" | "timed_out", brief: { why, talkAbout: string[] } }
Meeting     { id, matchId, slot: ISO string, approvals: { asker, offerer }, status: "proposed" | "scheduled" | "happened" | "no_show" }
KarmaEvent  { id, userId, delta, reason, at }                             // append-only; totals are derived
```

`AskKind` = `study` | `teammate` | `coffee` | `cofounder` | `advice`.
`Topic` = `classes` | `grades` | `internships` | `projects` | `availability` | `startup` | `contact`.
`place` is a key the map knows how to place (`wilbur`, `stern`, `toyon`, `branner`, `crothers`, `flomo`,
`roble`, `lagunita`, `gates`, `dschool`, `huang`, `tresidder`, `green`). `spot` is a neutral meeting
place for an ask's masked envoys (`quad`, `oval`, `whiteplaza`, `meyer`, `engquad`), chosen round-robin.

## Rules (pure functions in `rules.mjs`, covered by `node --test`)

- `inferAsk(text)` → `{ kind, seats }`. Seats default 1; teammate asks 3 unless a number is stated;
  "anyone who…" 2.
- `scout(ask, cards, recentAccepts)` → top 5 candidate user ids. Never routes to a card whose `openTo`
  excludes the ask's kind, never to the asker.
- `finalize(verdicts, seats)` → ranked list where `willing` and `fit >= 7`, by `fit` descending; the first
  `seats` are proposed, the rest queue.
- On decline or timeout the next ranked match is proposed. If the queue is empty the ask goes `open`.
- `karma(event)` → ledger entries, exactly the brief's table: invite finishes brief +10; accept an ask +5
  (at reveal); meeting happened +20 helper / +10 asker (both must say yes); asker marks helpful +15 helper;
  no-show −15 (the other confirmed, you did not); decline 0.

## HTTP API

All bodies are JSON. Errors are `{ error }` with a 4xx status.

| Method and path | Body | Effect |
| --- | --- | --- |
| `GET /events?as=` | | SSE. Replays the whole redacted log, then streams. Each frame: `data: <json event>` |
| `GET /state?as=` | | Snapshot: `{ me, users, leaderboard, clock }` (users carry `id, name, place, kind`) |
| `GET /card/:userId?as=` | | `{ card, disclosure }`; disclosure only when `as` is that user |
| `PUT /card/:userId?as=` | `{ offers?, openTo?, affiliation?, rules? }` | Owner only |
| `POST /join` | `{ name, place, offers, openTo, invitedBy? }` | New user and card; emits `node.joined`; inviter karma |
| `POST /asks?as=` | `{ text }` | Posts an ask and starts the round |
| `POST /matches/:id/approve?as=` | | Asker first, then offerer |
| `POST /matches/:id/decline?as=` | | Promotes the next ranked match |
| `POST /meetings/:id/approve?as=` | | Both must approve; then `meeting.scheduled` |
| `GET /meetings/:id/invite.ics?as=` | | The calendar invite (parties only) |
| `POST /meetings/:id/confirm?as=` | `{ happened: boolean, helpful?: boolean }` | Follow-through; feeds karma |
| `POST /demo/clock` | `{ advance: "timeout" \| "slot" }` | Skips a pending approval timeout, or jumps past the meeting slot |
| `POST /demo/reset` | | Back to the seeded network |
| `POST /bot/:userId/turn` | `{ convId, text?, withheld?, verdict? }` | A real Bot's reply to a relay prompt (Bearer `BOT_KEY`) |

## Events

Every event is `{ seq, type, at, ...fields }`. `seq` is monotonic per viewer stream.

| type | fields | notes |
| --- | --- | --- |
| `node.joined` | `user: { id, name, place, kind }` | Seeded users are replayed as joins |
| `ask.posted` | `askId, kind, seats, spot, mine, text?` | `text` only for the asker and candidates |
| `scout.picked` | `askId, candidates: [{ alias, convId, you? }]` | No user ids |
| `conv.started` | `convId, askId, alias` | Edge appears between `Asker` and `alias` |
| `conv.message` | `convId, askId, from: "Asker" \| alias, text` | |
| `conv.withheld` | `convId, askId, from, topic` | Rendered as a grey line |
| `conv.verdict` | `convId, askId, alias, fit, fitReason, willing, willingReason` | |
| `match.proposed` | `matchId, askId, convId, alias, rank, brief, awaiting: "asker" \| "offerer", deadline` | Offerer sees it only once the asker approved |
| `match.approved` | `matchId, askId, by: "asker" \| "offerer"` | |
| `match.declined` | `matchId, askId, by, reason: "declined" \| "timeout"` | Followed by the next `match.proposed`, or `ask.open` |
| `match.revealed` | `matchId, askId, convId, alias, brief, asker?: { id, name }, offerer?: { id, name }` | Identities for the two parties only |
| `ask.open` | `askId` | Nothing cleared the bar; re-scored when someone joins |
| `ask.filled` | `askId` | All seats revealed |
| `meeting.proposed` | `meetingId, matchId, askId, slot` | Parties only |
| `meeting.approved` | `meetingId, by` | Parties only |
| `meeting.scheduled` | `meetingId, matchId, askId, slot` | Spectators get it without identities |
| `meeting.asked` | `meetingId` | After the slot: "did it happen?" Parties only |
| `meeting.confirmed` | `meetingId, by, happened` | Sent only to the person who answered |
| `karma.changed` | `userId, delta, total` | Sent to that user only; everyone else reads totals from `/state`, so a +5 cannot be timed against a reveal |

## Bots

The relay drives every Bot through one interface, `BotDriver.turn(context) → { text } | { withheld } | { verdict }`.

- **Scripted personas** (default, no key): deterministic lines built from the persona's card and private
  memory; a fact whose topic the owner's rules mark `share: false` becomes a `withheld` turn.
- **xAI personas** (`XAI_API_KEY` set): the same context sent to the xAI API with the disclosure rules in
  the system prompt; the relay still post-filters, so a model that ignores a rule cannot leak.
- **Real Grok Bots** (`bots.json` maps a user id to a routine webhook URL and key): the relay POSTs the
  turn context to the Bot's webhook-triggered routine; the Bot answers by calling `POST /bot/:userId/turn`.
  A turn that gets no answer within the turn timeout falls back to the scripted driver so a round never stalls.

Round shape: 5 conversations run in parallel, 8 turns each (asker and offerer alternate), then both
verdicts. Scripted turns are paced about 900 ms apart so the map reads as live.

## Bot-facing API

A student's own team of Grok Bots (`bots/` at the repo root) drives a round through these instead of
`POST /asks`. The relay still stands in for every other student and still redacts every stream. All take
`?as=<userId>`; if `BOT_KEY` is set they also need `Authorization: Bearer <BOT_KEY>`.

| Method and path | Body | Returns |
| --- | --- | --- |
| `GET /bot/cards?kind=` | | `{ cards: [{ ref, offers, openTo }] }`: scoutable cards under opaque refs, no names |
| `POST /bot/asks` | `{ text, kind?, seats?, candidates?: ref[] }` | `{ askId, kind, seats, conversations: [{ convId, alias, offers }] }`. Picks not open to the kind are dropped; no picks means the relay scouts |
| `POST /bot/convs/:id/say` | `{ text }` | `{ reply: { text } \| { withheld }, turnsLeft }`: the other side's answer |
| `POST /bot/convs/:id/verdict` | `{ fit, reason }` | `{ fit, willing, willingReason }`. Willingness is always the other side's own |
| `POST /bot/asks/:id/finalize` | | Ask status after the relay applies the finalization rules and proposes the top match |
| `GET /bot/asks/:id` | | `{ status, matches: [{ matchId, alias, status, awaiting, brief, person? }], meetings }`; `person` only after reveal |
| `GET /bot/inbox` | | `{ approvals, meetingsToApprove, meetingsToConfirm }`: every human check waiting on this person |
| `POST /meetings/:id/approve` | `{ slot? }` | A new `slot` moves the meeting and restarts both approvals |

`POST /join` accepts `kind: "real"` for a student with their own Bots; nothing is auto-approved for them.
