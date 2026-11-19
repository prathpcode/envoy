"use client";
import * as React from "react";
import { Calendar as CalendarIcon, ChevronDown } from "pixelarticons/react";
import { cn } from "../lib/utils";
import { nameTagClasses } from "./input";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Calendar, type CalendarProps, type DateRange } from "./calendar";

/**
 * DatePicker — a name-tag field that opens a Calendar sticker in a Popover.
 * The band carries the label; the white panel shows the picked date.
 * DateRangePicker is the same tag with a two-month range calendar.
 */
const defaultFormat = (d: Date) =>
  d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

interface DateTagProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "value"> {
  label?: React.ReactNode;
  text?: string;
  placeholder: string;
}

const DateTag = React.forwardRef<HTMLButtonElement, DateTagProps>(
  ({ label, text, placeholder, disabled, className, ...props }, ref) => (
    <button
      ref={ref}
      type="button"
      disabled={disabled}
      data-slot="date-picker-trigger"
      className={cn(
        nameTagClasses({ hasBand: Boolean(label), invalid: false, disabled }),
        "cursor-pointer text-left outline-none disabled:cursor-not-allowed",
        className
      )}
      {...props}
    >
      {label && <span className="px-3 pt-1 pb-2 text-base font-bold leading-tight">{label}</span>}
      <span className="flex h-12 items-center gap-2 bg-paper px-3 text-ink">
        <CalendarIcon className="pixel-icon size-6 shrink-0 text-ink-soft" aria-hidden />
        <span className={cn("min-w-0 flex-1 truncate text-lg font-medium", !text && "text-placeholder")}>
          {text || placeholder}
        </span>
        <ChevronDown className="pixel-icon size-6 shrink-0 text-ink-soft" aria-hidden />
      </span>
    </button>
  )
);
DateTag.displayName = "DateTag";

type PassThroughCalendarProps = Omit<CalendarProps, "mode" | "selected" | "onSelect" | "required">;

export interface DatePickerProps {
  value?: Date;
  defaultValue?: Date;
  onValueChange?: (date: Date | undefined) => void;
  /** Band text on the name tag. */
  label?: React.ReactNode;
  placeholder?: string;
  disabled?: boolean;
  formatDate?: (date: Date) => string;
  /** Extra props for the Calendar (disabled days, defaultMonth, locale…). */
  calendarProps?: PassThroughCalendarProps;
  className?: string;
  id?: string;
}

export function DatePicker({
  value,
  defaultValue,
  onValueChange,
  label,
  placeholder = "Pick a date",
  disabled,
  formatDate = defaultFormat,
  calendarProps,
  className,
  id,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);
  const [inner, setInner] = React.useState<Date | undefined>(defaultValue);
  const selected = value !== undefined ? value : inner;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <DateTag
          id={id}
          label={label}
          text={selected ? formatDate(selected) : undefined}
          placeholder={placeholder}
          disabled={disabled}
          className={className}
        />
      </PopoverTrigger>
      <PopoverContent align="start" className="w-auto p-3">
        <Calendar
          {...(calendarProps as object)}
          frame={false}
          mode="single"
          selected={selected}
          defaultMonth={selected ?? calendarProps?.defaultMonth}
          onSelect={(d: Date | undefined) => {
            setInner(d);
            onValueChange?.(d);
            setOpen(false);
          }}
          autoFocus
        />
      </PopoverContent>
    </Popover>
  );
}
DatePicker.displayName = "DatePicker";

export interface DateRangePickerProps extends Omit<DatePickerProps, "value" | "defaultValue" | "onValueChange"> {
  value?: DateRange;
  defaultValue?: DateRange;
  onValueChange?: (range: DateRange | undefined) => void;
  /** Months shown side by side. Default 2. */
  numberOfMonths?: number;
}

export function DateRangePicker({
  value,
  defaultValue,
  onValueChange,
  label,
  placeholder = "Pick dates",
  disabled,
  formatDate = defaultFormat,
  calendarProps,
  numberOfMonths = 2,
  className,
  id,
}: DateRangePickerProps) {
  const [open, setOpen] = React.useState(false);
  const [inner, setInner] = React.useState<DateRange | undefined>(defaultValue);
  const range = value !== undefined ? value : inner;
  const text = range?.from
    ? range.to
      ? `${formatDate(range.from)} – ${formatDate(range.to)}`
      : formatDate(range.from)
    : undefined;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <DateTag id={id} label={label} text={text} placeholder={placeholder} disabled={disabled} className={className} />
      </PopoverTrigger>
      <PopoverContent align="start" className="w-auto max-w-[calc(100vw-2rem)] p-3">
        <Calendar
          {...(calendarProps as object)}
          frame={false}
          mode="range"
          numberOfMonths={numberOfMonths}
          selected={range}
          defaultMonth={range?.from ?? calendarProps?.defaultMonth}
          onSelect={(r: DateRange | undefined) => {
            setInner(r);
            onValueChange?.(r);
          }}
          autoFocus
        />
      </PopoverContent>
    </Popover>
  );
}
DateRangePicker.displayName = "DateRangePicker";
