"use client";
import * as React from "react";
import { Label as LabelPrimitive } from "radix-ui";
import { cn } from "../lib/utils";

export const Label = React.forwardRef<
  React.ComponentRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    data-slot="label"
    className={cn(
      // colour inherits: on-lid on the page, ink inside any sticker face (dialogs, sheets, cards)
      "inline-flex cursor-pointer items-center gap-3 text-[17px] font-semibold leading-tight text-inherit peer-disabled:cursor-not-allowed peer-disabled:opacity-60",
      className
    )}
    {...props}
  />
));
Label.displayName = "Label";
