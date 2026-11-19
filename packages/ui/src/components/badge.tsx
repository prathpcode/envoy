import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/utils";

/** Badge — a tiny sticker. Use sparingly: never "a badge on every item". */
export const badgeVariants = cva(
  "sticker crooked inline-flex h-8 items-center gap-1.5 px-3 text-sm font-extrabold leading-none [&_svg]:pixel-icon [&_svg]:size-4",
  {
    variants: {
      tone: {
        paper: "face-paper",
        pink: "face-pink",
        lime: "face-lime",
        sky: "face-sky",
        tomato: "face-tomato",
        butter: "face-butter",
        ink: "face-ink",
      },
    },
    defaultVariants: { tone: "paper" },
  }
);

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {
  tilt?: number;
}

export function Badge({ className, tone, tilt = -2, style, ...props }: BadgeProps) {
  return (
    <span
      data-slot="badge"
      className={cn(badgeVariants({ tone }), className)}
      style={{ ["--p3d-tilt" as string]: `${tilt}deg`, ...style }}
      {...props}
    />
  );
}
