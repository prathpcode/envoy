"use client";
import * as React from "react";
import { cn, seededUnit, useChanged } from "../lib/utils";

/**
 * Countdown — a big D:H:M:S readout. Each unit is a crooked paper sticker with extrabold
 * tabular numbers that flips over (rotateX) when its number changes. When the clock runs out
 * the `ended` slot lands in place of the units.
 *
 *   <Countdown to={deadline} onComplete={() => setLocked(true)} />
 */
export interface CountdownProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  /** The deadline: a Date, a timestamp in ms, or an ISO string. */
  to: Date | number | string;
  /** Shown once the deadline has passed. */
  ended?: React.ReactNode;
  /** Fires once, when the clock reaches zero while mounted. */
  onComplete?: () => void;
  /** Hide the days sticker (for countdowns under 24h). */
  hideDays?: boolean;
}

const UNITS = [
  { key: "d", label: "days", ms: 86_400_000 },
  { key: "h", label: "hours", ms: 3_600_000 },
  { key: "m", label: "min", ms: 60_000 },
  { key: "s", label: "sec", ms: 1000 },
] as const;

function split(left: number) {
  const d = Math.floor(left / 86_400_000);
  const h = Math.floor((left % 86_400_000) / 3_600_000);
  const m = Math.floor((left % 3_600_000) / 60_000);
  const s = Math.floor((left % 60_000) / 1000);
  return { d, h, m, s };
}

export const Countdown = React.forwardRef<HTMLDivElement, CountdownProps>(
  ({ to, ended = "Time's up", onComplete, hideDays = false, className, ...props }, ref) => {
    const target = React.useMemo(() => new Date(to).getTime(), [to]);
    // null until mounted: the server can't know "now", so it renders placeholders
    const [now, setNow] = React.useState<number | null>(null);
    const done = React.useRef<boolean | null>(null);
    const onCompleteRef = React.useRef(onComplete);
    onCompleteRef.current = onComplete;

    React.useEffect(() => {
      let timer: number;
      const tick = () => {
        const t = Date.now();
        setNow(t);
        timer = window.setTimeout(tick, 1000 - (t % 1000) + 8);
      };
      tick();
      return () => window.clearTimeout(timer);
    }, []);

    const left = now === null ? null : Math.max(0, target - now);
    const isOver = left === 0;
    const endedLive = useChanged(isOver); // already over on load: the sticker is just there

    React.useEffect(() => {
      if (left === null) return;
      if (done.current === false && isOver) onCompleteRef.current?.();
      done.current = isOver;
    }, [left, isOver]);

    const parts = left === null ? null : split(left);
    const units = UNITS.filter((u) => !(hideDays && u.key === "d"));
    const spoken =
      parts && !isOver
        ? `${hideDays ? "" : `${parts.d} days, `}${parts.h} hours, ${parts.m} minutes left`
        : isOver
          ? typeof ended === "string"
            ? ended
            : "Time's up"
          : "";

    return (
      <div
        ref={ref}
        role="timer"
        data-slot="countdown"
        data-state={isOver ? "ended" : "running"}
        className={cn("flex flex-wrap items-start justify-center gap-2 sm:gap-4", className)}
        {...props}
      >
        <span className="sr-only">{spoken}</span>
        {isOver ? (
          <div
            data-slot="countdown-ended"
            aria-hidden
            className={cn("sticker sticker-lg face-ink px-8 py-5 text-4xl font-extrabold tracking-[-0.02em] sm:text-5xl", endedLive && "animate-land")}
          >
            {ended}
          </div>
        ) : (
          units.map((u, i) => (
            <React.Fragment key={u.key}>
              {i > 0 && <Colon />}
              <CountdownUnit
                value={parts ? parts[u.key] : null}
                label={u.label}
                tilt={Math.round(seededUnit(`countdown-${u.key}`) * 25) / 10}
              />
            </React.Fragment>
          ))
        )}
      </div>
    );
  }
);
Countdown.displayName = "Countdown";

function Colon() {
  return (
    <span aria-hidden className="flex h-20 flex-col justify-center gap-3 sm:h-28">
      <span className="size-2 bg-on-lid" />
      <span className="size-2 bg-on-lid" />
    </span>
  );
}

/** One unit: a crooked paper sticker that flips when its number changes. */
function CountdownUnit({ value, label, tilt }: { value: number | null; label: string; tilt: number }) {
  const text = value === null ? "--" : String(value).padStart(2, "0");
  const prev = React.useRef(text);
  const [flip, setFlip] = React.useState<{ n: number; from: string } | null>(null);

  React.useEffect(() => {
    if (prev.current !== text && prev.current !== "--") setFlip((f) => ({ n: (f?.n ?? 0) + 1, from: prev.current }));
    prev.current = text;
  }, [text]);

  return (
    <div aria-hidden data-slot="countdown-unit" className="flex flex-col items-center gap-3">
      <div className="crooked [perspective:600px]" style={{ ["--p3d-tilt" as string]: `${tilt}deg` }}>
        <div
          key={flip?.n ?? 0}
          className={cn(
            "sticker sticker-lg face-paper grid h-20 min-w-20 place-items-center px-3 sm:h-28 sm:min-w-28 sm:px-4 [transform-style:preserve-3d]",
            flip && "animate-flip"
          )}
        >
          <span
            className={cn(
              "col-start-1 row-start-1 text-5xl font-extrabold leading-none tracking-[-0.04em] tabular-nums sm:text-7xl",
              flip && "animate-flip-new"
            )}
          >
            {text}
          </span>
          {flip && (
            <span className="animate-flip-old col-start-1 row-start-1 text-5xl font-extrabold leading-none tracking-[-0.04em] tabular-nums sm:text-7xl">
              {flip.from}
            </span>
          )}
        </div>
      </div>
      <span className="text-base font-bold text-on-lid-soft">{label}</span>
    </div>
  );
}
