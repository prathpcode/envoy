"use client";
import * as React from "react";
import { Checkbox as CheckboxPrimitive } from "radix-ui";
import { cn } from "../lib/utils";

/**
 * Checkbox — a stamp. Unchecked it's a blank paper sticker; checking turns the whole
 * sticker lime with a chunky pixel check and thunks it down. Unchecking springs it back.
 */

// 2-wide pixel strokes on a 9×6 grid
const CHECK: [number, number][] = [
  [0, 3], [1, 3], [1, 4], [2, 4], [2, 5], [3, 5], [3, 4], [4, 4],
  [4, 3], [5, 3], [5, 2], [6, 2], [6, 1], [7, 1], [7, 0], [8, 0],
];
const MINUS: [number, number][] = [1, 2, 3, 4, 5, 6, 7].flatMap((x) => [[x, 2], [x, 3]] as [number, number][]);

function PixelMark({ cells }: { cells: [number, number][] }) {
  return (
    <svg aria-hidden width={27} height={18} viewBox="0 0 9 6" shapeRendering="crispEdges" className="pixel-icon">
      {cells.map(([x, y]) => (
        <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill="currentColor" />
      ))}
    </svg>
  );
}

export const Checkbox = React.forwardRef<
  React.ComponentRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => {
  // only stamp after a real interaction, never on first paint
  const [touched, setTouched] = React.useState(false);
  return (
    <CheckboxPrimitive.Root
      ref={ref}
      data-slot="checkbox"
      onClickCapture={() => setTouched(true)}
      className={cn(
        "peer sticker sticker-disabled focus-cut face-paper grid size-9 shrink-0 cursor-pointer place-items-center",
        "data-[state=checked]:face-lime data-[state=indeterminate]:face-lime",
        touched &&
          "data-[state=checked]:animate-stamp data-[state=indeterminate]:animate-stamp data-[state=unchecked]:animate-unstamp",
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator className="grid place-items-center text-ink">
        <PixelMark cells={props.checked === "indeterminate" ? MINUS : CHECK} />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
});
Checkbox.displayName = "Checkbox";
