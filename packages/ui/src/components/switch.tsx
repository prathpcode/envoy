"use client";
import * as React from "react";
import { Switch as SwitchPrimitive } from "radix-ui";
import { cn } from "../lib/utils";

/**
 * Switch — a sticker track with an ink block knob. On = sky (the "on" ink).
 * The knob springs across with an overshoot.
 */
export const Switch = React.forwardRef<
  React.ComponentRef<typeof SwitchPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitive.Root
    ref={ref}
    data-slot="switch"
    className={cn(
      "peer sticker sticker-disabled focus-cut face-paper relative inline-flex h-10 w-[76px] shrink-0 cursor-pointer items-center px-[7px]",
      "data-[state=checked]:face-sky",
      className
    )}
    {...props}
  >
    <SwitchPrimitive.Thumb
      className={cn(
        "block size-[26px] bg-ink shadow-[0_3px_0_rgb(var(--p3d-shadow)/0.3)]",
        "transition-transform duration-300 ease-peel",
        "data-[state=checked]:translate-x-[36px]"
      )}
    />
  </SwitchPrimitive.Root>
));
Switch.displayName = "Switch";
