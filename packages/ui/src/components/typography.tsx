import * as React from "react";
import { cn } from "../lib/utils";

/**
 * Typography — DESIGN.md's type scale as components. Bricolage Grotesque everywhere:
 * Display 96px max, H1 64 / H2 44 / H3 32 / H4 24, body 18px, nothing under 14px.
 * Blockquote is a straight paper sticker with an ink pixel quote mark (never a border-left).
 */

type HeadingProps = React.HTMLAttributes<HTMLHeadingElement>;

export const Display = React.forwardRef<HTMLHeadingElement, HeadingProps>(({ className, ...props }, ref) => (
  <h1
    ref={ref}
    data-slot="display"
    className={cn(
      "text-6xl font-extrabold leading-[0.95] tracking-[-0.03em] [font-variation-settings:'opsz'_96] sm:text-7xl lg:text-8xl",
      className
    )}
    {...props}
  />
));
Display.displayName = "Display";

export const H1 = React.forwardRef<HTMLHeadingElement, HeadingProps>(({ className, ...props }, ref) => (
  <h1
    ref={ref}
    data-slot="h1"
    className={cn("text-5xl font-extrabold leading-[1.02] tracking-[-0.025em] md:text-[64px]", className)}
    {...props}
  />
));
H1.displayName = "H1";

export const H2 = React.forwardRef<HTMLHeadingElement, HeadingProps>(({ className, ...props }, ref) => (
  <h2
    ref={ref}
    data-slot="h2"
    className={cn("text-4xl font-extrabold leading-[1.08] tracking-[-0.02em] md:text-[44px]", className)}
    {...props}
  />
));
H2.displayName = "H2";

export const H3 = React.forwardRef<HTMLHeadingElement, HeadingProps>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    data-slot="h3"
    className={cn("text-[28px] font-bold leading-tight tracking-[-0.01em] md:text-[32px]", className)}
    {...props}
  />
));
H3.displayName = "H3";

export const H4 = React.forwardRef<HTMLHeadingElement, HeadingProps>(({ className, ...props }, ref) => (
  <h4 ref={ref} data-slot="h4" className={cn("text-2xl font-bold leading-snug", className)} {...props} />
));
H4.displayName = "H4";

export const Lead = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      data-slot="lead"
      className={cn("max-w-[60ch] text-[22px] font-medium leading-[1.45] text-on-lid-soft", className)}
      {...props}
    />
  )
);
Lead.displayName = "Lead";

export const P = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      data-slot="p"
      className={cn("max-w-[68ch] text-lg font-medium leading-[1.55]", className)}
      {...props}
    />
  )
);
P.displayName = "P";

/** An ink pixel quote mark (two stepped commas). */
function PixelQuote({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 14 8" width="42" height="24" aria-hidden className={cn("pixel-icon fill-ink", className)}>
      <rect x="0" y="0" width="6" height="4" />
      <rect x="2" y="4" width="4" height="2" />
      <rect x="0" y="6" width="4" height="2" />
      <rect x="8" y="0" width="6" height="4" />
      <rect x="10" y="4" width="4" height="2" />
      <rect x="8" y="6" width="4" height="2" />
    </svg>
  );
}

export const Blockquote = React.forwardRef<HTMLQuoteElement, React.BlockquoteHTMLAttributes<HTMLQuoteElement>>(
  ({ className, children, ...props }, ref) => (
    <blockquote
      ref={ref}
      data-slot="blockquote"
      className={cn(
        "sticker sticker-lg face-paper flex max-w-[64ch] flex-col gap-4 px-7 pb-7 pt-6 text-xl font-semibold leading-[1.5]",
        className
      )}
      {...props}
    >
      <PixelQuote />
      <div className="flex flex-col gap-3 [&_cite]:text-base [&_cite]:font-bold [&_cite]:not-italic [&_cite]:opacity-80">
        {children}
      </div>
    </blockquote>
  )
);
Blockquote.displayName = "Blockquote";

export const InlineCode = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>(
  ({ className, ...props }, ref) => (
    <code
      ref={ref}
      data-slot="inline-code"
      className={cn(
        "bg-paper px-[0.35em] py-[0.1em] font-mono text-[0.9em] text-ink [box-decoration-break:clone]",
        className
      )}
      {...props}
    />
  )
);
InlineCode.displayName = "InlineCode";

export const List = React.forwardRef<HTMLUListElement, React.HTMLAttributes<HTMLUListElement>>(
  ({ className, ...props }, ref) => (
    <ul
      ref={ref}
      data-slot="list"
      className={cn(
        "flex max-w-[68ch] flex-col gap-2 text-lg font-medium leading-[1.55]",
        "[&>li]:relative [&>li]:pl-7 [&>li]:before:absolute [&>li]:before:left-1 [&>li]:before:top-[0.6em] [&>li]:before:size-2 [&>li]:before:bg-current [&>li]:before:content-['']",
        className
      )}
      {...props}
    />
  )
);
List.displayName = "List";

/** A pink highlighter sticker behind a few words. One per section (Two Pinks Rule). */
export const Mark = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>(
  ({ className, ...props }, ref) => (
    <mark ref={ref} data-slot="mark" className={cn("mark-sticker", className)} {...props} />
  )
);
Mark.displayName = "Mark";
