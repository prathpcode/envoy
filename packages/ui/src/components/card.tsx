"use client";
import * as React from "react";
import { cn, useTilt, type Tilt } from "../lib/utils";

/**
 * Card — a big sticker with stepped 3-step corners. `interactive` adds the 3D corner-peel.
 * Never nest cards (DESIGN.md). Keep to: media, one heading, one line, one action.
 */
export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  tilt?: Tilt;
  interactive?: boolean;
  face?: "paper" | "pink" | "lime" | "sky" | "butter" | "ink";
}

const faces = {
  paper: "face-paper",
  pink: "face-pink",
  lime: "face-lime",
  sky: "face-sky",
  butter: "face-butter",
  ink: "face-ink",
} as const;

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, tilt = false, interactive = false, face = "paper", style, ...props }, ref) => {
    const tiltStyle = useTilt(tilt, 1.5);
    return (
      <div
        ref={ref}
        data-slot="card"
        style={{ ...tiltStyle, ...style }}
        className={cn(
          "sticker sticker-lg flex flex-col gap-5 p-7",
          faces[face],
          interactive ? "peel-3d cursor-pointer" : "crooked",
          className
        )}
        {...props}
      />
    );
  }
);
Card.displayName = "Card";

export const CardHeader = ({ className, ...p }: React.HTMLAttributes<HTMLDivElement>) => (
  <div data-slot="card-header" className={cn("flex flex-col gap-2", className)} {...p} />
);
export const CardTitle = ({ className, ...p }: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h3 data-slot="card-title" className={cn("text-2xl font-extrabold leading-tight tracking-[-0.02em]", className)} {...p} />
);
export const CardDescription = ({ className, ...p }: React.HTMLAttributes<HTMLParagraphElement>) => (
  <p data-slot="card-description" className={cn("text-base leading-relaxed opacity-80", className)} {...p} />
);
export const CardContent = ({ className, ...p }: React.HTMLAttributes<HTMLDivElement>) => (
  <div data-slot="card-content" className={cn("flex flex-col gap-4", className)} {...p} />
);
export const CardFooter = ({ className, ...p }: React.HTMLAttributes<HTMLDivElement>) => (
  <div data-slot="card-footer" className={cn("flex items-center justify-between gap-4", className)} {...p} />
);
/** Full-bleed media area (image, three.js <Sticker3D/>, chart). */
export const CardMedia = ({ className, ...p }: React.HTMLAttributes<HTMLDivElement>) => (
  <div data-slot="card-media" className={cn("-mx-3 -mt-3 overflow-hidden bg-lid-deep/40", className)} {...p} />
);
