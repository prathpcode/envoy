"use client";
import * as React from "react";
import { Progress as ProgressPrimitive } from "radix-ui";
import { cn } from "../lib/utils";

/**
 * Progress — a pixel XP bar. The track is a straight paper sticker; the fill is pink
 * 8px blocks that arrive one block at a time. Pass value={null} for an indeterminate
 * scanner. Label it (aria-label or aria-labelledby).
 *
 *   <Progress value={64} aria-label="Uploading demo video" />
 */
export const Progress = React.forwardRef<
  React.ComponentRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
>(({ className, value, max = 100, ...props }, ref) => {
  const indeterminate = value == null;
  const pct = indeterminate ? 0 : Math.max(0, Math.min(100, (value / (max || 100)) * 100));
  return (
    <ProgressPrimitive.Root
      ref={ref}
      data-slot="progress"
      value={value}
      max={max}
      className={cn("sticker face-paper flex h-8 w-full p-2", className)}
      {...props}
    >
      {/* inner clip box: the sticker itself must never get overflow-hidden */}
      <div className="flex h-full w-full overflow-hidden">
        <ProgressPrimitive.Indicator
          data-slot="progress-indicator"
          className={indeterminate ? "xp-scan" : "xp-fill"}
          style={indeterminate ? undefined : { ["--p3d-pv" as string]: pct }}
        />
      </div>
    </ProgressPrimitive.Root>
  );
});
Progress.displayName = "Progress";
