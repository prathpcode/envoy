// Connect Google Calendar during onboarding. The relay runs the OAuth code flow in a popup, reads only free/busy
// (never event titles) for the next 7 days, and hands the app a short summary of when the student is free.
// Needs GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET, with <relay>/oauth/google/callback as an authorized redirect URI.
import { randomBytes } from "node:crypto";

const SCOPES = ["openid", "email", "https://www.googleapis.com/auth/calendar.freebusy"];
const results = new Map();          // state -> { email, free, busy, at }   (kept 15 minutes)
export const googleReady = () => !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);

// the relay as the browser reaches it (localhost while developing); set GOOGLE_REDIRECT_BASE for a deployed relay
const base = (req) => (process.env.GOOGLE_REDIRECT_BASE ?? `http://${req.headers.host}`).replace(/\/$/, "");
const redirectUri = (req) => `${base(req)}/oauth/google/callback`;

/** GET /oauth/google/start -> 302 to Google's consent screen. */
export function startUrl(req) {
  const state = randomBytes(12).toString("hex");
  results.set(state, null);
  const q = new URLSearchParams({ client_id: process.env.GOOGLE_CLIENT_ID, redirect_uri: redirectUri(req), response_type: "code", scope: SCOPES.join(" "), state, prompt: "consent", access_type: "online" });
  return `https://accounts.google.com/o/oauth2/v2/auth?${q}`;
}

const SLOTS = [["morning", 9, 12], ["afternoon", 12, 17], ["evening", 17, 21]];
/** Free 3-hour-ish blocks over the next week, from Google's busy intervals. Pure. */
export function freeBlocks(busy, from = new Date(), days = 7, tz = undefined) {
  const out = [];
  for (let d = 0; d < days; d++) {
    const day = new Date(from); day.setDate(day.getDate() + d); day.setHours(0, 0, 0, 0);
    for (const [label, h0, h1] of SLOTS) {
      const s = new Date(day), e = new Date(day); s.setHours(h0); e.setHours(h1);
      if (e <= from) continue;
      const clash = busy.some((b) => new Date(b.start) < e && new Date(b.end) > s);
      if (!clash) out.push({ start: s.toISOString(), end: e.toISOString(), label: `${day.toLocaleDateString("en-US", { weekday: "long", timeZone: tz })} ${label}` });
    }
  }
  return out;
}

/** GET /oauth/google/callback -> exchanges the code, reads free/busy, and returns a page that tells the opener. */
export async function callback(req, url) {
  const state = url.searchParams.get("state"), code = url.searchParams.get("code");
  const page = (msg) => `<!doctype html><meta charset="utf-8"><title>Grokmate</title><body style="font:600 18px system-ui;background:#141414;color:#fff;display:grid;place-items:center;height:100vh;margin:0">
<p>${msg}</p><script>try{window.opener&&window.opener.postMessage({type:"grokmate:gcal",state:${JSON.stringify(state)}},"*")}catch(e){}setTimeout(()=>window.close(),400)</script>`;
  if (!state || !results.has(state)) return page("That sign-in link expired. Close this and try again.");
  if (!code) { results.set(state, { error: url.searchParams.get("error") ?? "cancelled", at: Date.now() }); return page("No worries. You can close this."); }
  try {
    const tok = await (await fetch("https://oauth2.googleapis.com/token", { method: "POST", headers: { "content-type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ code, client_id: process.env.GOOGLE_CLIENT_ID, client_secret: process.env.GOOGLE_CLIENT_SECRET, redirect_uri: redirectUri(req), grant_type: "authorization_code" }) })).json();
    if (!tok.access_token) throw new Error(tok.error_description ?? tok.error ?? "No token");
    const email = tok.id_token ? JSON.parse(Buffer.from(tok.id_token.split(".")[1], "base64url").toString()).email : null;
    const now = new Date(), until = new Date(now.getTime() + 7 * 864e5);
    const fb = await (await fetch("https://www.googleapis.com/calendar/v3/freeBusy", { method: "POST", headers: { authorization: `Bearer ${tok.access_token}`, "content-type": "application/json" },
      body: JSON.stringify({ timeMin: now.toISOString(), timeMax: until.toISOString(), items: [{ id: "primary" }] }) })).json();
    const busy = fb.calendars?.primary?.busy ?? [];
    results.set(state, { email, busy, free: freeBlocks(busy, now), at: Date.now() });
    return page("Calendar connected. Heading back…");
  } catch (e) {
    console.warn("google: calendar connect failed:", e.message);
    results.set(state, { error: e.message, at: Date.now() });
    return page("Couldn't read your calendar. Close this and try again.");
  }
}

/** GET /onboard/gcal/:state -> what the popup found, once. */
export function take(state) {
  for (const [k, v] of results) if (v && Date.now() - v.at > 15 * 60e3) results.delete(k);
  const v = results.get(state);
  if (v) results.delete(state);
  return v ?? { pending: results.has(state) };
}
