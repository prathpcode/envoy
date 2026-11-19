"use client";
import * as React from "react";
import { Group, Panel, Separator as ResizeSeparator } from "react-resizable-panels";
import { cn } from "../lib/utils";

/**
 * Resizable — panels split by a dotted pixel rule. `withHandle` adds a small ink grip
 * sticker that lifts on hover and slaps while dragging. Built on react-resizable-panels v4.
 */
export const ResizablePanelGroup = ({
  className,
  style,
  ...props
}: React.ComponentProps<typeof Group>) => (
  <Group
    data-slot="resizable-panel-group"
    className={cn("size-full", className)}
    // the grip sticker's kiss-cut and shadow sit slightly outside the separator
    style={{ overflow: "visible", ...style }}
    {...props}
  />
);
ResizablePanelGroup.displayName = "ResizablePanelGroup";

export const ResizablePanel = (props: React.ComponentProps<typeof Panel>) => (
  <Panel data-slot="resizable-panel" {...props} />
);
ResizablePanel.displayName = "ResizablePanel";

/** 2 × 3 pixel grip dots */
function GripDots({ vertical }: { vertical: boolean }) {
  const dots = [0, 1, 2].flatMap((i) => [0, 1].map((j) => (vertical ? [i * 4, j * 4] : [j * 4, i * 4])));
  return (
    <svg
      viewBox={vertical ? "0 0 10 6" : "0 0 6 10"}
      width={vertical ? 20 : 12}
      height={vertical ? 12 : 20}
      aria-hidden
      className="pixel-icon fill-current"
    >
      {dots.map(([x, y]) => (
        <rect key={`${x}-${y}`} x={x} y={y} width="2" height="2" />
      ))}
    </svg>
  );
}

export const ResizableHandle = ({
  withHandle,
  className,
  ...props
}: React.ComponentProps<typeof ResizeSeparator> & { withHandle?: boolean }) => (
  <ResizeSeparator
    data-slot="resizable-handle"
    className={cn(
      "group/handle relative z-10 flex w-3 shrink-0 items-center justify-center text-ink outline-none",
      // a horizontal group has vertical separators, and vice versa
      "aria-[orientation=horizontal]:h-3 aria-[orientation=horizontal]:w-full",
      "[&[aria-orientation=vertical]>i]:pixel-rule-y [&[aria-orientation=vertical]>i]:h-full",
      "[&[aria-orientation=horizontal]>i]:pixel-rule [&[aria-orientation=horizontal]>i]:w-full",
      className
    )}
    {...props}
  >
    <i aria-hidden className="absolute opacity-40" />
    {withHandle && (
      <span
        data-slot="resizable-grip"
        className={cn(
          "sticker face-ink relative grid place-items-center transition-[transform,filter] duration-[260ms] ease-peel",
          "h-10 w-6 group-aria-[orientation=horizontal]/handle:h-6 group-aria-[orientation=horizontal]/handle:w-10",
          "group-hover/handle:-translate-y-0.5 group-hover/handle:scale-105 group-hover/handle:[--p3d-sh:0_10px_10px_rgb(var(--p3d-shadow)/0.24)]",
          "group-data-[separator=active]/handle:scale-95 group-data-[separator=active]/handle:[--p3d-sh:0_2px_2px_rgb(var(--p3d-shadow)/0.3)]",
          "group-data-[separator=focus]/handle:[--p3d-cut:var(--color-sky)] group-focus-visible/handle:[--p3d-cut:var(--color-sky)]"
        )}
      >
        <GripVariant />
      </span>
    )}
  </ResizeSeparator>
);
ResizableHandle.displayName = "ResizableHandle";

/** Picks the grip orientation from the surrounding separator via CSS (no context needed). */
function GripVariant() {
  return (
    <>
      <span className="contents group-aria-[orientation=horizontal]/handle:hidden">
        <GripDots vertical={false} />
      </span>
      <span className="hidden group-aria-[orientation=horizontal]/handle:contents">
        <GripDots vertical />
      </span>
    </>
  );
}
