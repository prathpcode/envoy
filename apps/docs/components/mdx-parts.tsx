import * as React from "react";
import Link from "next/link";
import { cn } from "@pixel3d/ui";

/** A live example on the lid, inside guide prose. Not a card: a stage. */
export function Stage({ children, className, tall }: { children: React.ReactNode; className?: string; tall?: boolean }) {
  return (
    <div
      className={cn(
        "not-prose my-8 flex w-full flex-wrap items-center justify-center gap-8 bg-lid-deep/55 p-10",
        tall ? "min-h-[360px]" : "min-h-[220px]",
        className
      )}
    >
      {children}
    </div>
  );
}

/** A named rule from DESIGN.md: one ink sticker heading + the doctrine. */
export function Rule({ name, children }: { name: string; children: React.ReactNode }) {
  return (
    <div className="not-prose my-8 flex flex-col gap-4">
      <span className="sticker face-butter crooked self-start px-4 py-2 text-lg font-extrabold [--p3d-tilt:-1.5deg]">
        The {name} Rule
      </span>
      <div className="max-w-[58ch] text-[19px] leading-relaxed font-medium text-pretty">{children}</div>
    </div>
  );
}

/** Side-by-side do / don't with live renders. */
export function DoDont({ good, bad, goodNote, badNote }: { good: React.ReactNode; bad: React.ReactNode; goodNote: string; badNote: string }) {
  return (
    <div className="not-prose my-8 grid gap-8 md:grid-cols-2">
      <figure className="flex flex-col gap-4">
        <div className="flex min-h-[200px] flex-wrap items-center justify-center gap-6 bg-lid-deep/55 p-8">{good}</div>
        <figcaption className="flex items-start gap-3 text-[17px] font-semibold">
          <span className="sticker face-lime shrink-0 px-2.5 py-1 text-sm font-extrabold">Do</span>
          {goodNote}
        </figcaption>
      </figure>
      <figure className="flex flex-col gap-4">
        <div className="flex min-h-[200px] flex-wrap items-center justify-center gap-6 bg-lid-deep/55 p-8">{bad}</div>
        <figcaption className="flex items-start gap-3 text-[17px] font-semibold">
          <span className="sticker face-tomato shrink-0 px-2.5 py-1 text-sm font-extrabold">Don’t</span>
          {badNote}
        </figcaption>
      </figure>
    </div>
  );
}

/** Colour swatch sticker: name + hex + job. */
export function Swatch({ name, hex, job, face }: { name: string; hex: string; job: string; face: string }) {
  return (
    <div className="flex flex-col gap-3">
      <div className={cn("sticker sticker-lg crooked h-28 w-44", face)} style={{ ["--p3d-tilt" as string]: `${(hex.charCodeAt(2) % 5) - 2}deg` }} />
      <div className="flex flex-col">
        <span className="text-lg font-extrabold">{name}</span>
        <span className="font-mono text-[15px] text-on-lid-soft">{hex}</span>
        <span className="text-[16px] text-on-lid-soft">{job}</span>
      </div>
    </div>
  );
}

/** Next-page link at the bottom of a guide. */
export function NextPage({ href, title }: { href: string; title: string }) {
  return (
    <div className="not-prose mt-20 mb-24 flex justify-end">
      <Link
        href={href}
        className="sticker sticker-lg face-paper peel focus-cut flex items-center gap-4 px-7 py-5 text-xl font-extrabold [--p3d-tilt:1.5deg]"
      >
        Next: {title}
        <svg viewBox="0 0 7 5" width="21" height="15" className="pixel-icon" aria-hidden fill="currentColor">
          <rect x="3" y="0" width="1" height="1" /><rect x="4" y="1" width="1" height="1" /><rect x="0" y="2" width="6" height="1" />
          <rect x="4" y="3" width="1" height="1" /><rect x="3" y="4" width="1" height="1" />
        </svg>
      </Link>
    </div>
  );
}
