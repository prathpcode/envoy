import * as React from "react";
import { cn } from "../lib/utils";

/**
 * Skeleton — a recessed lid-deep block with a dithered 2×2 pixel checker that sweeps
 * across in steps(). Notched pixel corners, never a smooth radius. Size it with
 * Tailwind (h-6 w-40, size-12). It is decoration, so it is aria-hidden: mark the
 * loading region itself with aria-busy.
 */
export const Skeleton = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="skeleton"
      aria-hidden
      className={cn("skeleton-dither pixel-notch h-6 w-full", className)}
      {...props}
    />
  )
);
Skeleton.displayName = "Skeleton";
