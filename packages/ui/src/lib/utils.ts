import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import * as React from "react";

/** Merge Tailwind classes (shadcn convention). */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Deterministic hash → number in [-1, 1]. */
export function seededUnit(seed: string) {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) h = Math.imul(h ^ seed.charCodeAt(i), 16777619);
  return ((h >>> 0) % 2001) / 1000 - 1;
}

export type Tilt = number | "auto" | false;

/**
 * The Crooked Rule: small standalone stickers rest tilted between -max° and +max°.
 * "auto" derives a stable angle from React's useId, so SSR and client agree.
 * Returns a style object carrying --p3d-tilt.
 */
export function useTilt(tilt: Tilt = "auto", max = 2.5): React.CSSProperties {
  const id = React.useId();
  if (tilt === false) return { ["--p3d-tilt" as string]: "0deg" };
  const deg = typeof tilt === "number" ? tilt : Math.round(seededUnit(id) * max * 10) / 10;
  return { ["--p3d-tilt" as string]: `${deg}deg` };
}


/**
 * True once `value` has changed since this component mounted. Gate "commit" animations
 * (land, slap, stamp) with it so nothing animates on first render: a preselected day, a
 * default radio or a finished step simply *is* there when the page loads. Motion answers
 * the user, never the page load.
 */
export function useChanged<T>(value: T) {
  const initial = React.useRef(value);
  const [changed, setChanged] = React.useState(false);
  if (!changed && !Object.is(value, initial.current)) setChanged(true);
  return changed;
}
