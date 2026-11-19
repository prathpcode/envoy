"use client";
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn, useTilt, type Tilt } from "../lib/utils";
import { Sticker3D } from "../three/sticker-3d";
import { defaultPalette } from "../three/patterns";

/**
 * PixelAvatar — a deterministic, symmetric 8×8 pixel sprite (identicon-style) generated from a
 * name in the vinyl inks, printed on a crooked paper sticker. Same name, same sprite, always.
 * `three` renders the sprite as a real voxel sticker on the shared canvas instead.
 *
 *   <PixelAvatar name="Ada" />
 *   <PixelAvatar name="Ada" size="lg" three />
 */
export const pixelAvatarVariants = cva("sticker face-paper crooked inline-flex shrink-0 items-center justify-center", {
  variants: {
    size: {
      sm: "size-10 p-1",
      md: "size-14 p-1.5",
      lg: "size-20 p-2",
    },
  },
  defaultVariants: { size: "md" },
});

const threeSizes = { sm: "size-12", md: "size-20", lg: "size-32" } as const;

export interface PixelAvatarProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, "children">,
    VariantProps<typeof pixelAvatarVariants> {
  name: string;
  /** Resting angle. "auto" (default) picks a stable crooked angle; false = straight. */
  tilt?: Tilt;
  /** Render as a three.js voxel sticker (needs <StickerCanvas>). */
  three?: boolean;
}

const INK_KEYS = ["p", "s", "l", "b", "t"] as const;

function hash(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return h >>> 0;
}
function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** The 8×8 sprite for a name, as pattern rows (keys map to the default ink palette). */
export function pixelAvatarPattern(name: string): string[] {
  const seed = hash(name.trim().toLowerCase() || "?");
  const rnd = mulberry32(seed);
  const mi = seed % INK_KEYS.length;
  const main = INK_KEYS[mi];
  const accentKey = INK_KEYS[(mi + 1 + ((seed >>> 8) % (INK_KEYS.length - 1))) % INK_KEYS.length];
  for (let attempt = 0; attempt < 8; attempt++) {
    const rows: string[] = [];
    let filled = 0;
    for (let y = 0; y < 8; y++) {
      let half = "";
      for (let x = 0; x < 4; x++) {
        const r = rnd();
        // denser towards the middle columns so sprites read as a body, not noise
        const p = x === 0 ? 0.38 : 0.58;
        const k = r < p ? main : r < p + 0.12 ? accentKey : r < p + 0.17 ? "k" : ".";
        if (k !== ".") filled++;
        half += k;
      }
      rows.push(half + [...half].reverse().join(""));
    }
    if (filled >= 12 && filled <= 26) return rows;
  }
  return ["..pppp..", ".pppppp.", "pp.pp.pp", "pppppppp", "pppppppp", ".pp..pp.", "pp....pp", "p......p"].map((r) =>
    r.replace(/p/g, main)
  );
}

export const PixelAvatar = React.forwardRef<HTMLSpanElement, PixelAvatarProps>(
  ({ name, size, tilt = "auto", three = false, className, style, ...props }, ref) => {
    const tiltStyle = useTilt(tilt);
    const pattern = React.useMemo(() => pixelAvatarPattern(name), [name]);
    if (three) {
      return (
        <span ref={ref} data-slot="pixel-avatar" className={cn("inline-flex shrink-0", className)} style={style} {...props}>
          <Sticker3D pattern={pattern} label={name} className={threeSizes[size ?? "md"]} />
        </span>
      );
    }
    return (
      <span
        ref={ref}
        role="img"
        aria-label={name}
        data-slot="pixel-avatar"
        className={cn(pixelAvatarVariants({ size }), className)}
        style={{ ...tiltStyle, ...style }}
        {...props}
      >
        <svg viewBox="0 0 8 8" className="pixel-icon size-full" aria-hidden>
          {pattern.map((row, y) =>
            [...row].map((k, x) =>
              k === "." ? null : <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill={defaultPalette[k]} />
            )
          )}
        </svg>
      </span>
    );
  }
);
PixelAvatar.displayName = "PixelAvatar";
