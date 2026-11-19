"use client";
import * as React from "react";
import { createPortal } from "react-dom";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { View, PerspectiveCamera } from "@react-three/drei";
import { useStickerCanvas } from "./sticker-canvas";
import { patterns, defaultPalette, type PixelPattern } from "./patterns";
import { burstPatterns, inkCycle, patternCells } from "./patterns-extra";

/**
 * StickerBurst — a celebratory pop of small voxel stickers from a DOM element. They arc
 * with gravity, tumble in 3D and fade, drawn on the shared canvas through one full-viewport
 * <View/> that only exists while a burst is in flight. Bursts are for real milestones
 * (submitted, shipped, won), never an ordinary click. Under reduced motion nothing fires.
 *
 *   // once, inside <StickerCanvas>
 *   <StickerBurstHost />
 *
 *   const burst = useStickerBurst();
 *   <Button onClick={(e) => burst(e.currentTarget)}>Submit project</Button>
 */

export interface StickerBurstOptions {
  /** How many stickers pop. Default 18; clamped to 1–60. */
  count?: number;
  /** Sticker edge in px, before depth. Default 30. */
  size?: number;
}

export type StickerBurstTarget = Element | DOMRect | { x: number; y: number } | null | undefined;

interface Piece {
  pattern: PixelPattern;
  colors: Record<string, string>;
  v: [number, number, number];
  spin: [number, number, number];
  rot0: [number, number, number];
  size: number;
  life: number;
  delay: number;
}
interface Burst {
  id: number;
  x: number;
  y: number;
  born: number;
  pieces: Piece[];
}

/* ── the store: a tiny external store so any component can fire ── */
let bursts: Burst[] = [];
let nextId = 1;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());
const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};
const getBursts = () => bursts;
const NO_BURSTS: Burst[] = [];
const getServerBursts = () => NO_BURSTS;

const SHAPES: PixelPattern[] = [
  patterns.heart,
  patterns.star,
  patterns.bolt,
  patterns.check,
  burstPatterns.plus,
  burstPatterns.diamond,
  burstPatterns.spark,
  burstPatterns.block,
  burstPatterns.zap,
];
const rand = (a: number, b: number) => a + Math.random() * (b - a);
const pick = <T,>(xs: readonly T[]) => xs[Math.floor(Math.random() * xs.length)];

function makePiece(base: number): Piece {
  const pattern = pick(SHAPES);
  const ink = pick(inkCycle);
  const angle = Math.PI / 2 + rand(-0.85, 0.85);
  const speed = rand(620, 1180);
  return {
    pattern,
    colors: { p: ink, l: ink, s: ink, b: ink, t: ink },
    v: [Math.cos(angle) * speed, Math.sin(angle) * speed, rand(-160, 420)],
    spin: [rand(-8, 8), rand(-9, 9), rand(-5, 5)],
    rot0: [rand(-0.6, 0.6), rand(-0.6, 0.6), rand(-Math.PI, Math.PI)],
    size: base * rand(0.75, 1.3),
    life: rand(1.05, 1.6),
    delay: rand(0, 0.08),
  };
}

const isRect = (r: DOMRect | { x: number; y: number }): r is DOMRect => "width" in r && "height" in r;

function originOf(target: StickerBurstTarget): { x: number; y: number } {
  if (!target) return { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  const r: DOMRect | { x: number; y: number } = target instanceof Element ? target.getBoundingClientRect() : target;
  if (isRect(r)) return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; // a rect: its centre
  return { x: r.x, y: r.y }; // a point
}

/** Fire a burst imperatively (what the hook returns). No-op on the server and under reduced motion. */
export function fireStickerBurst(target?: StickerBurstTarget, { count = 18, size = 30 }: StickerBurstOptions = {}) {
  if (typeof window === "undefined") return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const { x, y } = originOf(target);
  const n = Math.max(1, Math.min(60, Math.round(count)));
  const burst: Burst = { id: nextId++, x, y, born: performance.now(), pieces: Array.from({ length: n }, () => makePiece(size)) };
  bursts = [...bursts, burst];
  emit();
  const ttl = Math.max(...burst.pieces.map((p) => p.life + p.delay)) * 1000 + 120;
  window.setTimeout(() => {
    bursts = bursts.filter((b) => b !== burst);
    emit();
  }, ttl);
}

/** Returns `burst(el, { count })`. Needs one <StickerBurstHost/> mounted inside <StickerCanvas>. */
export function useStickerBurst() {
  return React.useCallback((target?: StickerBurstTarget, options?: StickerBurstOptions) => fireStickerBurst(target, options), []);
}

/* only one host draws, however many are mounted */
let hostOwner: symbol | null = null;

/** Mount once (next to your app's <StickerCanvas> children). Renders nothing while idle. */
export function StickerBurstHost() {
  const { ready } = useStickerCanvas();
  const list = React.useSyncExternalStore(subscribe, getBursts, getServerBursts);
  const [owner, setOwner] = React.useState(false);

  React.useEffect(() => {
    const me = Symbol("burst-host");
    if (hostOwner === null) {
      hostOwner = me;
      setOwner(true);
    }
    return () => {
      if (hostOwner === me) hostOwner = null;
    };
  }, []);

  if (!ready || !owner || list.length === 0) return null;
  return createPortal(
    <View
      index={BURST_INDEX}
      className="pointer-events-none"
      style={{ position: "fixed", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}
    >
      <BurstScene bursts={list} />
    </View>,
    document.body
  );
}

/** Views render in index order; the burst draws last, over every other sticker. */
const BURST_INDEX = 20;
const FOV = 30;
const GRAVITY = 2300;

function BurstScene({ bursts }: { bursts: Burst[] }) {
  const cam = React.useRef<THREE.PerspectiveCamera>(null);
  // Other views share the depth buffer; start the burst from a clean one so nothing occludes it.
  useFrame(({ gl }) => gl.clearDepth(), BURST_INDEX - 0.5);
  // One world unit = one CSS px on the z=0 plane, origin at the viewport centre.
  useFrame(() => {
    const c = cam.current;
    if (!c) return;
    c.position.z = window.innerHeight / 2 / Math.tan((FOV * Math.PI) / 360);
  });
  return (
    <>
      <PerspectiveCamera ref={cam} makeDefault fov={FOV} near={1} far={20000} position={[0, 0, 1500]} />
      <hemisphereLight args={["#ffffff", "#8890a0", 1.6]} />
      <directionalLight position={[-400, 600, 800]} intensity={2.2} />
      {bursts.map((b) => (
        <BurstGroup key={b.id} burst={b} />
      ))}
    </>
  );
}

function BurstGroup({ burst }: { burst: Burst }) {
  const refs = React.useRef<(PieceHandle | null)[]>([]);
  useFrame(() => {
    const age = (performance.now() - burst.born) / 1000;
    const ox = burst.x - window.innerWidth / 2;
    const oy = window.innerHeight / 2 - burst.y;
    burst.pieces.forEach((p, i) => {
      const h = refs.current[i];
      if (!h) return;
      const t = Math.max(0, age - p.delay);
      const k = Math.min(1, t / p.life);
      h.group.position.set(ox + p.v[0] * t, oy + p.v[1] * t - 0.5 * GRAVITY * t * t, p.v[2] * t);
      h.group.rotation.set(p.rot0[0] + p.spin[0] * t, p.rot0[1] + p.spin[1] * t, p.rot0[2] + p.spin[2] * t);
      const pop = t < 0.12 ? 0.35 + 0.65 * (t / 0.12) : 1;
      const fade = k > 0.62 ? 1 - (k - 0.62) / 0.38 : 1;
      h.group.scale.setScalar(h.unit * pop * (0.55 + 0.45 * fade));
      h.group.visible = age >= p.delay && k < 1;
      h.front.opacity = fade;
      h.back.opacity = fade;
    });
  });
  return (
    <>
      {burst.pieces.map((p, i) => (
        <BurstPiece key={i} piece={p} ref={(h) => void (refs.current[i] = h)} />
      ))}
    </>
  );
}

interface PieceHandle {
  group: THREE.Group;
  front: THREE.MeshStandardMaterial;
  back: THREE.MeshStandardMaterial;
  unit: number;
}

const tmp = new THREE.Object3D();

const BurstPiece = React.forwardRef<PieceHandle, { piece: Piece }>(({ piece }, ref) => {
  const { cells, back, w, h } = React.useMemo(() => patternCells(piece.pattern), [piece.pattern]);
  const group = React.useRef<THREE.Group>(null);
  const front = React.useRef<THREE.InstancedMesh>(null);
  const backing = React.useRef<THREE.InstancedMesh>(null);
  const frontMat = React.useRef<THREE.MeshStandardMaterial>(null);
  const backMat = React.useRef<THREE.MeshStandardMaterial>(null);
  const unit = piece.size / (Math.max(w, h) + 2);

  React.useImperativeHandle(
    ref,
    () => ({ group: group.current!, front: frontMat.current!, back: backMat.current!, unit }),
    [unit]
  );

  React.useLayoutEffect(() => {
    const palette = { ...defaultPalette, ...piece.colors };
    const color = new THREE.Color();
    cells.forEach((c, i) => {
      tmp.position.set(c.x, c.y, 0.3);
      tmp.updateMatrix();
      front.current!.setMatrixAt(i, tmp.matrix);
      front.current!.setColorAt(i, color.set(palette[c.key] ?? "#ff3d8b"));
    });
    front.current!.instanceMatrix.needsUpdate = true;
    if (front.current!.instanceColor) front.current!.instanceColor.needsUpdate = true;
    back.forEach(([x, y], i) => {
      tmp.position.set(x, y, -0.06);
      tmp.updateMatrix();
      backing.current!.setMatrixAt(i, tmp.matrix);
    });
    backing.current!.instanceMatrix.needsUpdate = true;
  }, [cells, back, piece.colors]);

  return (
    <group ref={group} visible={false}>
      <instancedMesh ref={backing} args={[undefined, undefined, back.length]}>
        <boxGeometry args={[1, 1, 0.12]} />
        <meshStandardMaterial ref={backMat} color="#ffffff" roughness={0.55} transparent />
      </instancedMesh>
      <instancedMesh ref={front} args={[undefined, undefined, cells.length]}>
        <boxGeometry args={[0.98, 0.98, 0.6]} />
        <meshStandardMaterial ref={frontMat} roughness={0.32} metalness={0.02} transparent />
      </instancedMesh>
    </group>
  );
});
BurstPiece.displayName = "BurstPiece";
