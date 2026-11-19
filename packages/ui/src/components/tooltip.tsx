"use client";
import * as React from "react";
import { Tooltip as TooltipPrimitive } from "radix-ui";
import { cn } from "../lib/utils";

/**
 * Tooltip — a small ink sticker with paper text. Straight, 16px, never uppercase.
 * Wrap your app (or a region) in <TooltipProvider> once.
 */
export function TooltipProvider({ delayDuration = 200, ...props }: React.ComponentProps<typeof TooltipPrimitive.Provider>) {
  return <TooltipPrimitive.Provider delayDuration={delayDuration} {...props} />;
}
TooltipProvider.displayName = "TooltipProvider";

export const Tooltip = TooltipPrimitive.Root;
export const TooltipTrigger = TooltipPrimitive.Trigger;

export const TooltipContent = React.forwardRef<
  React.ComponentRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 12, collisionPadding = 12, ...props }, ref) => (
  <TooltipPrimitive.Portal>
    <TooltipPrimitive.Content
      ref={ref}
      data-slot="tooltip-content"
      sideOffset={sideOffset}
      collisionPadding={collisionPadding}
      className={cn(
        "sticker face-ink tooltip-motion z-50 max-w-xs px-3 py-1.5 text-base font-bold leading-snug text-balance origin-(--radix-tooltip-content-transform-origin)",
        className
      )}
      {...props}
    />
  </TooltipPrimitive.Portal>
));
TooltipContent.displayName = "TooltipContent";
