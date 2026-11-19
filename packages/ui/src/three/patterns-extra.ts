import type { PixelPattern } from "./patterns";

/**
 * Extra pixel patterns + the 5×7 voxel font. Same grammar as `patterns.ts`:
 * one string per row, "." is empty, every other char is a palette key.
 */

/** Tiny shapes for sticker bursts (single ink "p", recoloured per piece). */
export const burstPatterns = {
  plus: [".p.", "ppp", ".p."],
  diamond: ["..p..", ".ppp.", "ppppp", ".ppp.", "..p.."],
  spark: ["p...p", ".p.p.", "..p..", ".p.p.", "p...p"],
  block: ["pp", "pp"],
  zap: ["..pp", ".pp.", "pppp", ".pp.", "pp.."],
} as const satisfies Record<string, PixelPattern>;

export type BurstPatternName = keyof typeof burstPatterns;

/** The five vinyl inks, in the order VoxelText cycles them. */
export const inkCycle = ["#ff3d8b", "#36b8ff", "#b6f23a", "#ffd23f", "#ff5a36"] as const;

/** 5×7 pixel font: A–Z, 0–9 and ! ? . - + : # * ' / ("#" = filled). */
export const pixelFont: Record<string, readonly string[]> = {
  A: [".###.", "#...#", "#...#", "#####", "#...#", "#...#", "#...#"],
  B: ["####.", "#...#", "#...#", "####.", "#...#", "#...#", "####."],
  C: [".###.", "#...#", "#....", "#....", "#....", "#...#", ".###."],
  D: ["####.", "#...#", "#...#", "#...#", "#...#", "#...#", "####."],
  E: ["#####", "#....", "#....", "####.", "#....", "#....", "#####"],
  F: ["#####", "#....", "#....", "####.", "#....", "#....", "#...."],
  G: [".###.", "#...#", "#....", "#.###", "#...#", "#...#", ".####"],
  H: ["#...#", "#...#", "#...#", "#####", "#...#", "#...#", "#...#"],
  I: [".###.", "..#..", "..#..", "..#..", "..#..", "..#..", ".###."],
  J: ["..###", "...#.", "...#.", "...#.", "...#.", "#..#.", ".##.."],
  K: ["#...#", "#..#.", "#.#..", "##...", "#.#..", "#..#.", "#...#"],
  L: ["#....", "#....", "#....", "#....", "#....", "#....", "#####"],
  M: ["#...#", "##.##", "#.#.#", "#.#.#", "#...#", "#...#", "#...#"],
  N: ["#...#", "#...#", "##..#", "#.#.#", "#..##", "#...#", "#...#"],
  O: [".###.", "#...#", "#...#", "#...#", "#...#", "#...#", ".###."],
  P: ["####.", "#...#", "#...#", "####.", "#....", "#....", "#...."],
  Q: [".###.", "#...#", "#...#", "#...#", "#.#.#", "#..#.", ".##.#"],
  R: ["####.", "#...#", "#...#", "####.", "#.#..", "#..#.", "#...#"],
  S: [".####", "#....", "#....", ".###.", "....#", "....#", "####."],
  T: ["#####", "..#..", "..#..", "..#..", "..#..", "..#..", "..#.."],
  U: ["#...#", "#...#", "#...#", "#...#", "#...#", "#...#", ".###."],
  V: ["#...#", "#...#", "#...#", "#...#", "#...#", ".#.#.", "..#.."],
  W: ["#...#", "#...#", "#...#", "#.#.#", "#.#.#", "#.#.#", ".#.#."],
  X: ["#...#", "#...#", ".#.#.", "..#..", ".#.#.", "#...#", "#...#"],
  Y: ["#...#", "#...#", ".#.#.", "..#..", "..#..", "..#..", "..#.."],
  Z: ["#####", "....#", "...#.", "..#..", ".#...", "#....", "#####"],
  "0": [".###.", "#...#", "#..##", "#.#.#", "##..#", "#...#", ".###."],
  "1": ["..#..", ".##..", "..#..", "..#..", "..#..", "..#..", ".###."],
  "2": [".###.", "#...#", "....#", "...#.", "..#..", ".#...", "#####"],
  "3": ["#####", "...#.", "..#..", "...#.", "....#", "#...#", ".###."],
  "4": ["...#.", "..##.", ".#.#.", "#..#.", "#####", "...#.", "...#."],
  "5": ["#####", "#....", "####.", "....#", "....#", "#...#", ".###."],
  "6": ["..##.", ".#...", "#....", "####.", "#...#", "#...#", ".###."],
  "7": ["#####", "....#", "...#.", "..#..", ".#...", ".#...", ".#..."],
  "8": [".###.", "#...#", "#...#", ".###.", "#...#", "#...#", ".###."],
  "9": [".###.", "#...#", "#...#", ".####", "....#", "...#.", ".##.."],
  "!": ["..#..", "..#..", "..#..", "..#..", "..#..", ".....", "..#.."],
  "?": [".###.", "#...#", "....#", "...#.", "..#..", ".....", "..#.."],
  ".": [".....", ".....", ".....", ".....", ".....", ".....", "..#.."],
  "-": [".....", ".....", ".....", ".###.", ".....", ".....", "....."],
  "+": [".....", "..#..", "..#..", "#####", "..#..", "..#..", "....."],
  ":": [".....", "..#..", "..#..", ".....", "..#..", "..#..", "....."],
  "#": [".#.#.", ".#.#.", "#####", ".#.#.", "#####", ".#.#.", ".#.#."],
  "*": [".....", "#.#.#", ".###.", "#####", ".###.", "#.#.#", "....."],
  "'": ["..#..", "..#..", ".#...", ".....", ".....", ".....", "....."],
  "/": ["....#", "....#", "...#.", "..#..", ".#...", "#....", "#...."],
};

/**
 * Lay a word out in the 5×7 font as a PixelPattern. Each glyph gets the next key from
 * `keys` (so letters cycle colours); "\n" starts a new line, lines are centred.
 */
export function textToPattern(text: string, keys: readonly string[] = ["A", "B", "C", "D", "E"]): string[] {
  const lines = text.toUpperCase().split("\n");
  let n = 0;
  const rendered = lines.map((line) => {
    const rows = Array.from({ length: 7 }, () => "");
    [...line].forEach((ch, i) => {
      const glyph = pixelFont[ch];
      const gap = i > 0 ? "." : "";
      if (!glyph) {
        for (let r = 0; r < 7; r++) rows[r] += gap + "...";
        return;
      }
      const key = keys[n++ % keys.length];
      for (let r = 0; r < 7; r++) rows[r] += gap + glyph[r].replace(/#/g, key);
    });
    return rows;
  });
  const width = Math.max(1, ...rendered.map((r) => r[0].length));
  const out: string[] = [];
  rendered.forEach((rows, li) => {
    if (li > 0) out.push(".".repeat(width), ".".repeat(width));
    rows.forEach((row) => {
      const pad = width - row.length;
      const left = Math.floor(pad / 2);
      out.push(".".repeat(left) + row + ".".repeat(pad - left));
    });
  });
  return out;
}

/** Occupied cells of a pattern (centred) plus its one-cell kiss-cut backing. */
export function patternCells(pattern: PixelPattern) {
  const h = pattern.length;
  const w = Math.max(...pattern.map((r) => r.length));
  const cells: { x: number; y: number; key: string }[] = [];
  pattern.forEach((row, y) =>
    [...row].forEach((key, x) => {
      if (key !== "." && key !== " ") cells.push({ x: x - (w - 1) / 2, y: (h - 1) / 2 - y, key });
    })
  );
  const back = new Set<string>();
  cells.forEach(({ x, y }) => {
    for (let dx = -1; dx <= 1; dx++) for (let dy = -1; dy <= 1; dy++) back.add(`${x + dx},${y + dy}`);
  });
  return { cells, back: [...back].map((k) => k.split(",").map(Number) as [number, number]), w, h };
}
