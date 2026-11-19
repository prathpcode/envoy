"use client";
import * as React from "react";
import { View, PerspectiveCamera } from "@react-three/drei";
import { cn } from "../lib/utils";
import { useStickerCanvasReady, usePainted, PaintSignal, handoffStyle } from "./sticker-canvas";
import { VoxelSticker } from "./voxel-sticker";
import { PatternSVG } from "./sticker-3d";
import { inkCycle, textToPattern } from "./patterns-extra";

/**
 * VoxelText — a word set in the built-in 5×7 pixel font, extruded into voxel cubes over one
 * white kiss-cut backing, each letter in the next ink. Peels toward you on hover.
 * Screen readers get the real text; the 3D (and its SVG fallback) is aria-hidden.
 *
 *   <VoxelText text="HACK" className="w-96" />
 *   <VoxelText text={"HACK\nTHE PIXEL"} />
 */
export interface VoxelTextProps extends React.HTMLAttributes<HTMLDivElement> {
  text: string;
  /** Inks the letters cycle through. Defaults to pink, sky, lime, butter, tomato. */
  colors?: readonly string[];
  /** "flutter" idles gently; "still" holds. Idle motion stops under reduced motion. */
  motion?: "flutter" | "still";
}

function useReducedMotion() {
  const [reduce, setReduce] = React.useState(false);
  React.useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduce(mq.matches);
    const on = () => setReduce(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return reduce;
}

const KEYS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
/** Room around the word so the peel never hits the view's edge (1 = tight). */
const FRAME = 1.35;
const FOV = 20;

export function VoxelText({ text, colors = inkCycle, motion = "flutter", className, style, ...props }: VoxelTextProps) {
  const ready = useStickerCanvasReady();
  const [hover, setHover] = React.useState(false);
  const [painted, onPainted] = usePainted();
  const reduce = useReducedMotion();
  const inks = colors.length ? colors : inkCycle;
  const keys = React.useMemo(() => inks.map((_, i) => KEYS[i % KEYS.length]), [inks]);
  const palette = React.useMemo(() => Object.fromEntries(keys.map((k, i) => [k, inks[i]])), [keys, inks]);
  const pattern = React.useMemo(() => textToPattern(text, keys), [text, keys]);
  const w = Math.max(...pattern.map((r) => r.length)) + 2;
  const h = pattern.length + 2;

  // VoxelSticker fits the larger side to 5.2 units; frame the camera on the word's height.
  const worldH = (h / Math.max(w, h)) * 5.2;
  const distance = (worldH * FRAME) / (2 * Math.tan((FOV * Math.PI) / 360));
  const inset = `${((1 - 1 / FRAME) / 2) * 100}%`;

  return (
    <div
      data-slot="voxel-text"
      className={cn("relative w-full", className)}
      style={{ aspectRatio: `${w} / ${h}`, ...style }}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
      {...props}
    >
      <span className="sr-only">{text.replace(/\n/g, " ")}</span>
      <div aria-hidden className="absolute inset-0">
        <div className="absolute rotate-[2.9deg]" style={{ inset, ...handoffStyle(painted) }}>
          <PatternSVG pattern={pattern} colors={palette} className="size-full" />
        </div>
        {ready && (
          <View className="absolute inset-0">
            <PaintSignal onPainted={onPainted} />
            <PerspectiveCamera makeDefault position={[0, 0, distance]} fov={FOV} />
            <hemisphereLight args={["#ffffff", "#8890a0", 1.6]} />
            <directionalLight position={[-4, 6, 8]} intensity={2.2} />
            <VoxelSticker pattern={pattern} colors={palette} motion={motion} peel={hover && !reduce ? 0.7 : 0} />
          </View>
        )}
      </div>
    </div>
  );
}
