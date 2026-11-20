"use client";
import * as React from "react";
import { ArrowRight, Calendar, Camera, Close, Github, Globe, Linkedin, X } from "pixelarticons/react";
import { Badge, Button, DitherImage, Input, ToggleGroup, ToggleGroupItem, toast } from "@pixel3d/ui";
import { fireStickerBurst } from "@pixel3d/ui/three";
import { CharAvatar, type Look } from "@/components/char-avatar";
import { PALETTES, BEARDS, lookOf } from "@/public/map/chars.js";
import { api, RELAY } from "@/lib/grokmate/use-grokmate";
import { KIND_LABEL, TOPIC_LABEL } from "@/lib/grokmate/store";

// Joining Grokmate is one full-screen stage: your name and a selfie, meet your pixel self, plug in your calendar and
// socials (LinkedIn among them), then confirm the card your bot will show. Nothing is saved until you drop onto campus.

type Fact = { topic: string; text: string };
type Profile = { facts: Fact[]; offers: string[]; openTo: string[]; hide: string[] };
type Mode = "idle" | "thinking" | "speaking" | "listening";

const slugOf = (url: string) => url.trim().match(/linkedin\.com\/in\/([^/?#]+)/i)?.[1] ?? (/^[\w-]+$/.test(url.trim()) ? url.trim() : "");
const tilt = (deg: number) => ({ ["--p3d-tilt" as string]: `${deg}deg` }) as React.CSSProperties;

const BEARD_LABEL: Record<string, string> = { none: "Clean", stubble: "Stubble", mustache: "Mustache", goatee: "Goatee", beard: "Beard" };
const READING = ["Looking at you", "Getting your hair right", "Matching your skin tone", "Picking out your fit"];

/** Shrink a camera frame or photo to a small JPEG: enough for Grok to see a face, light enough to send. */
function shrink(src: CanvasImageSource, w: number, h: number, mirror: boolean) {
  const k = Math.min(1, 640 / Math.max(w, h)), c = document.createElement("canvas");
  c.width = Math.round(w * k); c.height = Math.round(h * k);
  const g = c.getContext("2d")!;
  if (mirror) { g.translate(c.width, 0); g.scale(-1, 1); }
  g.drawImage(src, 0, 0, c.width, c.height);
  return c.toDataURL("image/jpeg", 0.88);
}

// ---- the orb: a fluid blob drawn on a 64px canvas and scaled up with crisp pixels, white kiss-cut around it ----
const RAMPS: Record<Mode, string[]> = {
  idle: ["#e6f6ff", "#9fdcff", "#36b8ff", "#1f93d6"],
  speaking: ["#e6f6ff", "#9fdcff", "#36b8ff", "#1f93d6"],
  listening: ["#f1ffd0", "#d6f98a", "#b6f23a", "#8fc923"],
  thinking: ["#ffffff", "#e6e7ec", "#cfd0d6", "#8a8f9a"],
};
function Orb({ mode, meter, className = "" }: { mode: Mode; meter: React.RefObject<() => number>; className?: string }) {
  const ref = React.useRef<HTMLCanvasElement>(null), modeRef = React.useRef(mode);
  modeRef.current = mode;
  React.useEffect(() => {
    const cv = ref.current!, ctx = cv.getContext("2d")!, N = 64, img = ctx.createImageData(N, N);
    const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const rgb = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
    let raf = 0, level = 0;
    const draw = (now: number) => {
      const t = still ? 0 : now / 1000, m = modeRef.current, ramp = RAMPS[m].map(rgb);
      level += ((meter.current?.() ?? 0) * 4 - level) * 0.25;                 // smoothed loudness, about 0..1
      const lv = Math.min(1, level), R = 22 + (m === "thinking" ? 1.5 * Math.sin(t * 3) : 0) + lv * 4;
      const swirl = m === "thinking" ? t * 2.4 : t;
      for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
        const dx = x - N / 2 + 0.5, dy = y - N / 2 + 0.5, d = Math.hypot(dx, dy), a = Math.atan2(dy, dx);
        const r = R * (1 + 0.07 * Math.sin(3 * a + swirl * 1.3) + 0.05 * Math.sin(5 * a - swirl * 1.7) + 0.04 * Math.sin(2 * a + t * 0.7)
          + lv * 0.16 * Math.sin(7 * a + t * 9));
        const o = (y * N + x) * 4;
        let c: number[] | null = null;
        if (d < r) {
          // light from the top left, stepped into four tones so it stays pixel art
          const k = Math.min(0.999, Math.max(0, d / r * 0.75 + ((dx + dy) / (2 * r)) * 0.35 + 0.15));
          c = ramp[Math.floor(k * ramp.length)];
        } else if (d < r + 2.2) c = [255, 255, 255];
        if (c) { img.data[o] = c[0]; img.data[o + 1] = c[1]; img.data[o + 2] = c[2]; img.data[o + 3] = 255; } else img.data[o + 3] = 0;
      }
      ctx.putImageData(img, 0, 0);
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [meter]);
  return <canvas ref={ref} width={64} height={64} aria-hidden className={className} style={{ imageRendering: "pixelated", filter: "drop-shadow(0 18px 18px rgb(0 0 0 / 0.45))" }} />;
}

// ---------------------------------------------------------------------------------------------------------------

export function Onboarding({ open, onOpenChange, onJoined }: { open: boolean; onOpenChange: (o: boolean) => void; onJoined: (id: string) => void }) {
  const [step, setStep] = React.useState<"you" | "look" | "connect" | "card">("you");
  const [profile, setProfile] = React.useState<Profile | null>(null);
  const [name, setName] = React.useState("");
  const [photo, setPhoto] = React.useState<string | null>(null);
  const [look, setLook] = React.useState<Look>({});

  const [linkedin, setLinkedin] = React.useState("");
  const [headline, setHeadline] = React.useState<string | null>(null);
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onOpenChange(false);
    addEventListener("keydown", onKey); return () => removeEventListener("keydown", onKey);
  }, [open, onOpenChange]);
  const restart = () => { setStep("you"); setName(""); setPhoto(null); setLook({}); setLinkedin(""); setHeadline(null); setProfile(null); };

  if (!open) return null;
  return (
    <div role="dialog" aria-modal="true" aria-label="Make your bot" className="overlay-fade fixed inset-0 z-50 overflow-y-auto bg-ink/[0.92] text-paper">
      <Button variant="ghost" size="icon" aria-label="Close" className="!fixed right-4 top-4 z-10 text-paper hover:bg-paper/10 md:right-8 md:top-8" onClick={() => onOpenChange(false)}><Close /></Button>

      <div className="mx-auto flex min-h-dvh w-full max-w-5xl flex-col items-center justify-center gap-10 px-4 py-20">
        {step === "you" && <YouStep name={name} setName={setName} onRead={(n, shot, r) => {
          setName(n); setPhoto(shot);
          setLook({ ...lookOf(n), ...(r.look ?? {}) }); setStep("look");
        }} />}
        {step === "look" && <LookStep name={name} photo={photo} look={look} setLook={setLook} onRetake={() => setStep("you")} onDone={() => setStep("connect")} />}
        {step === "connect" && <ConnectStep name={name} onDone={(p, li, hl) => { setLinkedin(li); setHeadline(hl); setProfile(p); setStep("card"); }} />}
        {step === "card" && profile && <CardStep name={name} look={look} linkedin={linkedin} headline={headline} profile={profile} setProfile={setProfile} onJoined={(id) => { onJoined(id); restart(); }} />}
      </div>
    </div>
  );
}

// ---- you: your name and a selfie. The camera opens straight away; a photo from files is the fallback ----
type Read = { look?: Look | null; noFace?: boolean };
function YouStep({ name, setName, onRead }: { name: string; setName: (n: string) => void; onRead: (name: string, photo: string, r: Read) => void }) {
  const [cam, setCam] = React.useState<MediaStream | null>(null);
  const [camFailed, setCamFailed] = React.useState(false);
  const [shot, setShot] = React.useState<string | null>(null);
  const [reading, setReading] = React.useState(false);
  const [tick, setTick] = React.useState(0);
  const video = React.useRef<HTMLVideoElement>(null), file = React.useRef<HTMLInputElement>(null), nameBox = React.useRef<HTMLInputElement>(null);
  const idle = React.useRef<() => number>(() => 0);

  const openCam = React.useCallback(async () => {
    setShot(null);
    try { setCam(await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 1280 } } })); setCamFailed(false); }
    catch { setCamFailed(true); }
  }, []);
  React.useEffect(() => { openCam(); }, [openCam]);
  React.useEffect(() => { if (video.current) video.current.srcObject = cam; return () => cam?.getTracks().forEach((t) => t.stop()); }, [cam]);
  React.useEffect(() => { if (!reading) return; setTick(0); const t = setInterval(() => setTick((n) => n + 1), 1100); return () => clearInterval(t); }, [reading]);

  const snap = () => {
    const v = video.current;
    if (!v || !v.videoWidth) return;
    setShot(shrink(v, v.videoWidth, v.videoHeight, true)); setCam(null);
  };
  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]; e.target.value = "";
    if (!f) return;
    try { const bmp = await createImageBitmap(f); setShot(shrink(bmp, bmp.width, bmp.height, false)); setCam(null); } catch { toast.error("Couldn't open that photo"); }
  };
  const n = name.trim();
  const go = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!n) { nameBox.current?.focus(); return; }
    if (!shot) { if (cam) snap(); return; }
    setReading(true);
    const r = await api("/onboard/look", "spectator", "POST", { photo: shot }).catch((err: Error) => ({ error: err.message })) as Read & { error?: string };
    setReading(false);
    if (r.noFace) { toast.error("Couldn't see your face", { description: "Face the camera in good light and try again." }); openCam(); return; }
    if (r.error || !r.look) toast.error("Grok couldn't read that photo", { description: "You can set your look by hand next." });
    onRead(n, shot, r);
  };

  if (reading) return (
    <div className="flex flex-col items-center gap-10 text-center">
      <span className="sticker face-paper crooked p-2" style={tilt(-3)}>
        <DitherImage src={shot!} alt="Your selfie" ink="sky" scale={2} frame={false} className="size-48" />
      </span>
      <Orb mode="thinking" meter={idle} className="size-24" />
      <h1 key={tick} className="word-drop text-5xl font-extrabold leading-[1.02] tracking-[-0.025em] md:text-[64px]">{READING[tick % READING.length]}…</h1>
    </div>
  );

  return (
    <form onSubmit={go} className="grid w-full items-center gap-12 md:grid-cols-[auto_1fr] md:gap-16">
      <div className="relative mx-auto">
        <span className="sticker face-paper crooked block p-2" style={tilt(-2)}>
          {shot ? <img src={shot} alt="Your selfie" className="size-[min(78vw,320px)] object-cover" />
            : cam ? <video ref={video} autoPlay playsInline muted aria-label="Your camera" className="size-[min(78vw,320px)] -scale-x-100 object-cover" />
            : <span className="flex size-[min(78vw,320px)] flex-col items-center justify-center gap-4 bg-ink/90 p-6 text-center text-lg font-bold text-paper">
                <Camera className="pixel-icon size-12" />
                {camFailed ? "No camera. Pick a selfie from your photos instead." : "Opening your camera…"}
              </span>}
        </span>
      </div>

      <div className="flex flex-col gap-8">
        <h1 className="text-5xl font-extrabold leading-[1.02] tracking-[-0.025em] text-balance md:text-[72px]">
          {["Hey.", "Who", "are", "you?"].map((w, i) => (
            <React.Fragment key={w}>{i > 0 && " "}<span className="word-drop" style={{ animationDelay: `${200 + i * 150}ms` }}>{w}</span></React.Fragment>
          ))}
        </h1>
        <Input ref={nameBox} aria-label="Your name" placeholder="Your name" value={name} autoFocus onChange={(e) => setName(e.target.value)} />
        <div className="flex flex-wrap items-center gap-4">
          {shot ? <Button type="submit" size="lg" tilt={-2} disabled={!n}>That&apos;s me <ArrowRight /></Button>
            : cam ? <Button type="button" size="lg" tilt={-2} onClick={snap}><Camera /> Snap</Button>
            : <Button type="button" size="lg" tilt={-2} onClick={() => file.current?.click()}><Camera /> Pick a selfie</Button>}
          {shot && <Button type="button" variant="secondary" tilt={1.5} onClick={openCam}>Retake</Button>}
          {cam && <Button type="button" variant="ghost" className="text-paper hover:bg-paper/10" onClick={() => file.current?.click()}>Use a photo instead</Button>}
          <input ref={file} type="file" accept="image/*" capture="user" hidden onChange={onFile} />
        </div>
      </div>
    </form>
  );
}

// ---- look: your pixel self, editable by picking from tiny versions of you. Skin tone comes only from the photo ----
function Pick({ on, label, onClick, children }: { on: boolean; label: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <button type="button" aria-label={label} aria-pressed={on} onClick={onClick}
      className={`sticker peel focus-cut flex cursor-pointer items-end justify-center ${on ? "face-lime sticker-flat" : "face-paper"}`}>
      {children}
    </button>
  );
}

function LookStep({ name, photo, look, setLook, onRetake, onDone }: {
  name: string; photo: string | null; look: Look; setLook: React.Dispatch<React.SetStateAction<Look>>; onRetake: () => void; onDone: () => void;
}) {
  const hero = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => { const t = setTimeout(() => fireStickerBurst(hero.current ?? undefined, { count: 24 }), 200); return () => clearTimeout(t); }, []);
  // picking a swatch replaces the exact colour Grok read from the photo
  const set = (patch: Partial<Look>) => setLook((l) => ({ ...l, ...patch }));
  const swatch = (on: boolean) => `sticker peel focus-cut cursor-pointer ${on ? "sticker-flat" : ""}`;
  return (
    <div className="grid w-full items-center gap-12 md:grid-cols-[auto_1fr] md:gap-16">
      <div ref={hero} className="relative mx-auto animate-slap">
        <CharAvatar name={name} look={look} cell={11} walk turn className="!px-4 !pt-4" />
        {photo && (
          <span className="sticker face-paper crooked absolute -right-10 -top-8 p-1" style={tilt(6)}>
            <img src={photo} alt="Your selfie" className="size-24 object-cover" />
          </span>
        )}
      </div>

      <div className="flex flex-col gap-8">
        <h1 className="text-5xl font-extrabold leading-[1.02] tracking-[-0.025em] text-balance md:text-[64px]">Hi, {name.split(" ")[0]}.</h1>

        <div className="flex flex-col gap-5" role="group" aria-label="Change your look">
          <div className="flex flex-wrap gap-3">
            {PALETTES.STYLES.map((s: string, i: number) => (
              <Pick key={s} on={look.style === i} label={`${s} hair`} onClick={() => set({ style: i })}>
                <CharAvatar name={name} look={{ ...look, style: i }} cell={2} bare className="px-1 pt-1" label="" />
              </Pick>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {look.hairHex && <button type="button" aria-label="Hair colour from your selfie" aria-pressed className={`${swatch(true)} size-11`} style={{ ["--face" as string]: look.hairHex, ...tilt(-2) }} />}
            {PALETTES.HAIR.map((h: string[], i: number) => (
              <button key={i} type="button" aria-label={`Hair colour ${i + 1}`} aria-pressed={!look.hairHex && look.hair === i} onClick={() => set({ hair: i, hairHex: undefined })}
                className={`${swatch(!look.hairHex && look.hair === i)} size-11`} style={{ ["--face" as string]: h[0], ...tilt(i % 2 ? 2 : -2) }} />
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {look.topHex && <button type="button" aria-label="Shirt colour from your selfie" aria-pressed className={`${swatch(true)} h-11 w-8`} style={{ ["--face" as string]: look.topHex, ...tilt(2) }} />}
            {PALETTES.TOP.map((c: string[], i: number) => (
              <button key={i} type="button" aria-label={`Shirt colour ${i + 1}`} aria-pressed={!look.topHex && look.top === i} onClick={() => set({ top: i, topHex: undefined })}
                className={`${swatch(!look.topHex && look.top === i)} h-11 w-8`} style={{ ["--face" as string]: c[0], ...tilt(i % 2 ? -2 : 2) }} />
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {BEARDS.map((b: string) => (
              <Button key={b} size="sm" variant={(look.beard ?? "none") === b ? "success" : "secondary"} aria-pressed={(look.beard ?? "none") === b} onClick={() => set({ beard: b })}>{BEARD_LABEL[b]}</Button>
            ))}
            <span className="mx-2 h-8 w-1 bg-paper/20" aria-hidden />
            <Button variant={look.glasses ? "success" : "secondary"} size="sm" onClick={() => set({ glasses: !look.glasses })} aria-pressed={!!look.glasses}>Glasses</Button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <Button size="lg" tilt={-2} onClick={onDone}>That&apos;s me <ArrowRight /></Button>
          <Button variant="secondary" tilt={1.5} onClick={onRetake}><Camera /> Retake selfie</Button>
        </div>
      </div>
    </div>
  );
}

// ---- connect: Google Calendar (free/busy only) and your own links, which Grok reads to suggest your card ----
type Gcal = { email?: string | null; busy?: { start: string; end: string }[]; error?: string };
/**
 * The real gaps in someone's week, in their own timezone: every free stretch of 45 minutes or more between 9am and
 * 9pm over the next 7 days, e.g. "Thu 2:30–5pm". This is what their bot works from when it schedules.
 */
function freeWindows(busy: Gcal["busy"] = [], now = new Date()) {
  const spans = busy.map((b) => [new Date(b.start).getTime(), new Date(b.end).getTime()]).sort((a, b) => a[0] - b[0]);
  const t = (d: Date) => d.toLocaleTimeString("en-US", { hour: "numeric", minute: d.getMinutes() ? "2-digit" : undefined }).replace(" ", "").toLowerCase();
  const out: string[] = [];
  for (let i = 0; i < 7; i++) {
    const day = new Date(now); day.setDate(day.getDate() + i);
    const open = new Date(day), close = new Date(day); open.setHours(9, 0, 0, 0); close.setHours(21, 0, 0, 0);
    let cur = Math.max(open.getTime(), Math.ceil(now.getTime() / 9e5) * 9e5);   // from the next quarter hour
    const end = close.getTime(), gaps: string[] = [];
    const add = (a: number, b: number) => { if (b - a >= 45 * 6e4) gaps.push(`${t(new Date(a))}–${t(new Date(b))}`); };
    for (const [s, e] of spans) { if (e <= cur || s >= end) continue; add(cur, Math.min(s, end)); cur = Math.max(cur, e); }
    if (cur < end) add(cur, end);
    if (gaps.length) out.push(`${day.toLocaleDateString("en-US", { weekday: "short" })} ${gaps.join(", ")}`);
  }
  return out;
}

function ConnectStep({ name, onDone }: { name: string; onDone: (p: Profile, linkedin: string, headline: string | null) => void }) {
  const [googleOk, setGoogleOk] = React.useState<boolean | null>(null);
  const [gcal, setGcal] = React.useState<Gcal | null>(null);
  const [connecting, setConnecting] = React.useState(false);
  const [links, setLinks] = React.useState({ linkedin: "", x: "", github: "", site: "" });
  const [building, setBuilding] = React.useState(false);
  const idle = React.useRef<() => number>(() => 0);
  React.useEffect(() => { fetch(`${RELAY}/onboard/connections`).then((r) => r.json()).then((d) => setGoogleOk(!!d.google)).catch(() => setGoogleOk(false)); }, []);

  // Google sign-in runs in a popup so this screen keeps its state; the popup tells us when it's done
  const connect = () => {
    const w = window.open(`${RELAY}/oauth/google/start`, "grokmate-gcal", "width=520,height=680");
    if (!w) { toast.error("Allow popups to connect your calendar"); return; }
    setConnecting(true);
    const onMsg = async (e: MessageEvent) => {
      if (e.data?.type !== "grokmate:gcal") return;
      removeEventListener("message", onMsg);
      const r = await api(`/onboard/gcal/${e.data.state}`, "spectator").catch(() => ({ error: "Couldn't read your calendar" }));
      setConnecting(false);
      if (r.error) toast.error(r.error === "access_denied" ? "Calendar not connected" : r.error); else setGcal(r);
    };
    addEventListener("message", onMsg);
    const shut = setInterval(() => { if (w.closed) { clearInterval(shut); setTimeout(() => setConnecting(false), 800); } }, 500);
  };

  const build = async () => {
    setBuilding(true);
    const slug = slugOf(links.linkedin), linkedin = slug ? `https://www.linkedin.com/in/${slug}` : "";
    const who = linkedin ? await api(`/onboard/who?url=${encodeURIComponent(linkedin)}`, "spectator").catch(() => ({})) as { headline?: string | null } : {};
    const headline = who.headline ?? null;
    const list = [linkedin, links.x && (links.x.includes("/") ? links.x : `https://x.com/${links.x.replace(/^@/, "")}`),
      links.github && (links.github.includes("/") ? links.github : `https://github.com/${links.github}`), links.site].filter(Boolean);
    const p = await api("/onboard/suggest", "spectator", "POST", { name, headline, links: list }).catch(() => ({ offers: [], openTo: ["coffee"], facts: [] }));
    const facts: Fact[] = [...(p.facts ?? []).filter((f: Fact) => f.topic !== "availability"), ...(gcal?.busy ? [{ topic: "availability", text: freeWindows(gcal.busy).length ? `Free ${freeWindows(gcal.busy).join("; ")}` : "No free time in the next 7 days" }] : [])];
    onDone({ offers: p.offers ?? [], openTo: p.openTo?.length ? p.openTo : ["coffee"], facts, hide: ["contact", "grades"] }, linkedin, headline);
  };

  if (building) return (
    <div className="flex flex-col items-center gap-10 text-center">
      <Orb mode="thinking" meter={idle} className="size-[min(48vw,224px)]" />
      <h1 className="word-drop text-5xl font-extrabold leading-[1.02] tracking-[-0.025em] md:text-[64px]">Building your avatar…</h1>
    </div>
  );

  return (
    <div className="flex w-full max-w-xl flex-col gap-10">
      <h1 className="word-drop text-5xl font-extrabold leading-[1.02] tracking-[-0.025em] text-balance md:text-[64px]">Connect your socials</h1>

      <div className="animate-drop-in flex flex-col gap-4" style={{ animationDelay: "150ms" }}>
        {gcal ? (
          <div className="sticker face-lime crooked flex items-start gap-4 self-start px-5 py-4" style={tilt(-1.5)}>
            <Calendar className="pixel-icon size-8 shrink-0" />
            <span className="flex flex-col gap-2">
              {gcal.email && <span className="text-lg font-extrabold">{gcal.email}</span>}
              {freeWindows(gcal.busy).length ? (
                <ul className="flex flex-col gap-1 text-base font-medium">
                  {freeWindows(gcal.busy).map((d) => <li key={d}>{d}</li>)}
                </ul>
              ) : <span className="text-base font-medium">No free time in the next 7 days</span>}
            </span>
          </div>
        ) : (
          <Button size="lg" variant="secondary" tilt={-1.5} className="self-start !h-16 !px-6 !text-xl" loading={connecting} disabled={googleOk === false} onClick={connect}>
            <Calendar /> {googleOk === false ? "Google Calendar isn't set up" : "Connect Google Calendar"}
          </Button>
        )}
      </div>

      <div className="animate-drop-in flex flex-col gap-4" style={{ animationDelay: "300ms" }}>
        <Input aria-label="LinkedIn" leading={<Linkedin />} placeholder="linkedin.com/in/you" value={links.linkedin} onChange={(e) => setLinks({ ...links, linkedin: e.target.value })} />
        <Input aria-label="X handle" leading={<X />} placeholder="@you on X" value={links.x} onChange={(e) => setLinks({ ...links, x: e.target.value })} />
        <Input aria-label="GitHub" leading={<Github />} placeholder="GitHub username" value={links.github} onChange={(e) => setLinks({ ...links, github: e.target.value })} />
        <Input aria-label="Website" leading={<Globe />} placeholder="yoursite.com" value={links.site} onChange={(e) => setLinks({ ...links, site: e.target.value })} />
      </div>

      <Button size="lg" tilt={-2} className="animate-drop-in self-start" style={{ animationDelay: "450ms" }} onClick={build}>Build my avatar <ArrowRight /></Button>
    </div>
  );
}

// ---- the card your bot will show, and what it keeps to itself. Tap a topic to make it private ----
const TOPICS = ["classes", "grades", "internships", "projects", "availability", "startup"];

function CardStep({ name, look, linkedin, headline, profile, setProfile, onJoined }: {
  name: string; look: Look; linkedin: string; headline: string | null; profile: Profile; setProfile: (p: Profile) => void; onJoined: (id: string) => void;
}) {
  const [joining, setJoining] = React.useState(false);
  const drop = async () => {
    setJoining(true);
    try {
      const r = await api("/join", "spectator", "POST", { kind: "real", name, look, linkedin, place: "tresidder", affiliation: headline ?? "Stanford", ...profile });
      onJoined(r.id);
    } catch (e) { toast.error((e as Error).message); setJoining(false); }
  };
  const hidden = (t: string) => profile.hide.includes(t);
  return (
    <div className="grid w-full items-center gap-12 md:grid-cols-[auto_1fr] md:gap-16">
      <CharAvatar name={name} look={look} cell={9} walk turn className="mx-auto !px-4 !pt-4" />

      <div className="flex flex-col gap-8">
        <h1 className="text-5xl font-extrabold leading-[1.02] tracking-[-0.025em] text-balance md:text-[64px]">Your bot&apos;s ready.</h1>

        <div className="flex flex-wrap gap-3" aria-label="Can help with">
          {profile.offers.map((o, i) => (
            <Badge key={o} tone="paper" tilt={i % 2 ? 2 : -2} className="!h-10 gap-2 !px-4 !text-base">
              {o}
              <button type="button" aria-label={`Remove ${o}`} className="cursor-pointer" onClick={() => setProfile({ ...profile, offers: profile.offers.filter((x) => x !== o) })}><Close className="size-4" /></button>
            </Badge>
          ))}
        </div>

        <ToggleGroup type="multiple" className="flex-wrap" aria-label="Open to" value={profile.openTo} onValueChange={(v: string[]) => setProfile({ ...profile, openTo: v })}>
          {Object.entries(KIND_LABEL).map(([k, label]) => <ToggleGroupItem key={k} value={k}>{label}</ToggleGroupItem>)}
        </ToggleGroup>

        <div className="flex flex-col gap-3">
          <span className="text-lg font-extrabold">Keeps private</span>
          <div className="flex flex-wrap gap-3">
            {TOPICS.map((t) => (
              <Button key={t} size="sm" variant={hidden(t) ? "ink" : "secondary"} aria-pressed={hidden(t)}
                className={hidden(t) ? "!shadow-[0_0_0_4px_#fff]" : "opacity-70"}
                onClick={() => setProfile({ ...profile, hide: hidden(t) ? profile.hide.filter((x) => x !== t) : [...profile.hide, t] })}>
                {TOPIC_LABEL[t] ?? t}
              </Button>
            ))}
          </div>
        </div>

        <Button size="lg" tilt={-2} className="self-start" loading={joining} onClick={drop}>Drop me on campus <ArrowRight /></Button>
      </div>
    </div>
  );
}
