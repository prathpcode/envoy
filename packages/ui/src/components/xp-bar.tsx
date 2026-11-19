"use client";
import * as React from "react";
import { cn } from "../lib/utils";

/**
 * XPBar — a game-style XP / health / mana bar made of discrete 8px blocks (8×16 cells, 4px gaps) on a straight paper
 * sticker. Gaining value lands the new blocks one by one, in steps. Health shifts
 * lime → butter → tomato as it drops.
 *
 *   <XPBar value={340} max={500} level={7} label="Ada" />
 *   <XPBar variant="health" value={hp} max={100} label="Server uptime" />
 */
export interface XPBarProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  value: number;
  max?: number;
  /** Shown on an ink level sticker at the start. */
  level?: number;
  /** Names the bar (visible, and its accessible name). */
  label?: React.ReactNode;
  variant?: "xp" | "health" | "mana";
  /** How many blocks the bar is cut into. */
  blocks?: number;
  /** Hide the "value / max" readout. */
  hideValue?: boolean;
}

function fillFor(variant: NonNullable<XPBarProps["variant"]>, pct: number) {
  if (variant === "mana") return "bg-sky";
  if (variant === "health") return pct > 0.5 ? "bg-lime" : pct > 0.25 ? "bg-butter" : "bg-tomato";
  return "bg-lime";
}

const STAGGER = 55;

export const XPBar = React.forwardRef<HTMLDivElement, XPBarProps>(
  (
    { value, max = 100, level, label, variant = "xp", blocks = 30, hideValue = false, className, ...props },
    ref
  ) => {
    const safeMax = Math.max(1, max);
    const v = Math.min(safeMax, Math.max(0, value));
    const pct = v / safeMax;
    const filled = Math.round(pct * blocks);
    const labelId = React.useId();

    // blocks gained since the last render land one by one; lost blocks just go dark
    const prev = React.useRef<number | null>(null);
    const [landing, setLanding] = React.useState<{ from: number; gen: number } | null>(null);
    React.useLayoutEffect(() => {
      if (prev.current !== null && filled > prev.current) setLanding((l) => ({ from: prev.current ?? 0, gen: (l?.gen ?? 0) + 1 }));
      prev.current = filled;
    }, [filled]);

    const fill = fillFor(variant, pct);
    const unit = variant === "xp" ? " XP" : variant === "mana" ? " MP" : " HP";

    return (
      <div
        ref={ref}
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={safeMax}
        aria-valuenow={v}
        aria-valuetext={`${v} of ${safeMax}${unit}${level !== undefined ? `, level ${level}` : ""}`}
        aria-labelledby={label ? labelId : undefined}
        data-slot="xp-bar"
        data-variant={variant}
        className={cn("sticker face-paper inline-flex w-fit max-w-full flex-col gap-3 px-4 py-3", className)}
        {...props}
      >
        {(label || level !== undefined || !hideValue) && (
          <div className="flex items-center gap-3">
            {level !== undefined && (
              <span className="sticker sticker-flat face-ink inline-flex h-8 items-center px-2.5 text-sm font-extrabold tabular-nums">
                Lv {level}
              </span>
            )}
            {label && (
              <span id={labelId} className="min-w-0 flex-1 truncate text-base font-bold">
                {label}
              </span>
            )}
            {!hideValue && (
              <span className="ml-auto text-base font-extrabold tabular-nums">
                {v}
                <span className="text-ink-soft"> / {safeMax}</span>
              </span>
            )}
          </div>
        )}
        <div aria-hidden className="flex flex-wrap gap-1">
          {Array.from({ length: blocks }, (_, i) => {
            const on = i < filled;
            const lands = on && landing && i >= landing.from;
            return (
              <span key={i} className="h-4 w-2 shrink-0 bg-[#e4e6ea]">
                {on && (
                  <span
                    key={lands ? `l${landing.gen}` : "on"}
                    className={cn("block size-full transition-colors duration-150", fill, lands && "animate-block-in")}
                    style={lands ? { animationDelay: `${(i - landing.from) * STAGGER}ms` } : undefined}
                  />
                )}
              </span>
            );
          })}
        </div>
      </div>
    );
  }
);
XPBar.displayName = "XPBar";
