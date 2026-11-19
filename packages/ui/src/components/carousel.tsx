"use client";
import * as React from "react";
import useEmblaCarousel, { type UseEmblaCarouselType } from "embla-carousel-react";
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp } from "pixelarticons/react";
import { cn } from "../lib/utils";
import { Button, type ButtonProps } from "./button";

/**
 * Carousel — embla-carousel with the shadcn API, as a cover-flow of stickers.
 * Every slide is a crooked paper sticker; the centred one straightens, lifts and
 * scales up while its neighbours tilt away in 3D, all driven by embla's scroll
 * progress. Prev / next are square paper stickers with pixel arrows.
 *
 *   <Carousel>
 *     <CarouselContent>
 *       <CarouselItem className="basis-2/3">…</CarouselItem>
 *     </CarouselContent>
 *     <CarouselPrevious /><CarouselNext />
 *   </Carousel>
 */
export type CarouselApi = UseEmblaCarouselType[1];
type UseCarouselParameters = Parameters<typeof useEmblaCarousel>;
type CarouselOptions = UseCarouselParameters[0];
type CarouselPlugin = UseCarouselParameters[1];

export interface CarouselProps {
  opts?: CarouselOptions;
  plugins?: CarouselPlugin;
  orientation?: "horizontal" | "vertical";
  setApi?: (api: CarouselApi) => void;
}

type CarouselContextProps = {
  carouselRef: ReturnType<typeof useEmblaCarousel>[0];
  api: ReturnType<typeof useEmblaCarousel>[1];
  scrollPrev: () => void;
  scrollNext: () => void;
  canScrollPrev: boolean;
  canScrollNext: boolean;
} & CarouselProps;

const CarouselContext = React.createContext<CarouselContextProps | null>(null);

export function useCarousel() {
  const context = React.useContext(CarouselContext);
  if (!context) throw new Error("useCarousel must be used within a <Carousel />");
  return context;
}

/** Writes each slide's signed distance from the centre (in slides) as CSS variables. */
function applyFlow(api: NonNullable<CarouselApi>) {
  const engine = api.internalEngine();
  const progress = api.scrollProgress();
  const snaps = api.scrollSnapList();
  const slides = api.slideNodes();
  // adjacent snaps are 1/(n-1) apart in progress, or 1/n when looping
  const span = engine.options.loop ? snaps.length : Math.max(1, snaps.length - 1);
  snaps.forEach((snap, snapIndex) => {
    const inSnap = engine.slideRegistry[snapIndex] ?? [];
    inSnap.forEach((slideIndex) => {
      let diff = snap - progress;
      if (engine.options.loop) {
        engine.slideLooper.loopPoints.forEach((loopItem) => {
          const target = loopItem.target();
          if (slideIndex === loopItem.index && target !== 0) {
            if (Math.sign(target) === -1) diff = snap - (1 + progress);
            if (Math.sign(target) === 1) diff = snap + (1 - progress);
          }
        });
      }
      const d = Math.max(-2, Math.min(2, diff * span));
      const node = slides[slideIndex];
      if (!node) return;
      node.style.setProperty("--p3d-d", d.toFixed(3));
      node.style.setProperty("--p3d-ad", Math.min(1, Math.abs(d)).toFixed(3));
      if (Math.abs(d) < 0.5) node.setAttribute("data-center", "");
      else node.removeAttribute("data-center");
    });
  });
}

export const Carousel = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & CarouselProps>(
  ({ orientation = "horizontal", opts, setApi, plugins, className, children, ...props }, ref) => {
    const [carouselRef, api] = useEmblaCarousel(
      { align: "center", containScroll: false, ...opts, axis: orientation === "horizontal" ? "x" : "y" },
      plugins
    );
    const [canScrollPrev, setCanScrollPrev] = React.useState(false);
    const [canScrollNext, setCanScrollNext] = React.useState(false);

    const onSelect = React.useCallback((a: CarouselApi) => {
      if (!a) return;
      setCanScrollPrev(a.canScrollPrev());
      setCanScrollNext(a.canScrollNext());
    }, []);

    const scrollPrev = React.useCallback(() => api?.scrollPrev(), [api]);
    const scrollNext = React.useCallback(() => api?.scrollNext(), [api]);

    const handleKeyDown = React.useCallback(
      (event: React.KeyboardEvent<HTMLDivElement>) => {
        const prevKey = orientation === "horizontal" ? "ArrowLeft" : "ArrowUp";
        const nextKey = orientation === "horizontal" ? "ArrowRight" : "ArrowDown";
        if (event.key === prevKey) {
          event.preventDefault();
          scrollPrev();
        } else if (event.key === nextKey) {
          event.preventDefault();
          scrollNext();
        }
      },
      [orientation, scrollPrev, scrollNext]
    );

    React.useEffect(() => {
      if (api && setApi) setApi(api);
    }, [api, setApi]);

    React.useEffect(() => {
      if (!api) return;
      const flow = () => applyFlow(api);
      onSelect(api);
      flow();
      api.on("reInit", onSelect).on("select", onSelect).on("scroll", flow).on("reInit", flow).on("slideFocus", flow);
      return () => {
        api.off("reInit", onSelect).off("select", onSelect).off("scroll", flow).off("reInit", flow).off("slideFocus", flow);
      };
    }, [api, onSelect]);

    return (
      <CarouselContext.Provider
        value={{
          carouselRef,
          api,
          opts,
          orientation: orientation ?? (opts?.axis === "y" ? "vertical" : "horizontal"),
          scrollPrev,
          scrollNext,
          canScrollPrev,
          canScrollNext,
        }}
      >
        <div
          ref={ref}
          onKeyDownCapture={handleKeyDown}
          className={cn("relative", className)}
          role="region"
          aria-roledescription="carousel"
          data-slot="carousel"
          {...props}
        >
          {children}
        </div>
      </CarouselContext.Provider>
    );
  }
);
Carousel.displayName = "Carousel";

export const CarouselContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    const { carouselRef, orientation } = useCarousel();
    return (
      // the viewport clips; the track's padding leaves room for the lift + kiss-cut
      <div ref={carouselRef} className="overflow-hidden" data-slot="carousel-content">
        <div
          ref={ref}
          className={cn("flex", orientation === "horizontal" ? "-ml-4 py-10" : "-mt-4 flex-col px-10", className)}
          {...props}
        />
      </div>
    );
  }
);
CarouselContent.displayName = "CarouselContent";

const slideTilts = [-2.5, 2, -1.5, 2.5, -2, 1.5];

export interface CarouselItemProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Classes for the sticker inside the slide (className sizes the slide itself). */
  stickerClassName?: string;
  /** Resting tilt for this slide when it's off-centre. Defaults to a stable angle per position. */
  tilt?: number;
  /** Position in the list; picks the default tilt. */
  index?: number;
}

export const CarouselItem = React.forwardRef<HTMLDivElement, CarouselItemProps>(
  ({ className, stickerClassName, tilt, index = 0, children, ...props }, ref) => {
    const { orientation } = useCarousel();
    const angle = tilt ?? slideTilts[index % slideTilts.length];
    return (
      <div
        ref={ref}
        role="group"
        aria-roledescription="slide"
        data-slot="carousel-item"
        className={cn("min-w-0 shrink-0 grow-0 basis-full", orientation === "horizontal" ? "pl-4" : "pt-4", className)}
        style={{ ["--p3d-tilt" as string]: `${angle}deg` }}
        {...props}
      >
        <div
          data-slot="carousel-sticker"
          className={cn(
            "sticker sticker-lg face-paper flex h-full flex-col gap-4 p-7",
            orientation === "horizontal" ? "slide-flow" : "slide-flow-y",
            stickerClassName
          )}
        >
          {children}
        </div>
      </div>
    );
  }
);
CarouselItem.displayName = "CarouselItem";

export const CarouselPrevious = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "secondary", size = "icon", ...props }, ref) => {
    const { orientation, scrollPrev, canScrollPrev } = useCarousel();
    return (
      <Button
        ref={ref}
        data-slot="carousel-previous"
        variant={variant}
        size={size}
        className={cn(
          "absolute",
          orientation === "horizontal" ? "top-1/2 -left-16 -translate-y-1/2" : "-top-16 left-1/2 -translate-x-1/2",
          className
        )}
        disabled={!canScrollPrev}
        onClick={scrollPrev}
        aria-label="Previous slide"
        {...props}
      >
        {orientation === "horizontal" ? <ArrowLeft /> : <ArrowUp />}
      </Button>
    );
  }
);
CarouselPrevious.displayName = "CarouselPrevious";

export const CarouselNext = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "secondary", size = "icon", ...props }, ref) => {
    const { orientation, scrollNext, canScrollNext } = useCarousel();
    return (
      <Button
        ref={ref}
        data-slot="carousel-next"
        variant={variant}
        size={size}
        className={cn(
          "absolute",
          orientation === "horizontal" ? "top-1/2 -right-16 -translate-y-1/2" : "-bottom-16 left-1/2 -translate-x-1/2",
          className
        )}
        disabled={!canScrollNext}
        onClick={scrollNext}
        aria-label="Next slide"
        {...props}
      >
        {orientation === "horizontal" ? <ArrowRight /> : <ArrowDown />}
      </Button>
    );
  }
);
CarouselNext.displayName = "CarouselNext";
