"use client";
import * as React from "react";
import { Toggle as TogglePrimitive } from "radix-ui";
import { cva, type VariantProps } from "class-variance-authority";
import { cn, useTilt, type Tilt } from "../lib/utils";

/**
 * Toggle — a paper sticker you press in. Pressed = lime (chosen), lying flat and straight.
 * `outline` is a blank lid-coloured sticker with just the white kiss-cut.
 */
export const toggleVariants = cva(
  "sticker sticker-disabled focus-cut peel inline-flex shrink-0 cursor-pointer select-none items-center justify-center gap-2 whitespace-nowrap font-p3d font-extrabold [&_svg]:pixel-icon [&_svg]:shrink-0 data-[state=on]:face-lime data-[state=on]:sticker-flat data-[state=on]:[--p3d-tilt:0deg]",
  {
    variants: {
      variant: {
        default: "face-paper",
        outline: "face-lid",
      },
      size: {
        sm: "h-10 min-w-10 px-3 text-base [&_svg]:size-5",
        default: "h-12 min-w-12 px-4 text-[17px] [&_svg]:size-6",
        lg: "h-14 min-w-14 px-5 text-lg [&_svg]:size-6",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
);

export interface ToggleProps
  extends React.ComponentPropsWithoutRef<typeof TogglePrimitive.Root>,
    VariantProps<typeof toggleVariants> {
  /** Resting angle when not pressed. "auto" (default) picks a stable crooked angle; false = straight. */
  tilt?: Tilt;
}

export const Toggle = React.forwardRef<React.ComponentRef<typeof TogglePrimitive.Root>, ToggleProps>(
  ({ className, variant, size, tilt = "auto", style, ...props }, ref) => {
    const tiltStyle = useTilt(tilt);
    return (
      <TogglePrimitive.Root
        ref={ref}
        data-slot="toggle"
        style={{ ...tiltStyle, ...style }}
        className={cn(toggleVariants({ variant, size }), className)}
        {...props}
      />
    );
  }
);
Toggle.displayName = "Toggle";
