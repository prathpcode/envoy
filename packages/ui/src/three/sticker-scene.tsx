"use client";
import * as React from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { View, PerspectiveCamera } from "@react-three/drei";
import { cn, seededUnit } from "../lib/utils";
import { useStickerCanvasReady, usePainted, PaintSignal, handoffStyle } from "./sticker-canvas";
import { VoxelSticker } from "./voxel-sticker";
import { PatternSVG } from "./sticker-3d";
import { patterns, type PatternName, type PixelPattern } from "./patterns";

/**
 * StickerScene — the landing-page showpiece: a hero-sized view where a loose cluster of voxel
 * stickers floats at different depths, drifts, parallaxes toward the pointer and peels when
 * hovered. Children sit in the clear middle (the stickers keep out of their way).
 * Before the shared canvas is ready it shows the same cluster as flat SVG stickers.
 *
 *   <StickerScene className="h-[520px]">
 *     <h1>Hack the pixel</h1>
 *   </StickerScene>
 */
export type SceneSticker =
  | PatternName
  | PixelPattern
  | { pattern: PatternName | PixelPattern; colors?: Record<string, string> };

export interface StickerSceneProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Patterns to scatter; they repeat to fill `density`. Defaults to the built-in set. */
  stickers?: readonly SceneSticker[];
  /** How many stickers float in the cluster. Default 14 (1–40). */
  density?: number;
  /** Accessible name for the decorative scene. Omit to hide it from screen readers. */
  label?: string;
}

const DEFAULT_STICKERS: PatternName[] = ["heart", "star", "bolt", "trophy", "rocket", "coffee", "ghost", "check", "pixel"];
const CAM_Z = 14;
const FOV = 35;
const TAN = Math.tan((FOV * Math.PI) / 360);
/** Round for SSR-stable inline styles. */
const r2 = (n: number) => Math.round(n * 100) / 100;

interface Placed {
  pattern: PixelPattern;
  colors?: Record<string, string>;
  nx: number;
  ny: number;
  z: number;
  scale: number;
  phase: number;
  tilt: number;
}

function resolve(s: SceneSticker): { pattern: PixelPattern; colors?: Record<string, string> } {
  if (typeof s === "string") return { pattern: patterns[s as PatternName] };
  if (Array.isArray(s)) return { pattern: s as PixelPattern };
  const o = s as { pattern: PatternName | PixelPattern; colors?: Record<string, string> };
  return { pattern: typeof o.pattern === "string" ? patterns[o.pattern as PatternName] : o.pattern, colors: o.colors };
}

/** A deterministic loose cluster: a jittered sunflower spiral, kept out of the centre when there's content. */
function layout(stickers: readonly SceneSticker[], n: number, clearCentre: boolean): Placed[] {
  const out: Placed[] = [];
  for (let i = 0; i < n; i++) {
    const u = (k: string) => seededUnit(`scene-${i}-${k}`);
    const base = Math.sqrt((i + 0.5) / n);
    const r = clearCentre ? 0.74 + 0.26 * base : 0.12 + 0.88 * base;
    const a = i * 2.39996 + u("a") * 0.5;
    const z = -6 + (u("z") + 1) * 3.2; // -6 … 0.4
    out.push({
      ...resolve(stickers[i % stickers.length]),
      nx: Math.cos(a) * Math.min(1, r + u("r") * 0.06),
      ny: Math.sin(a) * Math.min(1, r + u("r2") * 0.06),
      z,
      scale: 0.24 + (u("s") + 1) * 0.06,
      phase: (u("p") + 1) * Math.PI,
      tilt: u("t") * 0.35,
    });
  }
  return out.sort((p, q) => p.z - q.z);
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

export function StickerScene({
  stickers = DEFAULT_STICKERS,
  density = 14,
  label,
  className,
  children,
  ...props
}: StickerSceneProps) {
  const ready = useStickerCanvasReady();
  const [painted, onPainted] = usePainted();
  const reduce = useReducedMotion();
  const box = React.useRef<HTMLDivElement>(null);
  const n = Math.max(1, Math.min(40, Math.round(density)));
  const hasContent = React.Children.count(children) > 0;
  const placed = React.useMemo(
    () => layout(stickers.length ? stickers : DEFAULT_STICKERS, n, hasContent),
    [stickers, n, hasContent]
  );

  return (
    <div
      ref={box}
      data-slot="sticker-scene"
      className={cn("relative h-[480px] w-full", className)}
      {...props}
    >
      <div
        className="absolute inset-0"
        role={label ? "img" : undefined}
        aria-label={label}
        aria-hidden={label ? undefined : true}
      >
        {/* flat stand-ins, same placement as the 3D, until the 3D has painted */}
        <div aria-hidden className="absolute inset-0" style={handoffStyle(painted)}>
          {placed.map((p, i) => {
            const size = ((5.2 * p.scale) / (2 * (CAM_Z - p.z) * TAN)) * 100;
            return (
              <div
                key={i}
                className="absolute aspect-square"
                style={{
                  left: `${r2(50 + p.nx * 45)}%`,
                  top: `${r2(50 - p.ny * 42)}%`,
                  height: `${r2(size)}%`,
                  transform: `translate(-50%, -50%) rotate(${r2((-p.tilt * 180) / Math.PI)}deg)`,
                }}
              >
                <PatternSVG pattern={p.pattern} colors={p.colors} className="size-full" />
              </div>
            );
          })}
        </div>
        {ready && (
          <View className="pointer-events-none absolute inset-0">
            <PaintSignal onPainted={onPainted} />
            <SceneContent placed={placed} box={box} reduce={reduce} />
          </View>
        )}
      </div>
      {hasContent && <div className="relative z-10 flex size-full items-center justify-center">{children}</div>}
    </div>
  );
}

const v3 = new THREE.Vector3();

function SceneContent({
  placed,
  box,
  reduce,
}: {
  placed: Placed[];
  box: React.RefObject<HTMLDivElement | null>;
  reduce: boolean;
}) {
  const groups = React.useRef<(THREE.Group | null)[]>([]);
  const cam = React.useRef<THREE.PerspectiveCamera>(null);
  const pointer = React.useRef<{ x: number; y: number } | null>(null);
  const [hovered, setHovered] = React.useState(-1);
  const hoveredRef = React.useRef(-1);

  React.useEffect(() => {
    const move = (e: PointerEvent) => void (pointer.current = { x: e.clientX, y: e.clientY });
    const leave = () => void (pointer.current = null);
    window.addEventListener("pointermove", move, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    return () => {
      window.removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("pointerleave", leave);
    };
  }, []);

  useFrame((state, dt) => {
    const el = box.current;
    const c = cam.current;
    if (!el || !c) return;
    const rect = el.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;
    const aspect = rect.width / rect.height;
    const t = state.clock.elapsedTime;

    // pointer in the view's NDC, or null when it's outside the hero
    let px = 0;
    let py = 0;
    let inside = false;
    const p = pointer.current;
    if (p && p.x >= rect.left && p.x <= rect.right && p.y >= rect.top && p.y <= rect.bottom) {
      inside = true;
      px = ((p.x - rect.left) / rect.width) * 2 - 1;
      py = -(((p.y - rect.top) / rect.height) * 2 - 1);
    }

    // parallax: the camera leans toward the pointer, so near stickers slide further than far ones
    const tx = inside && !reduce ? px * 1.3 : 0;
    const ty = inside && !reduce ? py * 0.9 : 0;
    c.position.x = THREE.MathUtils.damp(c.position.x, tx, 3, dt);
    c.position.y = THREE.MathUtils.damp(c.position.y, ty, 3, dt);
    c.lookAt(0, 0, 0);

    let hit = -1;
    let hitZ = -Infinity;
    placed.forEach((s, i) => {
      const g = groups.current[i];
      if (!g) return;
      const halfH = (CAM_Z - s.z) * TAN;
      const drift = reduce ? 0 : 1;
      g.position.set(
        s.nx * halfH * aspect * 0.9 + drift * Math.sin(t * 0.35 + s.phase) * 0.22,
        s.ny * halfH * 0.84 + drift * Math.cos(t * 0.42 + s.phase * 1.3) * 0.26,
        s.z
      );
      g.rotation.z = s.tilt + drift * Math.sin(t * 0.25 + s.phase) * 0.08;
      if (!inside || reduce) return;
      v3.copy(g.position).project(c);
      const radius = (2.6 * s.scale * 0.85) / ((CAM_Z - s.z) * TAN);
      const dx = (v3.x - px) * aspect;
      const dy = v3.y - py;
      if (dx * dx + dy * dy < radius * radius && s.z > hitZ) {
        hit = i;
        hitZ = s.z;
      }
    });
    if (hit !== hoveredRef.current) {
      hoveredRef.current = hit;
      setHovered(hit);
    }
  });

  return (
    <>
      <PerspectiveCamera ref={cam} makeDefault position={[0, 0, CAM_Z]} fov={FOV} />
      <hemisphereLight args={["#ffffff", "#8890a0", 1.6]} />
      <directionalLight position={[-4, 6, 8]} intensity={2.2} />
      {placed.map((s, i) => (
        <group key={i} ref={(g) => void (groups.current[i] = g)} scale={s.scale}>
          <VoxelSticker
            pattern={s.pattern}
            colors={s.colors}
            motion={reduce ? "still" : "flutter"}
            peel={hovered === i ? 1 : 0}
          />
        </group>
      ))}
    </>
  );
}
