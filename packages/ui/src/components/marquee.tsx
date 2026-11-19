"use client";
import * as React from "react";
import { cn } from "../lib/utils";

/**
 * Marquee — an endless row of crooked stickers (your children: Badges, PixelAvatars, logos).
 * It pauses on hover and keyboard focus. Under reduced motion it stands still and wraps
 * into a static, centred cluster instead.
 *
 *   <Marquee speed={40}>
 *     <Badge tone="pink">Ship it</Badge>
 *     <Badge tone="lime">Demo day</Badge>
 *   </Marquee>
 */
export interface MarqueeProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Pixels per second. */
  speed?: number;
  direction?: "left" | "right";
  pauseOnHover?: boolean;
  /** Gap between stickers in px (keep ≥ 12 so kiss-cuts don't touch). */
  gap?: number;
}

export const Marquee = React.forwardRef<HTMLDivElement, MarqueeProps>(
  ({ speed = 40, direction = "left", pauseOnHover = true, gap = 24, className, style, children, ...props }, ref) => {
    const copy = React.useRef<HTMLDivElement>(null);
    const [duration, setDuration] = React.useState<number | null>(null);

    React.useEffect(() => {
      const el = copy.current;
      if (!el) return;
      const measure = () => setDuration(Math.max(4, el.offsetWidth / Math.max(1, speed)));
      measure();
      const ro = new ResizeObserver(measure);
      ro.observe(el);
      return () => ro.disconnect();
    }, [speed]);

    const items = (
      <div
        className="flex shrink-0 items-center motion-reduce:w-full motion-reduce:shrink motion-reduce:flex-wrap motion-reduce:justify-center motion-reduce:pr-0!"
        style={{ gap, paddingRight: gap }}
      >
        {children}
      </div>
    );

    return (
      <div
        ref={ref}
        data-slot="marquee"
        className={cn("relative w-full overflow-hidden py-5", pauseOnHover && "marquee-pause", className)}
        style={style}
        {...props}
      >
        <div
          className={cn(
            "flex w-max",
            duration !== null && "marquee-track",
            "motion-reduce:w-full motion-reduce:flex-wrap motion-reduce:justify-center"
          )}
          style={{
            ["--p3d-marquee-duration" as string]: `${duration ?? 30}s`,
            ["--p3d-marquee-direction" as string]: direction === "right" ? "reverse" : "normal",
          }}
        >
          <div ref={copy} className="flex shrink-0 motion-reduce:w-full motion-reduce:shrink">
            {items}
          </div>
          <div aria-hidden inert className="flex shrink-0 motion-reduce:hidden">
            {items}
          </div>
        </div>
      </div>
    );
  }
);
Marquee.displayName = "Marquee";
