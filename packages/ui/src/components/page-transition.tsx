"use client";
import * as React from "react";
import { Slot } from "radix-ui";
import { cn } from "../lib/utils";

/**
 * Page transitions + intro animations. Built to feel instant.
 *
 *  - <PageTransitions routeKey={pathname}> goes in your providers. It never delays a
 *    navigation: your router swaps the page as usual and the new page slides in.
 *  - <PageSheet> marks the region that slides (usually <main>). Header and sidebar stay put.
 *    Without one, the page's <main> slides.
 *  - <Intro> sticks its children on one after another when it mounts.
 *  - <Reveal> does the same, but waits until it scrolls into view.
 *  - The `intro-page` class staggers a page's blocks on a hard load only; on in-app route
 *    changes the slide does the job instead, so nothing animates twice.
 *
 * Next.js App Router:
 *   <PageTransitions routeKey={usePathname()}>{children}</PageTransitions>
 *
 * Under reduced motion nothing slides or animates in.
 */

const reducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Snap curve: a hard attack from 28px that overshoots to -4px at 45%, then settles.
// Position only, no fade: opacity on the page would force a re-layering too (see snap).
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
function snapAt(p: number) {
  if (p < 0.45) {
    const t = easeOut(p / 0.45);
    return 28 + (-4 - 28) * t;
  }
  return -4 + 4 * easeInOut((p - 0.45) / 0.55);
}

/**
 * The slide moves the page with relative `left`, frame by frame, on purpose. A transform or
 * opacity on the page would make it a stacking context for the length of the slide, and
 * page stickers that sit above the shared 3D canvas (z-index > 30) would drop under the
 * voxels until it ends. A relative offset changes no stacking and no layering.
 */
function snap(el: HTMLElement, duration = 260) {
  let raf = 0;
  const start = performance.now();
  const wasStatic = getComputedStyle(el).position === "static";
  const apply = (p: number) => {
    if (wasStatic) el.style.position = "relative";
    el.style.left = `${snapAt(p).toFixed(2)}px`;
  };
  const clear = () => {
    el.style.left = "";
    if (wasStatic) el.style.position = "";
  };
  apply(0);
  const tick = (now: number) => {
    const p = Math.min(1, (now - start) / duration);
    if (p >= 1) return clear();
    apply(p);
    raf = requestAnimationFrame(tick);
  };
  raf = requestAnimationFrame(tick);
  return () => {
    cancelAnimationFrame(raf);
    clear();
  };
}

export interface PageTransitionsProps {
  /** The current route, e.g. Next's usePathname(). Every change slides the new page in. */
  routeKey: string;
  children: React.ReactNode;
}

/**
 * Slides the new page in on every route change: links, router.push, back/forward, and
 * across layouts (a freshly mounted page slides too). It runs after the new page has
 * committed, so the target is always the new page. The target is your <PageSheet>, or
 * the page's <main> if you never marked one.
 */
export function PageTransitions({ routeKey, children }: PageTransitionsProps) {
  const last = React.useRef(routeKey);
  React.useEffect(() => {
    // Page intros (intro-page) are for the first load only. Mark the page settled once that
    // intro is over, long before any navigation can race it: a flag set *during* a route
    // change loses to the new page's first paint and the page intro replays (a blank frame,
    // then a fade). From here on, route changes get the slide alone.
    const t = setTimeout(() => document.documentElement.setAttribute("data-p3d-settled", ""), 700);
    return () => clearTimeout(t);
  }, []);
  React.useLayoutEffect(() => {
    if (routeKey === last.current) return;
    last.current = routeKey;
    document.documentElement.setAttribute("data-p3d-settled", "");
    if (reducedMotion()) return;
    const el = document.querySelector<HTMLElement>("[data-slot=page-sheet]") ?? document.querySelector("main");
    if (!el) return;
    return snap(el);
  }, [routeKey]);
  return <>{children}</>;
}

export interface PageSheetProps extends React.HTMLAttributes<HTMLElement> {
  asChild?: boolean;
}

/** Marks the region that slides in on a route change (usually <main>). Header and sidebar stay put. */
export const PageSheet = React.forwardRef<HTMLElement, PageSheetProps>(({ asChild, ...props }, ref) => {
  const Comp = asChild ? Slot.Root : "main";
  return <Comp ref={ref as React.Ref<HTMLElement>} data-slot="page-sheet" {...props} />;
});
PageSheet.displayName = "PageSheet";

export interface IntroProps extends React.HTMLAttributes<HTMLElement> {
  asChild?: boolean;
  /**
   * Small loose stickers (badges, avatars, chips) also tumble in from -6° at 1.06×.
   * Leave it off for blocks, text and anything full-width: they drop in straight.
   */
  tumble?: boolean;
}

/** Sticks each direct child on, one after another, when it mounts. */
export const Intro = React.forwardRef<HTMLElement, IntroProps>(({ asChild, tumble, className, ...props }, ref) => {
  const Comp = asChild ? Slot.Root : "div";
  return (
    <Comp
      ref={ref as React.Ref<HTMLDivElement>}
      data-slot="intro"
      className={cn("intro-stagger", tumble && "intro-tumble", className)}
      {...props}
    />
  );
});
Intro.displayName = "Intro";

/**
 * Like <Intro>, but holds its children back until they scroll into view, then sticks
 * them on once. Content already on screen at mount is never hidden.
 */
export const Reveal = React.forwardRef<HTMLElement, IntroProps>(({ asChild, tumble, className, ...props }, outerRef) => {
  const ref = React.useRef<HTMLElement | null>(null);
  const [state, setState] = React.useState<"waiting" | "in" | undefined>(undefined);
  React.useImperativeHandle(outerRef, () => ref.current as HTMLElement);

  React.useLayoutEffect(() => {
    const el = ref.current;
    if (!el || reducedMotion() || typeof IntersectionObserver === "undefined") return;
    if (el.getBoundingClientRect().top < window.innerHeight) return; // on screen already
    setState("waiting");
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        setState("in");
        io.disconnect();
      },
      { rootMargin: "0px 0px -10% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const Comp = asChild ? Slot.Root : "div";
  return (
    <Comp
      ref={ref as React.Ref<HTMLDivElement>}
      data-slot="reveal"
      data-state={state}
      className={cn("intro-stagger", tumble && "intro-tumble", className)}
      {...props}
    />
  );
});
Reveal.displayName = "Reveal";
