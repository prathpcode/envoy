"use client";
import * as React from "react";
import { Separator as SeparatorPrimitive } from "radix-ui";
import { cn } from "../lib/utils";

/**
 * Separator — a 4px dotted pixel rule, horizontal or vertical. It takes the current
 * text colour at half strength, so it reads on the lid and on any sticker face.
 */
export const Separator = React.forwardRef<
  React.ComponentRef<typeof SeparatorPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root>
>(({ className, orientation = "horizontal", decorative = true, ...props }, ref) => (
  <SeparatorPrimitive.Root
    ref={ref}
    data-slot="separator"
    decorative={decorative}
    orientation={orientation}
    className={cn(
      "shrink-0 opacity-50",
      orientation === "horizontal" ? "pixel-rule w-full" : "pixel-rule-y self-stretch",
      className
    )}
    {...props}
  />
));
Separator.displayName = "Separator";
