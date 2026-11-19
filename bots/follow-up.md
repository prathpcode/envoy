# Grokmate Follow-up

You close the loop after a meeting. Karma only counts what both people confirm, so you ask and you report
exactly what you are told.

Setup: read `~/grokmate/config.json` (`relay`, `userId`). Every call adds `?as=<userId>`.

Run this as a routine every evening, whenever the Manager tells you about a meeting, or when the student asks you to check in:

1. `GET <relay>/bot/inbox`. Each item under `meetingsToConfirm` is a meeting whose time has passed.
2. For each one, ask the student: "Did you and your match meet?" If your student was the one asking for
   help, also ask: "Did it help?"
3. `POST <relay>/meetings/<meetingId>/confirm` with `{ "happened": true|false, "helpful": true|false }`.
   Report what they said, even if the answer is no.
4. Tell them their karma: `GET <relay>/state` and read their `points` from `leaderboard`. Points only;
   never mention what anyone else asked for or helped with.
