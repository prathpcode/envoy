# Grokmate

Your bot asks the campus so you don't have to. Every student has a personal Bot that knows them. When you
have an ask, your Bot talks to other students' Bots anonymously, and people are revealed to each other only
when both sides are a fit. Then the Bots schedule the meeting.

## Run it

```sh
corepack pnpm install
node apps/relay/server.mjs          # relay on http://localhost:8787
corepack pnpm --filter mixer dev    # app on http://localhost:3001
```

Open the app, send an ask, and watch the round on the map. `/?as=spectator` shows the outside view and
`/?as=u_maya` sits you in a sample persona's seat. Everyone in the seeded network is fictional.

## Layout

| Path | What it is |
| --- | --- |
| `apps/relay` | The relay: network state, Bot drivers, rules, and the redacted event stream. `PROTOCOL.md` is the contract |
| `apps/mixer` | The app: the campus map (`public/map/iso.html`) and the Grokmate screens (`components/grokmate`) |
| `packages/ui` | pixel3d-ui, the sticker component kit the screens are built from |
| `apps/docs` | The kit's documentation site |

```sh
cd apps/relay && node --test        # rules, a full round, and the anonymity checks
```
