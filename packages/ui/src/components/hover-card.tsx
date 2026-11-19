"use client";
import * as React from "react";
import { HoverCard as HoverCardPrimitive } from "radix-ui";
import { cn } from "../lib/utils";

/**
 * HoverCard — a straight paper sticker that drops in while you hover a link.
 * A preview only: never put the one way to do something inside it.
 */
export const HoverCard = HoverCardPrimitive.Root;
export const HoverCardTrigger = HoverCardPrimitive.Trigger;

export const HoverCardContent = React.forwardRef<
  React.ComponentRef<typeof HoverCardPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof HoverCardPrimitive.Content>
>(({ className, align = "center", sideOffset = 12, collisionPadding = 16, ...props }, ref) => (
  <HoverCardPrimitive.Portal>
    <HoverCardPrimitive.Content
      ref={ref}
      data-slot="hover-card-content"
      align={align}
      sideOffset={sideOffset}
      collisionPadding={collisionPadding}
      className={cn(
        "sticker sticker-lg face-paper overlay-motion z-50 flex w-72 flex-col gap-3 p-5 outline-none origin-(--radix-hover-card-content-transform-origin)",
        className
      )}
      {...props}
    />
  </HoverCardPrimitive.Portal>
));
HoverCardContent.displayName = "HoverCardContent";
