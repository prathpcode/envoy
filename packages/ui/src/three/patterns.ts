/**
 * Pixel patterns for voxel stickers. Each row is a string; characters map to palette keys:
 *   "." = empty, any other char = a key in the palette passed to <Sticker3D colors={...}/>.
 * Defaults use: p = pink, l = lime, s = sky, b = butter, t = tomato, k = ink, w = paper.
 */
export type PixelPattern = readonly string[];

export const patterns = {
  heart: [
    ".pp.pp.",
    "ppppppp",
    "ppppppp",
    ".ppppp.",
    "..ppp..",
    "...p...",
  ],
  star: [
    "...b...",
    "..bbb..",
    "bbbbbbb",
    ".bbbbb.",
    ".bb.bb.",
    "bb...bb",
  ],
  bolt: [
    "...ss",
    "..ss.",
    ".ssss",
    "ssss.",
    "..ss.",
    ".ss..",
    "ss...",
  ],
  trophy: [
    "bbbbbbb",
    "b.bbb.b",
    ".bbbbb.",
    "..bbb..",
    "...b...",
    "..kkk..",
    ".kkkkk.",
  ],
  rocket: [
    "...w...",
    "..www..",
    "..wsw..",
    "..www..",
    ".wwwww.",
    "tw.w.wt",
    "...t...",
  ],
  coffee: [
    ".k.k...",
    "..k.k..",
    "wwwwww.",
    "wttttww",
    "wttttw.",
    ".wwww..",
  ],
  ghost: [
    "..lll..",
    ".lllll.",
    "lkllkll",
    "lllllll",
    "lllllll",
    "l.l.l.l",
  ],
  check: [
    "......l",
    ".....ll",
    "l...ll.",
    "ll.ll..",
    ".lll...",
    "..l....",
  ],
  pixel: [
    "pps",
    "plb",
    "sbt",
  ],
} as const satisfies Record<string, PixelPattern>;

export type PatternName = keyof typeof patterns;

export const defaultPalette: Record<string, string> = {
  p: "#ff3d8b",
  l: "#b6f23a",
  s: "#36b8ff",
  b: "#ffd23f",
  t: "#ff5a36",
  k: "#141414",
  w: "#ffffff",
};
