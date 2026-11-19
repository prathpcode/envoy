"use client";
import * as React from "react";
import { Slider as SliderPrimitive } from "radix-ui";
import { cn } from "../lib/utils";

/**
 * Slider — a paper sticker bar; the filled range is pink in a 4px pixel pattern.
 * Each thumb is a crooked ink block sticker that peels up on hover and stays lifted while
 * you drag it, with a little value sticker riding above. Pass two values for a range.
 *
 *   <Slider defaultValue={[3]} min={1} max={5} aria-label="Team size" />
 *   <Slider defaultValue={[10, 18]} min={0} max={24} formatValue={(v) => `${v}:00`} />
 */
export interface SliderProps extends React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> {
  /** Show the value sticker above the thumb while dragging (and on keyboard focus). */
  showValue?: boolean;
  /** Formats the value sticker text. */
  formatValue?: (value: number) => React.ReactNode;
  /** Accessible names for each thumb, e.g. ["Start", "End"] for a range. */
  thumbLabels?: string[];
}

const thumbTilts = ["-2.5deg", "2deg"];

export const Slider = React.forwardRef<React.ComponentRef<typeof SliderPrimitive.Root>, SliderProps>(
  (
    {
      className,
      value,
      defaultValue,
      min = 0,
      max = 100,
      onValueChange,
      onPointerDown,
      showValue = true,
      formatValue = (v) => v,
      thumbLabels,
      ...props
    },
    ref
  ) => {
    const [inner, setInner] = React.useState<number[]>(defaultValue ?? [min]);
    const values = value ?? inner;
    const [dragging, setDragging] = React.useState(false);

    React.useEffect(() => {
      if (!dragging) return;
      const stop = () => setDragging(false);
      window.addEventListener("pointerup", stop);
      window.addEventListener("pointercancel", stop);
      return () => {
        window.removeEventListener("pointerup", stop);
        window.removeEventListener("pointercancel", stop);
      };
    }, [dragging]);

    return (
      <SliderPrimitive.Root
        ref={ref}
        data-slot="slider"
        data-dragging={dragging || undefined}
        value={value}
        defaultValue={defaultValue}
        min={min}
        max={max}
        onValueChange={(v) => {
          setInner(v);
          onValueChange?.(v);
        }}
        onPointerDown={(e) => {
          if (!props.disabled) setDragging(true);
          onPointerDown?.(e);
        }}
        className={cn(
          "relative flex w-full touch-none select-none items-center data-[disabled]:cursor-not-allowed",
          "data-[orientation=horizontal]:h-11 data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-44 data-[orientation=vertical]:w-11 data-[orientation=vertical]:flex-col",
          className
        )}
        {...props}
      >
        <SliderPrimitive.Track
          data-slot="slider-track"
          className={cn(
            "sticker face-paper relative grow",
            "data-[orientation=horizontal]:h-6 data-[orientation=horizontal]:w-full data-[orientation=vertical]:w-6",
            "data-[disabled]:[--face:#e4e6ea] data-[disabled]:sticker-flat"
          )}
        >
          <SliderPrimitive.Range
            data-slot="slider-range"
            className={cn(
              "pixel-fill-pink absolute",
              "data-[orientation=horizontal]:inset-y-1 data-[orientation=vertical]:inset-x-1",
              "data-[disabled]:[background:var(--color-ink-soft)] data-[disabled]:opacity-40"
            )}
          />
        </SliderPrimitive.Track>
        {values.map((v, i) => (
          <SliderPrimitive.Thumb
            key={i}
            data-slot="slider-thumb"
            aria-label={thumbLabels?.[i] ?? props["aria-label"]}
            className="group/thumb relative block size-9 cursor-grab outline-none data-[disabled]:cursor-not-allowed [[data-dragging]_&]:cursor-grabbing"
          >
            <span
              data-slot="slider-thumb-block"
              aria-hidden
              style={{ ["--p3d-tilt" as string]: thumbTilts[i % thumbTilts.length] }}
              className="sticker face-ink absolute inset-0 group-data-[disabled]/thumb:[--face:var(--color-ink-soft)] group-data-[disabled]/thumb:sticker-flat"
            />
            {showValue && (
              <span
                data-slot="slider-value"
                aria-hidden
                className="sticker face-paper pointer-events-none absolute bottom-full left-1/2 mb-4 min-w-10 px-2.5 py-1 text-center text-sm font-extrabold whitespace-nowrap tabular-nums"
              >
                {formatValue(v)}
              </span>
            )}
          </SliderPrimitive.Thumb>
        ))}
      </SliderPrimitive.Root>
    );
  }
);
Slider.displayName = "Slider";
