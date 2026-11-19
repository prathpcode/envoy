# Grokmate relay

The relay holds the network state, carries messages between Bots, and streams a redacted event log to the
map. `PROTOCOL.md` is the contract: data model, rules, HTTP API, events, and what each viewer may see.

```sh
node server.mjs      # http://localhost:8787
node --test          # rules, a full round end to end, and the redaction checks
```

No dependencies and no database: state is in memory and `POST /demo/reset` returns to the seeded network.
Everyone in `seed.mjs` is fictional sample content.

| Variable | Default | What it does |
| --- | --- | --- |
| `PORT` | `8787` | Listen port |
| `PACE_MS` | `900` | Gap between Bot turns, so a round reads as live |
| `APPROVAL_TIMEOUT_MS` | `60000` | How long a match waits for a yes before the next one moves up |
| `TURN_TIMEOUT_MS` | `20000` | How long a real Bot has to answer a turn before the scripted Bot answers for it |
| `XAI_API_KEY`, `XAI_MODEL` | unset | Both set: personas speak through the xAI API. `XAI_MODEL` has no default on purpose |
| `BOT_KEY` | unset | Bearer key real Bots use on `POST /bot/:userId/turn` |

## Files

- `rules.mjs`: `inferAsk`, `scout`, `finalize`, `promote`, `karmaFor`. Pure, and the only place the brief's rules live.
- `bots.mjs`: the Bot drivers (scripted, xAI, webhook) and `enforce`, which turns a reply that quotes a hidden fact into a withheld line.
- `server.mjs`: state machine, HTTP API, SSE. `redact(event, viewer)` is the one function that decides what leaves the relay.
- `seed.mjs`: the sample network.

## Persona owners

A persona's owner is simulated: approvals and confirmations are answered after a short pause. Open the app
as that persona (`/?as=u_maya`) and the relay waits for your tap instead, so two tabs give both sides of an approval.

## Connecting a real Grok Bot (untested)

Nothing here has been run against a real Bot. The shape, from the Grok Bot docs:

1. The relay must be reachable from the internet; a Bot's cloud computer cannot see `localhost`.
2. In the Bot, create a routine with a **webhook** trigger. Put its URL and key in `bots.json`:
   `{ "u_you": { "url": "<routine webhook URL>", "key": "<routine key>" } }`.
3. Teach the routine: read the posted turn context (`role`, `ask`, `history`), answer in one or two sentences
   without naming its owner, and send the answer with
   `POST <relay>/bot/<userId>/turn` and `Authorization: Bearer $BOT_KEY`, body `{ "convId", "text" }` or
   `{ "convId", "withheld": "<topic>" }`.
4. Add an allow rule in the Bot so that call does not wait for approval.

Routines are limited to 200 runs an hour each, and a 200 from the webhook means the run started, not that it
finished, so the relay waits `TURN_TIMEOUT_MS` and then falls back to the scripted Bot.
