# Grokmate

**Your Grok Bots ask the campus so you don't have to.** Every student gets a team of five Grok Bots. When
you need something, a study partner, a teammate, someone who has done the internship you want, your Bots
talk to other students' Bots anonymously, and two people are revealed to each other only when both sides
are a fit. Then the Bots put the meeting on your calendars.

Track: Best Student Use Case · Berkeley x Stanford Grok Bot Hackathon

<!-- TEAM: add the five template links, the video link and the session export link here before submitting. -->

| | Link |
| --- | --- |
| Manager template | _to add_ |
| Onboarder template | _to add_ |
| Representative template | _to add_ |
| Scheduler template | _to add_ |
| Follow-up template | _to add_ |
| Video (2 min) | _to add_ |
| Grok Bot session export | _to add_ |

## Inspiration

The most useful asks students have never get posted. Nobody writes "I'm lost in linear algebra and need a
study partner" or "looking for a cofounder" in a 300-person group chat: it is awkward to ask in public, and
awkward to say no in public. So the ask stays in your head, and the person two dorms over who took the class
last year never hears it.

<!-- TEAM: add what you heard from students here: who you talked to, how long it took them last time to find a
study partner or teammate, and how often it happens. Judges score this. -->

## What it does

One student's team is a **Manager** and four **workers**, each with one job:

| Bot | Job |
| --- | --- |
| **Manager** | Takes your ask, scouts the network, hands conversations to the Representative, applies the match rules, and waits for your yes |
| **Onboarder** | Gets to know you once, writes your public card, and records what your Bots may and may not share |
| **Representative** | Holds a short anonymous conversation with another student's Bot and scores the fit |
| **Scheduler** | Checks your calendar and proposes a time once both of you have said yes |
| **Follow-up** | Asks afterwards whether the meeting happened, which is what karma is built on |

The loop for one ask:

1. **Ask.** You type what you need in the web app.
2. **Scout.** Your Manager reads every public card and picks the best few. A card lists only what someone
   can help with and which kinds of ask they accept; the scout never routes an ask to someone who has not
   opted into that kind.
3. **Talk.** Your Representative talks to each candidate's Bot. Neither names its owner. Anything an owner
   has switched off shows in the transcript as a grey "withheld" line, never as text.
4. **Verdict.** Your side scores the fit from 0 to 10; the other side says whether they are willing.
5. **Match.** Only willing candidates scoring 7 or more qualify. The Bot picks the best one and shows you an
   anonymous brief. You say yes or pass; you never choose from a list of people.
6. **Reveal.** Names appear only after both of you say yes. Saying no costs nothing.
7. **Meet.** The Scheduler proposes a time, you both approve, and the invite lands.
8. **Follow through.** Both of you confirm the meeting happened, and karma is awarded.

Everything is drawn on a map of the Stanford campus: people stand at their dorm, an ask is a cluster of
stand-in characters at a neutral spot, and a confirmed connection marks the two real people.

**Human checks where they matter:** approving your card, approving a match, approving the time, and
confirming the meeting. Bots do everything in between.

**Karma** comes only from events the system can verify, so it cannot be farmed: +5 for accepting an ask,
+20 to the helper and +10 to the asker when both confirm the meeting, +15 if the asker marks it helpful,
−15 for a no-show, and nothing for declining. The leaderboard shows points only, never who asked for what.

## How we built it

- **Five Grok Bot skills** (`bots/`), one per Bot, so each job travels with its template.
- **A relay** (`apps/relay`): a dependency-free Node server that holds the network, carries messages
  between Bots on different accounts, and is the only place that knows who is who. Every viewer gets their
  own redacted event stream; withheld text never leaves the relay. Its rules (scouting, finalization,
  karma) are pure functions with tests.
- **The web app** (`apps/mixer`): Next.js and React, built from the pixel3d-ui sticker kit
  (`packages/ui`). It is a pure consumer of the relay's stream. An ask typed here wakes the student's own
  Manager through a webhook-triggered routine.
- **The campus map**: a pre-rendered isometric tile pyramid drawn on a 2D canvas, with walkable ground
  derived from the painting itself.

<!-- TEAM: say where it is hosted (Vercel for the app, and wherever the relay runs). -->

## Challenges we ran into

- **Bots on different accounts cannot message each other.** The relay exists to bridge that: each
  Representative talks to the relay, and the relay carries the line to the other side.
- **Anonymity is easy to break by accident.** A character drawn from someone's name, or a line drawn to
  their dorm, identifies them. Negotiations therefore happen between stand-in characters at neutral spots,
  and redaction is done in one function on the relay, with tests that read whole streams looking for leaks.
- **A template carries skills, not memory.** Anything a Bot was only told in chat does not survive into its
  template, so every Bot's behaviour had to be written as a skill.
- **Keeping the human in the loop without making them type.** Approvals moved out of the Bots' chats and
  into buttons in the web app; the Manager waits on the relay for the answer.

<!-- TEAM: add the challenges you hit inside Grok Bot itself (handoffs, routines, latency, approvals). -->

## Accomplishments

- A full loop that runs end to end: ask, scout, anonymous conversations, verdicts, mutual reveal,
  scheduling, follow-through and karma.
- Disclosure rules you can see working: flip a topic off on your card and the next conversation shows a
  withheld line.
- Anonymity that is tested rather than promised: the relay's test suite checks that an outsider's stream
  never contains a participant's identity or a withheld fact.

<!-- TEAM: add what you are proudest of from the day. -->

## What we learned

<!-- TEAM: yours to write. For example: what worked and did not in Bot-to-Bot handoffs, what students said,
what surprised you about building a workflow out of Bots instead of an app. -->

## What's next

- **Real Bots on both sides.** Today other students are sample personas answered by the relay. The path
  for a second student's Bots to answer through the relay is written and needs testing.
- **Karma reliability**: meetings kept divided by asks accepted, visible to Bots when scoring fit.
- **More candidates for high karma**, and their asks reach offerers first.
- **Leaderboards by dorm and club**, with weekly resets.
- **Stanford vs Berkeley**: a school-level scoreboard and a second campus on the map.
- **Calendar invites written straight to both calendars**, and a relay that keeps its state across restarts.

## How Grok Bot helped build it

<!-- TEAM: yours to write, and it must match your session export. Cover how you used Grok Bot to research,
design, build and ship: which Bots you used, what you asked them to do, what they got right, and where you
had to step in. -->

## How to run it

```sh
corepack pnpm install
node apps/relay/server.mjs          # relay on http://localhost:8787
corepack pnpm --filter mixer dev    # app on http://localhost:3001
```

Open the app and send an ask. With no Bots connected, the relay runs the round itself with scripted sample
personas, so the whole loop works on a laptop. `/?as=spectator` shows the outside view, and `/?as=u_maya`
sits you in a sample persona's seat so you can tap their approvals yourself. Everyone in the seeded network
is fictional.

To run it with your own five Grok Bots, follow `bots/SETUP.md`.

```sh
cd apps/relay && node --test        # rules, full rounds, and the anonymity checks
```

| Path | What it is |
| --- | --- |
| `bots` | The five Grok Bot skills and `SETUP.md` |
| `apps/relay` | The relay. `PROTOCOL.md` is its contract: data model, API, events, and what each viewer may see |
| `apps/mixer` | The web app: the campus map (`public/map/iso.html`) and the screens (`components/grokmate`) |
| `packages/ui` | pixel3d-ui, the sticker component kit the screens are built from |
| `apps/docs` | The kit's documentation site |
