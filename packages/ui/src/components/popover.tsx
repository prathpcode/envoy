"use client";
import * as React from "react";
import { Popover as PopoverPrimitive } from "radix-ui";
import { cn } from "../lib/utils";

/**
 * Popover — a straight paper sticker that drops in next to its trigger. Portaled, so it is
 * never trapped inside a sticker's filter stacking context.
 */
export const Popover = PopoverPrimitive.Root;
export const PopoverTrigger = PopoverPrimitive.Trigger;
export const PopoverAnchor = PopoverPrimitive.Anchor;
export const PopoverClose = PopoverPrimitive.Close;

export const PopoverContent = React.forwardRef<
  React.ComponentRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
>(({ className, align = "center", sideOffset = 12, collisionPadding = 16, ...props }, ref) => (
  <PopoverPrimitive.Portal>
    <PopoverPrimitive.Content
      ref={ref}
      data-slot="popover-content"
      align={align}
      sideOffset={sideOffset}
      collisionPadding={collisionPadding}
      className={cn(
        "sticker sticker-lg face-paper overlay-motion z-50 flex w-80 flex-col gap-4 p-6 outline-none origin-(--radix-popover-content-transform-origin)",
        className
      )}
      {...props}
    />
  </PopoverPrimitive.Portal>
));
PopoverContent.displayName = "PopoverContent";
