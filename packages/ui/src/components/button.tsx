"use client";
import * as React from "react";
import { Slot } from "radix-ui";
import { cva, type VariantProps } from "class-variance-authority";
import { cn, useTilt, type Tilt } from "../lib/utils";

/**
 * Button — a die-cut sticker that peels on hover and slaps on press.
 * Variants map to inks: primary = pink (act), secondary = paper, success = lime,
 * destructive = tomato, ink = black sticker, ghost = no sticker (text + icon only).
 */
export const buttonVariants = cva(
  "sticker sticker-disabled focus-cut peel inline-flex select-none items-center justify-center gap-2.5 whitespace-nowrap font-p3d font-extrabold tracking-[-0.01em] cursor-pointer [&_svg]:pixel-icon [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary: "face-pink",
        secondary: "face-paper",
        success: "face-lime",
        destructive: "face-tomato",
        ink: "face-ink",
        ghost: "[filter:none] before:hidden text-on-lid hover:bg-on-lid/10",
      },
      size: {
        sm: "h-10 px-4 text-base [&_svg]:size-4",
        md: "h-12 px-5 text-lg [&_svg]:size-6",
        lg: "h-14 px-7 text-xl [&_svg]:size-6",
        icon: "size-12 [&_svg]:size-6",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  /** Resting angle. "auto" (default) picks a stable crooked angle; false = straight. */
  tilt?: Tilt;
  /** Shows a pixel spinner and blocks interaction. */
  loading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant, size, asChild = false, tilt = "auto", loading = false, style, children, disabled, ...props },
    ref
  ) => {
    const Comp = asChild ? Slot.Root : "button";
    const tiltStyle = useTilt(variant === "ghost" ? false : tilt);
    return (
      <Comp
        ref={ref}
        data-slot="button"
        className={cn(buttonVariants({ variant, size }), className)}
        style={{ ...tiltStyle, ...style }}
        disabled={asChild ? undefined : disabled || loading}
        aria-disabled={asChild && disabled ? true : undefined}
        aria-busy={loading || undefined}
        {...props}
      >
        {loading && !asChild ? (
          <>
            <PixelSpinner />
            {children}
          </>
        ) : (
          children
        )}
      </Comp>
    );
  }
);
Button.displayName = "Button";

/** 8-block pixel spinner; rotates in steps so it reads as pixel art. */
export function PixelSpinner({ className, size = 20, label }: { className?: string; size?: number; label?: string }) {
  return (
    <svg
      viewBox="0 0 10 10"
      width={size}
      height={size}
      role={label ? "status" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className={cn("pixel-icon animate-[p3d-pixel-spin_800ms_steps(8)_infinite]", className)}
      fill="currentColor"
    >
      <rect x="4" y="0" width="2" height="2" />
      <rect x="7" y="1.5" width="2" height="2" opacity=".85" />
      <rect x="8" y="4" width="2" height="2" opacity=".7" />
      <rect x="7" y="6.5" width="2" height="2" opacity=".55" />
      <rect x="4" y="8" width="2" height="2" opacity=".4" />
      <rect x="1" y="6.5" width="2" height="2" opacity=".3" />
      <rect x="0" y="4" width="2" height="2" opacity=".2" />
      <rect x="1" y="1.5" width="2" height="2" opacity=".12" />
    </svg>
  );
}
