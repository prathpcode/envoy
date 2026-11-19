"use client";
import * as React from "react";
import { Trophy } from "pixelarticons/react";
import { cn } from "../lib/utils";

/**
 * Leaderboard — ranked rows of straight paper stickers. The leader's rank sticker is lime
 * (chosen) and the top three carry a pixel trophy; score bars are pixel blocks. When the order
 * changes, rows slide to their new place (FLIP) instead of jumping.
 *
 *   <Leaderboard entries={[{ id: "a", name: "Null Pointers", score: 920 }]} />
 */
export interface LeaderboardEntry {
  id: string;
  name: string;
  score: number;
  /** Any avatar node, e.g. <PixelAvatar name="Null Pointers" size="sm" />. */
  avatar?: React.ReactNode;
}

export interface LeaderboardProps extends Omit<React.HTMLAttributes<HTMLOListElement>, "children"> {
  entries: LeaderboardEntry[];
  /** Score that fills the bar. Defaults to the top score. */
  max?: number;
  /** Number of pixel blocks in each score bar. */
  blocks?: number;
  /** Format the visible score. */
  formatScore?: (score: number) => React.ReactNode;
}

// One Job: rank is not an ink's job. Only the leader wears lime (chosen/success);
// the rest of the podium keeps the pixel trophy on paper.
const PODIUM = ["face-lime", "face-paper", "face-paper"] as const;

export const Leaderboard = React.forwardRef<HTMLOListElement, LeaderboardProps>(
  ({ entries, max, blocks = 16, formatScore = (s) => s.toLocaleString("en-US"), className, ...props }, ref) => {
    const ranked = React.useMemo(
      () => [...entries].sort((a, b) => b.score - a.score || a.name.localeCompare(b.name)),
      [entries]
    );
    const top = max ?? Math.max(1, ...ranked.map((e) => e.score));

    // FLIP: remember where each row was, then play the difference after the DOM moves.
    const rows = React.useRef(new Map<string, HTMLLIElement>());
    const tops = React.useRef(new Map<string, number>());
    const order = ranked.map((e) => e.id).join("|");

    React.useLayoutEffect(() => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const next = new Map<string, number>();
      rows.current.forEach((el, id) => {
        const y = el.offsetTop;
        next.set(id, y);
        const was = tops.current.get(id);
        if (was === undefined || was === y || reduce || typeof el.animate !== "function") return;
        el.animate(
          [{ transform: `translateY(${was - y}px)` }, { transform: "translateY(0)" }],
          { duration: 460, easing: "cubic-bezier(.3, 1.7, .5, 1)" }
        );
      });
      tops.current = next;
    }, [order]);

    return (
      <ol ref={ref} data-slot="leaderboard" className={cn("relative flex w-full flex-col gap-4", className)} {...props}>
        {ranked.map((e, i) => {
          const filled = Math.round((Math.max(0, e.score) / top) * blocks);
          return (
            <li
              key={e.id}
              ref={(el) => {
                if (el) rows.current.set(e.id, el);
                else rows.current.delete(e.id);
              }}
              data-slot="leaderboard-row"
              data-rank={i + 1}
              className="sticker face-paper flex min-h-16 items-center gap-4 py-2 pr-5 pl-2"
            >
              <span
                className={cn(
                  "sticker sticker-flat flex h-12 min-w-12 shrink-0 items-center justify-center gap-1 px-2 text-lg font-extrabold tabular-nums",
                  PODIUM[i] ?? "face-lid"
                )}
              >
                {i < 3 && <Trophy aria-hidden className="pixel-icon size-5" />}
                <span className="sr-only">Rank </span>
                {i + 1}
              </span>
              {e.avatar && <span className="flex shrink-0">{e.avatar}</span>}
              <span className="min-w-0 flex-1 truncate text-lg font-bold">{e.name}</span>
              <span aria-hidden className="hidden items-center gap-1 sm:flex">
                {Array.from({ length: blocks }, (_, b) => (
                  <span
                    key={b}
                    className={cn("h-4 w-2 transition-colors duration-150", b < filled ? "bg-ink" : "bg-[#e4e6ea]")}
                    style={{ transitionDelay: `${b * 15}ms`, transitionTimingFunction: "steps(1)" }}
                  />
                ))}
              </span>
              <span className="w-16 shrink-0 text-right text-lg font-extrabold tabular-nums">{formatScore(e.score)}</span>
            </li>
          );
        })}
      </ol>
    );
  }
);
Leaderboard.displayName = "Leaderboard";
