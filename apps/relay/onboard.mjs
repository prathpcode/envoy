// Onboarding interview: a new student talks to their own bot, and the bot turns that into a card, private facts,
// and sharing rules. Uses the xAI API when XAI_API_KEY and XAI_MODEL are set; otherwise a fixed five-question
// interview that files each answer under its topic. Either way the student reviews everything before joining.

export const TOPICS = ["classes", "grades", "internships", "projects", "availability", "startup", "contact"];
export const KINDS = ["study", "teammate", "coffee", "cofounder", "advice"];

const SCRIPT = [
  { say: (n) => `Hey ${n}! I'm your new bot. I'll speak for you when other students' bots come looking. What are you studying or working on right now?`, topic: "projects" },
  { say: () => "Nice. What could you help another student with? A class you're great at, a skill, anything.", offers: true },
  { say: () => "And what are you hoping to find this quarter? Study partners, hackathon teammates, a cofounder, advice, or just coffee chats?", openTo: true },
  { say: () => "When are you usually free to meet?", topic: "availability" },
  { say: () => "Last one. Is there anything I should never share with other bots? Like grades, internships, or a startup idea.", hide: true },
];
const DONE = "Got it. Here's the card I'll show other bots, and what I'll keep to myself. Change anything you like.";

const KIND_WORDS = { study: /stud|exam|class|homework|pset|problem set|tutor/i, teammate: /team|hackathon|build|project/i,
  coffee: /coffee|chat|meet|friend|people/i, cofounder: /co-?founder|startup|company/i, advice: /advice|mentor|intern|career|recruit/i };
const HIDE_WORDS = { grades: /grade|gpa|score/i, internships: /intern|job|offer|recruit/i, startup: /startup|idea|company/i,
  classes: /class|course/i, projects: /project/i, availability: /schedule|free|availability/i };

const userTurns = (history) => history.filter((h) => h.who === "you").map((h) => String(h.text ?? "").trim());
const clean = (t) => t.replace(/\s+/g, " ").trim().replace(/^./, (c) => c.toUpperCase());
const sentence = (t) => (/[.!?]$/.test(t) ? t : `${t}.`);

/** Build the profile from the scripted interview's answers. Pure, so it is easy to test. */
export function profileFromAnswers(answers) {
  const facts = [], offers = [], openTo = new Set(), hide = new Set(["contact"]);
  SCRIPT.forEach((q, i) => {
    const a = answers[i]; if (!a) return;
    if (q.topic) facts.push({ topic: q.topic, text: sentence(clean(a)) });
    if (q.offers) offers.push(...a.split(/,|;|\band\b|\bor\b/i).map(clean).filter((x) => x.length > 2).slice(0, 4));
    if (q.openTo) for (const [k, re] of Object.entries(KIND_WORDS)) if (re.test(a)) openTo.add(k);
    if (q.hide && !/^(no|nope|nothing|none)\b/i.test(a)) for (const [k, re] of Object.entries(HIDE_WORDS)) if (re.test(a)) hide.add(k);
  });
  if (!openTo.size) openTo.add("coffee");
  return { facts, offers: offers.length ? offers : ["Happy to chat about what I'm working on"], openTo: [...openTo], hide: [...hide] };
}

function scripted(name, history) {
  const answers = userTurns(history), last = answers[answers.length - 1];
  const learned = last ? clean(last.split(/[.,;!?]/)[0]).split(" ").slice(0, 5).join(" ") : null;
  if (answers.length < SCRIPT.length) return { say: SCRIPT[answers.length].say(name.split(" ")[0]), learned, done: false };
  return { say: DONE, learned, done: true, profile: profileFromAnswers(answers) };
}

/** Keep only well-formed fields from a model's profile, so a bad reply can't put junk on a card. */
export function sanitize(p) {
  const strs = (a, n) => (Array.isArray(a) ? a.map((x) => String(x).trim()).filter(Boolean).slice(0, n) : []);
  const facts = (Array.isArray(p?.facts) ? p.facts : []).filter((f) => TOPICS.includes(f?.topic) && f?.text).map((f) => ({ topic: f.topic, text: String(f.text).trim() })).slice(0, 12);
  const openTo = strs(p?.openTo, 5).filter((k) => KINDS.includes(k));
  const hide = [...new Set(["contact", ...strs(p?.hide, 7).filter((k) => TOPICS.includes(k))])];
  return { facts, offers: strs(p?.offers, 5), openTo: openTo.length ? openTo : ["coffee"], hide };
}

async function viaXai(name, history, linkedin, headline) {
  const system = [
    `You are ${name}'s brand-new personal bot on Grokmate, a campus network where students' bots talk to each other anonymously to find study partners, teammates, cofounders, advice and coffee chats.`,
    `Interview ${name} out loud to set yourself up. Ask ONE short, warm question at a time (this is spoken, so 1-2 sentences, no lists, no emoji).`,
    `Cover: what they study or are working on, what they can help others with, what they're looking for this quarter, when they're free, and what you must never share.`,
    headline ? `Their LinkedIn headline is "${headline}". Open with a question that shows you know it.` : "",
    `After about 5 answers (or sooner if they say they're done), finish.`,
    `Be playful and a little funny, like an excited new sidekick, but keep it short.`,
    `Always reply with JSON only: {"say": string, "learned": null | "a 2-5 word sticker of what their last answer taught you, e.g. 'Builds geography games'", "done": boolean, "profile": null | {"facts":[{"topic":one of ${JSON.stringify(TOPICS)},"text":string}], "offers":[short strings], "openTo":[subset of ${JSON.stringify(KINDS)}], "hide":[topics never to share]}}.`,
    `profile is null until done. Facts are written in third person about "they" and never include their name. Always include "contact" in hide.`,
  ].join(" ");
  const messages = [{ role: "system", content: system }, ...history.map((h) => ({ role: h.who === "you" ? "user" : "assistant", content: h.who === "you" ? String(h.text) : JSON.stringify({ say: h.text, done: false, profile: null }) }))];
  if (!history.length) messages.push({ role: "user", content: "(I just opened the app. Say hi and ask your first question.)" });
  const r = await fetch(`${process.env.XAI_BASE_URL ?? "https://api.x.ai/v1"}/chat/completions`, {
    method: "POST", headers: { "content-type": "application/json", authorization: `Bearer ${process.env.XAI_API_KEY}` },
    body: JSON.stringify({ model: process.env.XAI_MODEL, messages, response_format: { type: "json_object" } }),
    signal: AbortSignal.timeout(20000),
  });
  const data = await r.json();
  if (!r.ok) throw new Error(data?.error?.message ?? data?.error ?? `xAI said ${r.status}`);
  const out = JSON.parse(String(data.choices?.[0]?.message?.content ?? "").replace(/^```(json)?|```$/g, "").trim());
  if (!out?.say) throw new Error("No reply");
  const learned = typeof out.learned === "string" && out.learned.trim() ? out.learned.trim().slice(0, 40) : null;
  return out.done ? { say: String(out.say), learned, done: true, profile: sanitize(out.profile) } : { say: String(out.say), learned, done: false };
}

/** One interview turn. history: [{ who: "bot" | "you", text }]. Returns { say, done, profile?, engine }. */
export async function interview({ name, history = [], linkedin, headline }) {
  name = String(name ?? "").trim() || "there";
  history = (Array.isArray(history) ? history : []).slice(-30).map((h) => ({ who: h.who === "you" ? "you" : "bot", text: String(h.text ?? "").slice(0, 1000) }));
  if (process.env.XAI_API_KEY && process.env.XAI_MODEL) {
    try { return { ...(await viaXai(name, history, linkedin, headline)), engine: "xai" }; }
    catch (e) { console.warn("onboard: xAI failed, using the scripted interview:", e.message); }
  }
  return { ...scripted(name, history), engine: "scripted" };
}

/** Look a LinkedIn profile up with Grok's web search: { name, headline } or nulls. LinkedIn itself blocks direct fetches. */
export async function whoIs(url) {
  const slug = String(url ?? "").match(/linkedin\.com\/in\/([^/?#]+)/i)?.[1] ?? String(url ?? "").trim();
  if (!slug || !process.env.XAI_API_KEY || !process.env.XAI_MODEL) return { name: null, headline: null };
  try {
    const r = await fetch(`${process.env.XAI_BASE_URL ?? "https://api.x.ai/v1"}/responses`, {
      method: "POST", headers: { "content-type": "application/json", authorization: `Bearer ${process.env.XAI_API_KEY}` },
      body: JSON.stringify({ model: process.env.XAI_MODEL, tools: [{ type: "web_search" }],
        input: `Find the LinkedIn profile linkedin.com/in/${slug}. Reply with JSON only: {"name": full name or null, "headline": their short LinkedIn headline (school or role, under 60 characters) or null}. If you can't find that exact profile, use nulls rather than guessing.` }),
      signal: AbortSignal.timeout(15000),
    });
    const d = await r.json();
    const text = (d.output ?? []).filter((o) => o.type === "message").flatMap((o) => o.content ?? []).map((c) => c.text ?? "").join("");
    const j = JSON.parse(text.slice(text.indexOf("{"), text.lastIndexOf("}") + 1));
    const s = (v, n) => (typeof v === "string" && v.trim() ? v.replace(/\*/g, "").trim().slice(0, n) : null);
    return { name: s(j.name, 60), headline: s(j.headline, 80) };
  } catch (e) { console.warn("onboard: profile lookup failed:", e.message); return { name: null, headline: null }; }
}

// ---- selfie -> pixel avatar ----
// Style options in the same order as STYLES in apps/mixer/public/map/chars.js, so an answer is an index there.
const STYLE_OPTIONS = ["short and neat (side part, combed, crew cut)", "short and messy / spiky / textured on top", "long, past the shoulders, worn down",
  "bun or top knot", "buzz cut, shaved or bald", "curly, coily or afro", "ponytail or tied back", "wearing a cap or hat"];
const BEARDS = ["none", "stubble", "mustache", "goatee", "beard"];
const HEX = /^#[0-9a-f]{6}$/i;
// the Monk skin tone scale, lightest to deepest: models judge a numbered scale far better than a raw colour.
// Steps are tuned to read well as pixel skin (the lightest steps are warmed slightly so they don't look grey).
const SKIN_SCALE = ["#f6e4d6", "#f1d9c4", "#ecd0b2", "#e2bf98", "#cfa47a", "#a97a52", "#8a5c3c", "#6b432b", "#4a2f20", "#33221a"];

/**
 * The avatar pipeline: a selfie from the student's own camera -> Grok looks at the face and describes it -> that
 * description becomes the pixel character. `photo` is an image data URL. Returns { look, seen } where look is
 * { skinHex, hairHex, topHex, style, beard, glasses } (see lookTraits in chars.js) and seen is Grok's own one-line
 * description, or { look: null } when there is no model to read it. The photo is not stored anywhere.
 */
export async function lookFromSelfie(photo) {
  if (typeof photo !== "string" || !/^data:image\/(jpeg|png|webp);base64,/.test(photo) || photo.length > 1_500_000) throw new Error("Send a photo as a JPEG, PNG or WebP data URL under 1 MB");
  if (!process.env.XAI_API_KEY || !process.env.XAI_MODEL) return { look: null };
  const prompt = [
    "This is a selfie of a student. We are drawing them as a tiny pixel-art character that their friends should recognise at a glance.",
    "First look closely at the person nearest the camera and describe them: skin tone, hair colour, hair length and texture, facial hair, glasses, and the colour of what they are wearing on top.",
    "Skin: pick the closest step 1-10 on the Monk skin tone scale (1 = very light, 3 = light, 5 = light-medium tan, 6 = medium brown, 7 = brown, 8 = dark brown, 10 = deepest). Studio lighting and flash wash skin out, so judge the tone under the highlights.",
    "Then turn hair and clothing into colours. Correct for the room's lighting and camera white balance: give the colour their skin and hair really are in neutral daylight, not the tint of the photo.",
    "Use a mid-tone of each (not a highlight or a shadow). Dark hair is rarely pure black; give its real colour.",
    "Reply with JSON only:",
    `{"seen": "one friendly sentence describing how they look, under 25 words, no guesses about ethnicity, age or gender",`,
    ` "skinTone": 1-10, "hairHex": "#rrggbb", "topHex": "#rrggbb",`,
    ` "style": index into ${JSON.stringify(STYLE_OPTIONS)},`,
    ` "beard": one of ${JSON.stringify(BEARDS)}, "glasses": true or false}`,
    "If there is no clear face in the photo, reply {\"noFace\": true}.",
  ].join("\n");
  try {
    const r = await fetch(`${process.env.XAI_BASE_URL ?? "https://api.x.ai/v1"}/chat/completions`, {
      method: "POST", headers: { "content-type": "application/json", authorization: `Bearer ${process.env.XAI_API_KEY}` },
      body: JSON.stringify({ model: process.env.XAI_MODEL, response_format: { type: "json_object" }, messages: [{ role: "user", content: [
        { type: "image_url", image_url: { url: photo, detail: "high" } }, { type: "text", text: prompt },
      ] }] }),
      signal: AbortSignal.timeout(30000),
    });
    const d = await r.json();
    if (!r.ok) throw new Error(d?.error?.message ?? d?.error ?? `xAI said ${r.status}`);
    const j = JSON.parse(String(d.choices?.[0]?.message?.content ?? "").replace(/^```(json)?|```$/g, "").trim());
    if (j.noFace) return { look: null, noFace: true };
    const look = {};
    if (Number.isInteger(j.skinTone) && j.skinTone >= 1 && j.skinTone <= 10) look.skinHex = SKIN_SCALE[j.skinTone - 1];
    for (const k of ["hairHex", "topHex"]) if (typeof j[k] === "string" && HEX.test(j[k])) look[k] = j[k].toLowerCase();
    if (Number.isInteger(j.style) && j.style >= 0 && j.style < STYLE_OPTIONS.length) look.style = j.style;
    if (BEARDS.includes(j.beard)) look.beard = j.beard;
    if (typeof j.glasses === "boolean") look.glasses = j.glasses;
    return { look, seen: typeof j.seen === "string" ? j.seen.slice(0, 200) : null };
  } catch (e) { console.warn("onboard: avatar from photo failed:", e.message); return { look: null }; }
}

/**
 * Suggest a card from the student's own links (X, GitHub, a site) plus their LinkedIn headline, using Grok's web search.
 * Returns { offers, openTo, facts } for the student to confirm; nothing is saved until they join.
 */
export async function suggestProfile({ name, headline, links = [] }) {
  name = String(name ?? "").trim(); links = (Array.isArray(links) ? links : []).map((l) => String(l).trim()).filter(Boolean).slice(0, 5);
  const fallback = { offers: [], openTo: ["coffee"], facts: headline ? [{ topic: "projects", text: String(headline) }] : [] };
  if (!process.env.XAI_API_KEY || !process.env.XAI_MODEL || (!links.length && !headline)) return fallback;
  try {
    const r = await fetch(`${process.env.XAI_BASE_URL ?? "https://api.x.ai/v1"}/responses`, {
      method: "POST", headers: { "content-type": "application/json", authorization: `Bearer ${process.env.XAI_API_KEY}` },
      body: JSON.stringify({ model: process.env.XAI_MODEL, tools: [{ type: "web_search" }, { type: "x_search" }],
        input: [`A student named ${name || "(unknown)"} is joining a campus network where their bot finds them study partners, teammates, cofounders, advice and coffee chats.`,
          headline ? `Their LinkedIn headline: "${headline}".` : "", links.length ? `Their own links (read these, they are about this exact person): ${links.join(", ")}.` : "",
          `Only use information that is clearly about this person. Reply with JSON only:`,
          `{"offers": [3-5 short things they could help another student with, 2-5 words each], "openTo": [subset of ${JSON.stringify(KINDS)} that fits], "facts": [{"topic": one of ${JSON.stringify(TOPICS.filter((t) => t !== "contact"))}, "text": one short sentence in third person, no name}] (at most 6)}`].filter(Boolean).join(" ") }),
      signal: AbortSignal.timeout(30000),
    });
    const d = await r.json();
    if (!r.ok) throw new Error(d?.error?.message ?? d?.error ?? `xAI said ${r.status}`);
    const text = (d.output ?? []).filter((o) => o.type === "message").flatMap((o) => o.content ?? []).map((c) => c.text ?? "").join("");
    const p = sanitize(JSON.parse(text.slice(text.indexOf("{"), text.lastIndexOf("}") + 1)));
    return { offers: p.offers, openTo: p.openTo, facts: p.facts };
  } catch (e) { console.warn("onboard: profile suggestion failed:", e.message); return fallback; }
}
