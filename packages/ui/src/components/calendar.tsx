"use client";
import * as React from "react";
import { DayPicker, type ChevronProps, type DayButtonProps, type DateRange } from "react-day-picker";
import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp } from "pixelarticons/react";
import { cn } from "../lib/utils";

export type { DateRange };

/**
 * Calendar — a grid of small square stickers (react-day-picker v10). They lie flat until you
 * hover (peel); the picked day becomes a lime sticker that lands. Today has a pink pixel
 * underline. The grid itself is straight.
 */
export type CalendarProps = React.ComponentProps<typeof DayPicker> & {
  /** Draw the calendar on its own paper sticker. Pass false inside a Popover / Card. */
  frame?: boolean;
};

const navButton =
  "sticker face-paper peel focus-cut sticker-disabled grid size-10 cursor-pointer place-items-center aria-disabled:pointer-events-none";

export function Calendar({
  className,
  classNames,
  components,
  showOutsideDays = true,
  frame = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      data-slot="calendar"
      showOutsideDays={showOutsideDays}
      className={cn("relative w-fit select-none font-p3d text-ink", frame && "sticker sticker-lg face-paper p-5", className)}
      classNames={{
        months: "relative flex flex-col gap-8 sm:flex-row",
        month: "flex flex-col gap-2",
        nav: "absolute inset-x-1.5 top-0.5 z-10 flex items-center justify-between",
        button_previous: cn(navButton, "[--p3d-tilt:-2deg]"),
        button_next: cn(navButton, "[--p3d-tilt:2deg]"),
        month_caption: "flex h-11 items-center justify-center px-14",
        caption_label: "text-lg font-extrabold tracking-[-0.01em]",
        month_grid: "border-separate border-spacing-1.5",
        weekdays: "",
        weekday: "size-10 p-0 text-center align-middle text-sm font-bold text-ink-soft",
        week: "",
        day: "p-0 text-center",
        ...classNames,
      }}
      components={{ Chevron: CalendarChevron, DayButton: CalendarDayButton, ...components }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

function CalendarChevron({ orientation = "left", className }: ChevronProps) {
  const Icon =
    orientation === "left" ? ChevronLeft : orientation === "right" ? ChevronRight : orientation === "up" ? ChevronUp : ChevronDown;
  return <Icon aria-hidden className={cn("pixel-icon size-6", className)} />;
}

/** One day: a small square sticker. Exported so you can swap it via `components.DayButton`. */
export function CalendarDayButton({ className, day, modifiers, onClick, ...props }: DayButtonProps) {
  // only the day you just picked lands; a preselected day (or a new month) is simply there
  const [picked, setPicked] = React.useState(false);
  const ref = React.useRef<HTMLButtonElement>(null);
  React.useEffect(() => {
    if (modifiers.focused) ref.current?.focus();
  }, [modifiers.focused]);

  const isRangeEnd = modifiers.range_start || modifiers.range_end;
  const isMiddle = modifiers.range_middle && !isRangeEnd;
  const lands = modifiers.selected && !isMiddle;

  return (
    <button
      ref={ref}
      data-slot="calendar-day"
      data-day={day.isoDate}
      data-selected-single={(modifiers.selected && !modifiers.range_start && !modifiers.range_end && !modifiers.range_middle) || undefined}
      data-range-start={modifiers.range_start || undefined}
      data-range-end={modifiers.range_end || undefined}
      data-range-middle={isMiddle || undefined}
      className={cn(
        "sticker peel focus-cut relative grid size-10 cursor-pointer place-items-center text-base font-bold tabular-nums",
        lands
          ? cn("face-lime", picked && "animate-land")
          : isMiddle
            ? "sticker-flat [--face:#dff7a6]"
            : modifiers.outside
              ? "sticker-flat [--face:#f6f7f9] text-ink-soft"
              : "sticker-flat [--face:#eef0f3]",
        modifiers.today && "after:absolute after:inset-x-3 after:bottom-1 after:h-1 after:bg-pink",
        modifiers.disabled && "cursor-not-allowed text-ink-soft/60 line-through [--face:#f6f7f9]",
        className
      )}
      onClick={(e) => {
        setPicked(true);
        onClick?.(e);
      }}
      {...props}
    />
  );
}
CalendarDayButton.displayName = "CalendarDayButton";
