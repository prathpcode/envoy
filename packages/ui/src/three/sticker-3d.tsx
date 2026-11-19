"use client";
import * as React from "react";
import { View, PerspectiveCamera } from "@react-three/drei";
import { cn } from "../lib/utils";
import { useStickerCanvasReady, usePainted, PaintSignal, handoffStyle } from "./sticker-canvas";
import { VoxelSticker } from "./voxel-sticker";
import { patterns, defaultPalette, type PatternName, type PixelPattern } from "./patterns";

/**
 * Sticker3D — a real three.js voxel sticker that sits in normal page layout.
 * It peels toward you on hover. Requires <StickerCanvas> somewhere above it.
 * Until its 3D has actually been drawn (or with WebGL off) it shows a crisp SVG of the same
 * pattern at the same size and tilt, so the handoff never blinks.
 *
 *   <Sticker3D pattern="heart" className="size-48" />
 *   <Sticker3D pattern={["pp.", ".pp"]} colors={{ p: "#36b8ff" }} motion="spin" />
 */
export interface Sticker3DProps extends React.HTMLAttributes<HTMLDivElement> {
  pattern: PatternName | PixelPattern;
  colors?: Record<string, string>;
  motion?: "flutter" | "spin" | "still";
  label?: string;
}

export function Sticker3D({ pattern, colors, motion = "flutter", label, className, ...props }: Sticker3DProps) {
  const ready = useStickerCanvasReady();
  const grid = typeof pattern === "string" ? patterns[pattern] : pattern;
  const [hover, setHover] = React.useState(false);
  const [painted, onPainted] = usePainted();
  return (
    <div
      role="img"
      aria-label={label ?? (typeof pattern === "string" ? `${pattern} sticker` : "pixel sticker")}
      className={cn("relative aspect-square", className)}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
      {...props}
    >
      {/* the 3D spans 5.2 of the camera's 5.735 visible units (91%) and rests at -2.9° */}
      <PatternSVG
        pattern={grid}
        colors={colors}
        className="absolute inset-[4.7%] rotate-[2.9deg]"
        style={handoffStyle(painted)}
      />
      {ready && (
        <View className="absolute inset-0">
          <PaintSignal onPainted={onPainted} />
          <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={32} />
          <hemisphereLight args={["#ffffff", "#8890a0", 1.6]} />
          <directionalLight position={[-4, 6, 8]} intensity={2.2} />
          <VoxelSticker pattern={grid} colors={colors} motion={motion} peel={hover ? 1 : 0} />
        </View>
      )}
    </div>
  );
}

/** The static, crisp SVG version of a pattern (fallback + usable on its own). */
export function PatternSVG({
  pattern,
  colors,
  className,
  style,
}: {
  pattern: PixelPattern;
  colors?: Record<string, string>;
  className?: string;
  style?: React.CSSProperties;
}) {
  const palette = { ...defaultPalette, ...colors };
  const w = Math.max(...pattern.map((r) => r.length));
  const h = pattern.length;
  return (
    <svg viewBox={`-1 -1 ${w + 2} ${h + 2}`} className={cn("pixel-icon", className)} style={style} aria-hidden>
      {pattern.map((row, y) =>
        [...row].map((k, x) =>
          k === "." || k === " " ? null : (
            <rect key={`b${x}-${y}`} x={x - 1} y={y - 1} width={3} height={3} fill="#fff" />
          )
        )
      )}
      {pattern.map((row, y) =>
        [...row].map((k, x) =>
          k === "." || k === " " ? null : <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill={palette[k] ?? "#ff3d8b"} />
        )
      )}
    </svg>
  );
}
