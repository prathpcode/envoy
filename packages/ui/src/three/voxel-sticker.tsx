"use client";
import * as React from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { defaultPalette, type PixelPattern } from "./patterns";

/**
 * VoxelSticker — a pixel pattern extruded into 3D cubes over a white kiss-cut backing
 * (the pattern dilated by one cell), so it reads as the same die-cut sticker as the DOM kit.
 * Use inside a drei <View/> (see <Sticker3D/>) or any R3F scene.
 */
export interface VoxelStickerProps {
  pattern: PixelPattern;
  colors?: Record<string, string>;
  /** "flutter" idles gently; "spin" turns slowly; "still" holds. */
  motion?: "flutter" | "spin" | "still";
  /** 0..1 — how far the sticker peels toward the viewer (drive from hover). */
  peel?: number;
  depth?: number;
}

function cellsOf(pattern: PixelPattern) {
  const h = pattern.length;
  const w = Math.max(...pattern.map((r) => r.length));
  const cells: { x: number; y: number; key: string }[] = [];
  pattern.forEach((row, y) =>
    [...row].forEach((key, x) => {
      if (key !== "." && key !== " ") cells.push({ x: x - (w - 1) / 2, y: (h - 1) / 2 - y, key });
    })
  );
  // kiss-cut backing: dilate occupied cells by one in 8 directions
  const occ = new Set(cells.map((c) => `${c.x},${c.y}`));
  const back = new Set<string>();
  cells.forEach(({ x, y }) => {
    for (let dx = -1; dx <= 1; dx++) for (let dy = -1; dy <= 1; dy++) back.add(`${x + dx},${y + dy}`);
  });
  return { cells, back: [...back].map((k) => k.split(",").map(Number) as [number, number]), w, h, occ };
}

const tmp = new THREE.Object3D();

export function VoxelSticker({ pattern, colors, motion = "flutter", peel = 0, depth = 0.55 }: VoxelStickerProps) {
  const palette = { ...defaultPalette, ...colors };
  const { cells, back, w, h } = React.useMemo(() => cellsOf(pattern), [pattern]);
  const group = React.useRef<THREE.Group>(null);
  const front = React.useRef<THREE.InstancedMesh>(null);
  const backing = React.useRef<THREE.InstancedMesh>(null);
  const reduce = React.useMemo(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    []
  );

  React.useLayoutEffect(() => {
    const color = new THREE.Color();
    cells.forEach((c, i) => {
      tmp.position.set(c.x, c.y, depth / 2);
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
  }, [cells, back, depth, palette]);

  const peelRef = React.useRef(0);
  useFrame((state, dt) => {
    const g = group.current;
    if (!g) return;
    const t = state.clock.elapsedTime;
    peelRef.current = THREE.MathUtils.damp(peelRef.current, peel, 8, dt);
    const p = peelRef.current;
    const idle = reduce || motion === "still" ? 0 : 1;
    const spin = motion === "spin" && !reduce ? t * 0.6 : 0;
    g.rotation.y = spin + idle * (motion === "flutter" ? Math.sin(t * 1.2) * 0.28 : 0) + p * -0.35;
    g.rotation.x = idle * (motion === "flutter" ? Math.sin(t * 1.7) * 0.12 : 0) - 0.12 + p * 0.45;
    g.rotation.z = -0.05 + p * 0.06;
    g.position.z = p * 1.2;
  });

  const scale = 1 / Math.max(w + 2, h + 2);
  return (
    <group ref={group} scale={scale * 5.2}>
      <instancedMesh ref={backing} args={[undefined, undefined, back.length]}>
        <boxGeometry args={[1, 1, 0.12]} />
        <meshStandardMaterial color="#ffffff" roughness={0.55} />
      </instancedMesh>
      <instancedMesh ref={front} args={[undefined, undefined, cells.length]}>
        <boxGeometry args={[0.98, 0.98, depth]} />
        <meshStandardMaterial roughness={0.32} metalness={0.02} />
      </instancedMesh>
    </group>
  );
}
