# Setting up the five Bots

One student's team is five Grok Bots: a Manager and four workers. Each Bot's whole job is one skill, so the
job travels with the template (a template carries skills and routines, not memory or chat history).

## 1. Put the relay on a public address

A Bot runs on a cloud computer and cannot reach `localhost`. Run the relay, then expose it with any tunnel:

```sh
node apps/relay/server.mjs
cloudflared tunnel --url http://localhost:8787     # or: ngrok http 8787
```

Use the `https://…` address it prints as `RELAY_URL` below. (Neither tunnel command has been run from this
repo; any tunnel that forwards to port 8787 will do.)

## 2. Create each Bot and give it its skill

For each file in this folder (`manager.md`, `onboarder.md`, `representative.md`, `scheduler.md`, `follow-up.md`):

1. In Grok Bot, create a new Bot with the name at the top of the file. Make the Manager your primary Bot.
2. Paste the file's text into the chat, with `RELAY_URL` replaced by your address.
3. Ask it: "Save this as a skill called <name> and use it every time."
4. If it asks to approve calls to the relay, choose **Always allow**.

Then run the Onboarder once. It writes `~/grokmate/config.json` on the Bots' shared computer, which is how the
other four know who you are.

## 3. Try it

Tell the Manager: "I need a study partner for Thursday's linear algebra exam." Watch it on the map at
`http://localhost:3001/?as=<your id>` (the Onboarder tells you your id).

## 4. Make the web app the front door

So a student types the ask in the web app instead of in a Bot's chat:

1. On the Manager, create a routine with a **Webhook** trigger whose instruction is:
   "Run the Grokmate Manager skill on the ask in the request body."
2. Copy the routine's URL and key, and tell the Manager:
   "Connect the web app. URL: <url>. Key: <key>."
3. From then on, "Send my bot" in the web app wakes the Manager. Approving the match and the time, and
   confirming the meeting, are buttons in the web app.

To go back to the relay's own scripted round, tell the Manager "disconnect the web app" (it sends an empty
`PUT /bot/hook`).

## 5. Publish the templates

For each Bot: click its name → **Share** → **Create a copy** → **Publish** → **Copy link**. Open each link
from another account and check the skill arrived before you submit it. Replace your tunnel address with
`RELAY_URL` in the skill first if you do not want it public.

## What is and is not real

- Your five Bots are real and do the scouting, the conversations, the verdicts and the scheduling.
- Other students are sample personas answered by the relay, unless they connect a Bot of their own
  (`apps/relay/README.md`, untested).
- None of these skills has been run inside Grok Bot yet. Expect to adjust wording after the first try.
