"use client";
import * as React from "react";
import { ScrollArea as ScrollAreaPrimitive } from "radix-ui";
import { cn } from "../lib/utils";

/**
 * ScrollArea — custom scrollbars: an ink block thumb with stepped corners on a lid-deep
 * track. The root clips, so it must never be the `sticker` itself: put it inside one.
 */
export const ScrollArea = React.forwardRef<
  React.ComponentRef<typeof ScrollAreaPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root>
>(({ className, children, ...props }, ref) => (
  <ScrollAreaPrimitive.Root
    ref={ref}
    data-slot="scroll-area"
    className={cn("relative overflow-hidden", className)}
    {...props}
  >
    <ScrollAreaPrimitive.Viewport
      data-slot="scroll-area-viewport"
      // focusable, so keyboard users can scroll it (axe: scrollable-region-focusable)
      tabIndex={0}
      className="size-full outline-none focus-visible:outline-4 focus-visible:-outline-offset-4 focus-visible:outline-sky"
    >
      {children}
    </ScrollAreaPrimitive.Viewport>
    <ScrollBar />
    <ScrollAreaPrimitive.Corner className="bg-lid-deep" />
  </ScrollAreaPrimitive.Root>
));
ScrollArea.displayName = "ScrollArea";

export const ScrollBar = React.forwardRef<
  React.ComponentRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>
>(({ className, orientation = "vertical", ...props }, ref) => (
  <ScrollAreaPrimitive.ScrollAreaScrollbar
    ref={ref}
    data-slot="scroll-area-scrollbar"
    orientation={orientation}
    className={cn(
      "flex touch-none select-none bg-lid-deep p-0.5 transition-opacity duration-150",
      orientation === "vertical" && "h-full w-3",
      orientation === "horizontal" && "h-3 flex-col",
      className
    )}
    {...props}
  >
    <ScrollAreaPrimitive.ScrollAreaThumb
      data-slot="scroll-area-thumb"
      className="pixel-thumb relative flex-1 cursor-grab active:cursor-grabbing"
    />
  </ScrollAreaPrimitive.ScrollAreaScrollbar>
));
ScrollBar.displayName = "ScrollBar";
