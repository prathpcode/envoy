"use client";
import * as React from "react";
// the same pixel people the map draws, so the roster and the campus always match
import { traits, drawChar, FOOT } from "@/public/map/chars.js";

type View = "front" | "back" | "side";

export function CharAvatar({ name, cell = 3, walk = false, turn = false, className = "", label }: {
  name: string; cell?: number; walk?: boolean; turn?: boolean; className?: string; label?: string;
}) {
  const ref = React.useRef<HTMLCanvasElement>(null);
  React.useEffect(() => {
    const ctx = ref.current?.getContext("2d");
    if (!ctx) return;
    const t = traits(name);
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const views: [View, boolean][] = [["front", false], ["side", false], ["back", false], ["side", true]];
    let raf = 0, last = "";
    const tick = (now: number) => {
      const frame = walk && !reduce ? Math.floor(now / 125) % 4 : -1;
      const [view, flip] = turn && !reduce ? views[Math.floor(now / 2000) % 4] : (["front", false] as [View, boolean]);
      const blink = frame === -1 && (now / 1000) % 3.4 < 0.14;
      const key = `${frame}|${view}|${flip}|${blink}`;
      if (key !== last) { drawChar(ctx, t, { view, flip, frame, blink }, cell); last = key; }
      if (walk || turn || !reduce) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [name, cell, walk, turn]);

  return (
    <span className={`sticker face-paper inline-flex shrink-0 items-end justify-center px-1 pt-1 ${className}`} role="img" aria-label={label ?? `${name}'s character`}>
      <canvas ref={ref} width={FOOT.w * cell} height={FOOT.h * cell} style={{ imageRendering: "pixelated", width: FOOT.w * cell, height: FOOT.h * cell }} />
    </span>
  );
}
