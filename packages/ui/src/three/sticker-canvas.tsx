"use client";
import * as React from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { View } from "@react-three/drei";

/**
 * StickerCanvas — the ONE shared WebGL canvas for a page.
 * Browsers cap WebGL contexts (~16), so every <Sticker3D/> renders into this canvas
 * through drei <View/>, scissored to its own DOM box. Wrap your app (or layout) once:
 *
 *   <StickerCanvas>{children}</StickerCanvas>
 *
 * The canvas is fixed, transparent and pointer-events:none; events come from document.body.
 * It mounts after first paint (never blocks LCP) and stays off under reduced motion
 * when `respectReducedMotion` is true (3D stickers then show their static SVG fallback).
 */
const StickerCanvasContext = React.createContext<{ ready: boolean }>({ ready: false });
export const useStickerCanvas = () => React.useContext(StickerCanvasContext);

/**
 * The no-flicker handoff. Every 3D component shows a flat SVG stand-in until its own 3D
 * has actually been drawn, never just until the canvas exists (WebGL setup, shader
 * compiles and the first frame take a few frames, and a gap there is a visible blink).
 *
 *   const [painted, onPainted] = usePainted();
 *   <PatternSVG style={handoffStyle(painted)} />                  // DOM, under the canvas
 *   <View><PaintSignal onPainted={onPainted} />…</View>           // inside the 3D
 *
 * PaintSignal fires one frame after the 3D's first render, so stand-in and 3D overlap for
 * a frame instead of leaving a gap. The stand-in then fades out under the 3D.
 */
/**
 * True once the canvas is up AND the page this component lives on has painted. 3D setup
 * (views, materials, shader work) is heavy; doing it in the same render as a page swap
 * stalls the main thread and the new page paints late and half-drawn. So 3D mounts in
 * idle time after the page has painted and after the route-change slide (260ms) is done,
 * so the setup task never lands mid-animation. The stand-in covers the wait.
 */
export function useStickerCanvasReady() {
  const { ready } = useStickerCanvas();
  const [settled, setSettled] = React.useState(false);
  React.useEffect(() => {
    const w = window as Window & {
      requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };
    let idle = 0;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const raf = requestAnimationFrame(() => {
      timer = setTimeout(() => {
        if (w.requestIdleCallback) idle = w.requestIdleCallback(() => setSettled(true), { timeout: 300 });
        else setSettled(true);
      }, 300);
    });
    return () => {
      cancelAnimationFrame(raf);
      if (idle) w.cancelIdleCallback?.(idle);
      if (timer) clearTimeout(timer);
    };
  }, []);
  return ready && settled;
}

export function usePainted() {
  const [painted, setPainted] = React.useState(false);
  const onPainted = React.useCallback(() => setPainted(true), []);
  return [painted, onPainted] as const;
}

export function PaintSignal({ onPainted }: { onPainted: () => void }) {
  const done = React.useRef(false);
  useFrame(() => {
    if (done.current) return;
    done.current = true;
    // this frame renders right after the frame callbacks; reveal on the frame after that
    requestAnimationFrame(() => requestAnimationFrame(onPainted));
  });
  return null;
}

/** Style for a stand-in: fully there until the 3D has painted, then a 160ms fade under it. */
export function handoffStyle(painted: boolean): React.CSSProperties {
  return { opacity: painted ? 0 : 1, transition: "opacity 160ms ease-out", pointerEvents: "none" };
}

export interface StickerCanvasProps {
  children: React.ReactNode;
  respectReducedMotion?: boolean;
}

export function StickerCanvas({ children, respectReducedMotion = false }: StickerCanvasProps) {
  const [ready, setReady] = React.useState(false);
  const [eventSource, setEventSource] = React.useState<HTMLElement | null>(null);

  React.useEffect(() => {
    if (respectReducedMotion && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const start = () => {
      setEventSource(document.body);
      setReady(true);
    };
    const w = window as Window & { requestIdleCallback?: (cb: () => void) => number };
    if (w.requestIdleCallback) w.requestIdleCallback(start);
    else setTimeout(start, 1);
  }, [respectReducedMotion]);

  const canvas = ready && eventSource && (
        <Canvas
          eventSource={eventSource}
          eventPrefix="client"
          flat
          dpr={[1, 2]}
          gl={{ antialias: true, alpha: true }}
          style={{ position: "fixed", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 30 }}
          aria-hidden
        >
          <View.Port />
        </Canvas>
  );

  return (
    <StickerCanvasContext.Provider value={{ ready }}>
      {children}
      {canvas}
    </StickerCanvasContext.Provider>
  );
}
