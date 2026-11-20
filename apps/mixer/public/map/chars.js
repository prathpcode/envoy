// Mixer pixel people: a deterministic human character from a name, with walk / idle / talk frames.
// Shared by the map (public/map/index.html) and the React UI (components/char-avatar.tsx).
// Every material is a 3-step ramp [base, shade, outline]; light comes from the top-left.

const SKIN = [
  ["#f7d7bd", "#e4b393", "#a8735a"], ["#ebbc93", "#d39a70", "#94603f"], ["#cf9264", "#ad7048", "#6e4428"],
  ["#a46a43", "#835231", "#4c2c18"], ["#744a2e", "#5a3720", "#2e1a0e"],
];
const HAIR = [
  ["#2b2329", "#1b151a", "#0b080a"], ["#6b4428", "#4e301b", "#26160b"], ["#e9c56c", "#c99e48", "#7e5f27"],
  ["#c9562e", "#9e3f1f", "#5a2210"], ["#ff7fb0", "#e0568e", "#8f2a56"], ["#5aa8ff", "#3b7fd6", "#1d467f"],
  ["#d9d9de", "#b4b4bc", "#6c6c76"],
];
const TOP = [
  ["#ff3d8b", "#d92a6f", "#7c1440"], ["#36b8ff", "#1f93d6", "#0d4d73"], ["#b6f23a", "#8fc923", "#4a6b0e"],
  ["#ffd23f", "#e0ad1f", "#7f5f08"], ["#ff5a36", "#d9401f", "#7a1f0c"], ["#f4f4f6", "#cfd0d6", "#6f727a"],
  ["#3a3d46", "#2a2c33", "#121317"],
];
const BOTTOM = [
  ["#4a6aa8", "#36508a", "#1c2c52"], ["#c9b08a", "#a88f68", "#5e4f36"], ["#30323a", "#22242a", "#0e0f12"],
  ["#8a8f9a", "#6e737e", "#3b3e45"],
];
const SHOE = [["#f4f4f6", "#c8c9cf", "#5d6068"], ["#2b2329", "#1b151a", "#0b080a"], ["#ff5a36", "#d9401f", "#7a1f0c"]];
const EYE = ["#1b1418", "#1b1418", "#1b1418"];
const MOUTH = ["#8a2c3a", "#8a2c3a", "#4a141e"];
const GLASS = ["#1b1418", "#1b1418", "#1b1418"];
const STYLES = ["short", "spiky", "long", "bun", "buzz", "curly", "ponytail", "cap"];

export const CW = 12, CH = 20;
export const PALETTES = { SKIN, HAIR, TOP, STYLES };

function fnv(s) { let h = 2166136261; for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619); return h >>> 0; }
function mb32(seed) { let a = seed; return () => { a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
const pick = (r, a) => a[Math.floor(r() * a.length)];

export function traits(name) {
  const r = mb32(fnv((name || "?").trim().toLowerCase()));
  const top = pick(r, TOP);
  return {
    skin: pick(r, SKIN), hair: r() < 0.82 ? pick(r, HAIR.slice(0, 4)) : pick(r, HAIR.slice(4)), style: pick(r, STYLES),
    top, bottom: pick(r, BOTTOM), shoe: pick(r, SHOE), glasses: r() < 0.28, longSleeve: r() < 0.5,
    cap: pick(r, TOP.filter((t) => t !== top)),
  };
}

// a 3-step ramp from one exact colour (a selfie's skin, hair or shirt): base, shade, outline
const HEX = /^#[0-9a-f]{6}$/i;
function ramp(hex) {
  const n = parseInt(hex.slice(1), 16), c = [n >> 16, (n >> 8) & 255, n & 255];
  const mul = (k) => "#" + c.map((v) => Math.round(v * k).toString(16).padStart(2, "0")).join("");
  return [hex.toLowerCase(), mul(0.82), mul(0.45)];
}
export const BEARDS = ["none", "stubble", "mustache", "goatee", "beard"];

/**
 * A chosen look: { skin, hair, style, top, glasses } as indices into PALETTES (glasses a boolean), optionally with
 * exact colours { skinHex, hairHex, topHex } (which win over the indices) and facial hair { beard: one of BEARDS }.
 * Anything left out comes from the name, so a partial look is fine.
 */
export function lookTraits(name, look) {
  const t = traits(name);
  if (!look) return t;
  const at = (arr, i) => (Number.isInteger(i) && arr[i] ? arr[i] : null);
  const hex = (h) => (typeof h === "string" && HEX.test(h) ? ramp(h) : null);
  const top = hex(look.topHex) ?? at(TOP, look.top) ?? t.top;
  return { ...t, skin: hex(look.skinHex) ?? at(SKIN, look.skin) ?? t.skin, hair: hex(look.hairHex) ?? at(HAIR, look.hair) ?? t.hair,
    style: at(STYLES, look.style) ?? t.style, beard: BEARDS.includes(look.beard) ? look.beard : "none",
    top, glasses: typeof look.glasses === "boolean" ? look.glasses : t.glasses, cap: t.cap === top ? TOP[(TOP.indexOf(top) + 1) % TOP.length] : t.cap };
}
/** The look a name gives by default, as indices, so an editor can start from it. */
export function lookOf(name) {
  const t = traits(name);
  return { skin: SKIN.indexOf(t.skin), hair: HAIR.indexOf(t.hair), style: STYLES.indexOf(t.style), top: TOP.indexOf(t.top), glasses: t.glasses };
}

// A masked grokmate: the same blank figure for everyone, so nothing about it points back to a person.
// The asker's envoy wears ink so the ring has a visible centre.
const MASK = ["#f4f4f6", "#cfd0d6", "#6f727a"], CLOAK = ["#8a8f9a", "#6e737e", "#3b3e45"], CLOAK_INK = ["#3a3d46", "#2a2c33", "#121317"];
export function maskTraits(asker) {
  const c = asker ? CLOAK_INK : CLOAK;
  return { skin: MASK, hair: c, style: "long", top: c, bottom: c, shoe: c, glasses: false, longSleeve: true, cap: c };
}

// paint the character into a grid of { ramp, tone } cells (tone 0 base, 1 shade, 2 dark feature)
function paint(t, view, frame, talk, blink) {
  const g = Array.from({ length: CH }, () => Array(CW).fill(null));
  // a null ramp erases the cell (used to round off hair corners)
  const set = (x, y, ramp, tone = 0) => { if (x >= 0 && x < CW && y >= 0 && y < CH) g[y][x] = ramp ? { ramp, tone } : null; };
  const rect = (x0, y0, x1, y1, ramp, tone = 0) => { for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) set(x, y, ramp, tone); };
  const walking = frame >= 0;
  const f = walking ? frame : 0;
  const b = walking && (f === 0 || f === 2) ? -1 : 0;         // body bobs up on passing frames
  const stride = walking && (f === 1 || f === 3);
  const lead = f === 1 ? 0 : 1;                                 // which leg leads on a stride frame
  const sleeve = t.longSleeve ? t.top : t.skin;

  if (view === "side") {
    // legs
    if (stride) {
      const near = lead === 0 ? t.bottom : t.bottom, farTone = 1;
      [[6, 15], [7, 16], [7, 17], [8, 18]].forEach(([x, y]) => set(x, y, near));
      [[5, 15], [4, 16], [4, 17], [3, 18]].forEach(([x, y]) => set(x, y, t.bottom, farTone));
      rect(8, 19, 9, 19, t.shoe); rect(2, 19, 3, 19, t.shoe, 1);
    } else {
      rect(5, 15, 6, 18, t.bottom); rect(5, 19, 7, 19, t.shoe);
    }
    rect(4, 9 + b, 7, 14, t.top); set(4, 14, t.bottom); rect(4, 14, 7, 14, t.bottom);
    // arm (near side) swings opposite the near leg
    const sw = !walking ? 0 : f === 1 ? 1 : f === 3 ? -1 : 0;
    const raised = talk && frame === -2;
    if (raised) { rect(6, 10 + b, 6, 11 + b, sleeve); set(7, 9 + b, t.skin); set(7, 8 + b, t.skin); }
    else if (sw === 1) { set(6, 10 + b, t.top, 1); set(6, 11 + b, sleeve, 1); set(7, 12 + b, sleeve, 1); set(8, 13 + b, t.skin); }
    else if (sw === -1) { set(5, 10 + b, t.top, 1); set(4, 11 + b, sleeve, 1); set(4, 12 + b, sleeve, 1); set(3, 13 + b, t.skin); }
    else { rect(5, 10 + b, 6, 12 + b, sleeve, 1); rect(5, 10 + b, 6, 10 + b, t.top, 1); set(6, 13 + b, t.skin); set(5, 13 + b, t.skin); }
    // head
    rect(3, 3 + b, 8, 7 + b, t.skin); rect(4, 2 + b, 7, 2 + b, t.skin); rect(4, 8 + b, 7, 8 + b, t.skin);
    set(9, 6 + b, t.skin); set(5, 9 + b, t.skin, 1); set(6, 9 + b, t.skin, 1);
    set(7, 5 + b, blink ? t.skin : EYE, blink ? 1 : 2);
    if (talk && frame === -2) set(8, 7 + b, MOUTH, 2); else set(8, 7 + b, t.skin, 1);
    if (t.glasses) { set(6, 5 + b, GLASS, 2); set(8, 5 + b, GLASS, 2); set(7, 4 + b, GLASS, 2); }
    const FH = t.beard;
    if (FH === "mustache" || FH === "goatee" || FH === "beard") set(8, 6 + b, t.hair, 1);
    if (FH === "goatee") { set(7, 8 + b, t.hair, 1); set(8, 8 + b, t.hair, 1); }
    if (FH === "beard" || FH === "stubble") { rect(4, 7 + b, 7, 8 + b, t.hair, FH === "stubble" ? 1 : 0); set(9, 6 + b, t.skin); }
    // hair
    const H_ = t.hair;
    if (t.style === "cap") { rect(3, 1 + b, 8, 3 + b, t.cap); rect(8, 3 + b, 10, 3 + b, t.cap, 1); rect(2, 4 + b, 3, 6 + b, H_); }
    else if (t.style === "buzz") { rect(3, 2 + b, 7, 2 + b, H_, 1); rect(3, 3 + b, 4, 5 + b, H_, 1); }
    else if (t.style === "curly") { rect(2, 0 + b, 8, 3 + b, H_); rect(1, 2 + b, 4, 7 + b, H_); set(8, 0 + b, null); }
    else {
      rect(3, 1 + b, 8, 3 + b, H_); rect(2, 2 + b, 4, 6 + b, H_); set(8, 3 + b, t.skin);
      if (t.style === "spiky") { set(4, 0 + b, H_); set(6, 0 + b, H_); set(8, 0 + b, H_); }
      if (t.style === "long") rect(2, 4 + b, 3, 12 + b, H_);
      if (t.style === "bun") rect(2, 0 + b, 3, 1 + b, H_, 1);
      if (t.style === "ponytail") { rect(1, 4 + b, 2, 9 + b, H_); }
    }
    return g;
  }

  // front / back
  const back = view === "back";
  if (stride) {
    // the lifted leg is one row shorter; its shoe sits a row higher
    if (lead === 0) { rect(3, 15, 5, 17, t.bottom); rect(3, 18, 5, 18, t.shoe); rect(6, 15, 8, 18, t.bottom); rect(6, 19, 8, 19, t.shoe); }
    else { rect(3, 15, 5, 18, t.bottom); rect(3, 19, 5, 19, t.shoe); rect(6, 15, 8, 17, t.bottom); rect(6, 18, 8, 18, t.shoe); }
  } else { rect(3, 15, 5, 18, t.bottom); rect(6, 15, 8, 18, t.bottom); rect(3, 19, 5, 19, t.shoe); rect(6, 19, 8, 19, t.shoe); }
  for (let y = 15; y <= 18; y++) if (g[y][5]) g[y][5] = { ramp: t.bottom, tone: 1 };   // inseam
  rect(3, 9 + b, 8, 13, t.top); rect(2, 10 + b, 9, 10 + b, t.top); rect(3, 14, 8, 14, t.bottom);
  // arms + hands, swinging opposite the legs
  const lh = !walking ? 13 : lead === 0 && stride ? 14 : stride ? 12 : 13, rh = !walking ? 13 : lead === 1 && stride ? 14 : stride ? 12 : 13;
  const raised = talk && frame === -2 && !back;
  rect(2, 11 + b, 2, lh - 1, sleeve); set(2, lh, t.skin);
  if (raised) { set(9, 9 + b, sleeve); set(10, 8 + b, t.skin); set(10, 7 + b, t.skin); }
  else { rect(9, 11 + b, 9, rh - 1, sleeve, 1); set(9, rh, t.skin, 1); }
  // head
  rect(2, 3 + b, 9, 7 + b, t.skin); rect(3, 2 + b, 8, 2 + b, t.skin); rect(3, 8 + b, 8, 8 + b, t.skin);
  set(5, 9 + b, t.skin, 1); set(6, 9 + b, t.skin, 1);
  if (!back) {
    set(4, 5 + b, blink ? t.skin : EYE, blink ? 1 : 2); set(7, 5 + b, blink ? t.skin : EYE, blink ? 1 : 2);
    if (talk && frame === -2) { set(5, 7 + b, MOUTH, 2); set(6, 7 + b, MOUTH, 2); } else { set(5, 7 + b, t.skin, 1); set(6, 7 + b, t.skin, 1); }
    if (t.glasses) { rect(3, 4 + b, 8, 4 + b, GLASS, 2); set(3, 5 + b, GLASS, 2); set(8, 5 + b, GLASS, 2); set(5, 5 + b, GLASS, 2); set(6, 5 + b, GLASS, 2); }
    // facial hair: the mouth (5-6, row 7) stays clear so a talking frame still reads
    const FH = t.beard, H = t.hair;
    if (FH === "stubble") { set(2, 7 + b, H, 1); set(9, 7 + b, H, 1); rect(3, 8 + b, 8, 8 + b, H, 1); set(4, 7 + b, H, 1); set(7, 7 + b, H, 1); }
    if (FH === "mustache" || FH === "goatee" || FH === "beard") rect(4, 6 + b, 7, 6 + b, H);
    if (FH === "goatee") rect(4, 8 + b, 7, 8 + b, H);
    if (FH === "beard") { rect(2, 6 + b, 2, 7 + b, H); rect(9, 6 + b, 9, 7 + b, H); set(3, 7 + b, H); set(4, 7 + b, H); set(7, 7 + b, H); set(8, 7 + b, H); rect(3, 8 + b, 8, 8 + b, H); }
  }
  const H_ = t.hair;
  if (t.style === "cap") {
    rect(2, 1 + b, 9, 3 + b, t.cap); if (!back) rect(1, 3 + b, 10, 3 + b, t.cap, 1); else rect(2, 4 + b, 9, 6 + b, H_);
  } else if (t.style === "buzz") {
    rect(3, 2 + b, 8, 2 + b, H_, 1); if (back) rect(2, 3 + b, 9, 6 + b, H_, 1);
  } else if (t.style === "curly") {
    rect(1, 0 + b, 10, 3 + b, H_); rect(1, 4 + b, 2, 7 + b, H_); rect(9, 4 + b, 10, 7 + b, H_); set(1, 0 + b, null); set(10, 0 + b, null);
    if (back) rect(1, 4 + b, 10, 8 + b, H_);
  } else {
    rect(2, 1 + b, 9, 3 + b, H_); rect(2, 4 + b, 2, 5 + b, H_); rect(9, 4 + b, 9, 5 + b, H_);
    if (!back) { set(4, 3 + b, t.skin); set(7, 3 + b, t.skin, 1); }   // parted fringe
    if (back) rect(2, 4 + b, 9, 7 + b, H_);
    if (t.style === "spiky") { set(3, 0 + b, H_); set(5, 0 + b, H_); set(7, 0 + b, H_); set(9, 0 + b, H_); }
    if (t.style === "long") { rect(1, 3 + b, 2, 11 + b, H_); rect(9, 3 + b, 10, 11 + b, H_); if (back) rect(3, 8 + b, 8, 11 + b, H_); }
    if (t.style === "bun") rect(4, -1 + b + 1, 7, 0 + b, H_, 1);
    if (t.style === "ponytail" && back) rect(5, 8 + b, 6, 12 + b, H_);
  }
  return g;
}

/**
 * Draw one frame. opts: { view: "front"|"back"|"side", flip, frame: 0..3 walking | -1 idle | -2 talk gesture, blink }
 * Canvas footprint: (CW + 2) x (CH + 3) cells: 1-cell outline margin plus a ground shadow row.
 */
export function drawChar(ctx, t, opts, cell) {
  const { view = "front", flip = false, frame = -1, talk = false, blink = false } = opts || {};
  const g = paint(t, view, frame, talk || frame === -2, blink);
  const W = CW + 2, H = CH + 3;
  const at = (x, y) => (x >= 0 && x < CW && y >= 0 && y < CH ? g[y][x] : null);
  ctx.save();
  ctx.clearRect(0, 0, W * cell, H * cell);
  if (flip) { ctx.translate(W * cell, 0); ctx.scale(-1, 1); }
  // ground shadow
  ctx.fillStyle = "rgba(20,20,40,0.28)";
  ctx.fillRect(3 * cell, (CH + 1) * cell, 8 * cell, cell);
  ctx.fillRect(4 * cell, (CH + 2) * cell, 6 * cell, cell);
  for (let y = -1; y <= CH; y++) for (let x = -1; x <= CW; x++) {
    const c = at(x, y);
    let col;
    if (c) {
      if (c.tone === 2) col = c.ramp[2];
      else {
        const r = at(x + 1, y), d = at(x, y + 1);
        const edge = !r || r.ramp !== c.ramp || (!d && y > 9);
        col = c.tone === 1 || edge ? c.ramp[1] : c.ramp[0];
      }
    } else {
      // selective outline: the darkest shade of whatever material it borders (never pure black)
      const n = at(x, y + 1) || at(x - 1, y) || at(x + 1, y) || at(x, y - 1);
      if (!n) continue;
      col = n.ramp[2];
    }
    ctx.fillStyle = col;
    ctx.fillRect((x + 1) * cell, (y + 1) * cell, cell, cell);
  }
  ctx.restore();
}

export const FOOT = { w: CW + 2, h: CH + 3, feetRow: CH + 1 };
