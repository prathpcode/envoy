"use client";
import * as React from "react";
import { cn } from "../lib/utils";

/**
 * Input — a name-tag sticker. The label lives in the coloured band ("HELLO my name is");
 * you write on the white panel below. The band carries state:
 * rest = ink, focus = sky, invalid = tomato (band shows the error), disabled = blank.
 * Fields never tilt (The Crooked Rule).
 *
 *   <Input label="Team name" placeholder="Null Pointers" />
 *   <Input aria-label="Search" leading={<Search />} />   // no band: a plain white tag
 */
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: React.ReactNode;
  /** Replaces the label in the band while invalid. Name the problem + the fix. */
  error?: React.ReactNode;
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
  wrapperClassName?: string;
}

export function nameTagClasses({ hasBand, invalid, disabled }: { hasBand: boolean; invalid: boolean; disabled?: boolean }) {
  return cn(
    "group/tag sticker sticker-lg focus-within-cut flex w-full flex-col p-2",
    hasBand ? "face-ink focus-within:face-sky focus-within:text-ink" : "face-paper",
    invalid && "face-tomato focus-within:face-tomato text-ink",
    disabled && "[--face:#e4e6ea] text-ink-soft"
  );
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, wrapperClassName, label, error, trailing, leading, id, disabled, ...props }, ref) => {
    const autoId = React.useId();
    const inputId = id ?? autoId;
    const invalid = Boolean(error) || props["aria-invalid"] === true || props["aria-invalid"] === "true";
    const hasBand = Boolean(label || error);
    return (
      <div
        data-slot="input"
        data-invalid={invalid || undefined}
        data-disabled={disabled || undefined}
        className={cn(nameTagClasses({ hasBand, invalid, disabled }), wrapperClassName)}
      >
        {hasBand && (
          <label htmlFor={inputId} className="px-3 pt-1 pb-2 text-base font-bold leading-tight">
            {invalid && error ? error : label}
          </label>
        )}
        <div className="flex h-12 items-center gap-2 bg-paper px-3 text-ink">
          {leading && <span className="flex shrink-0 text-ink-soft [&_svg]:pixel-icon [&_svg]:size-6">{leading}</span>}
          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            aria-invalid={invalid || undefined}
            className={cn(
              "h-full min-w-0 flex-1 bg-transparent text-lg font-medium text-ink outline-none placeholder:text-placeholder disabled:cursor-not-allowed",
              className
            )}
            {...props}
          />
          {trailing && (
            <span className="flex shrink-0 items-center text-ink-soft [&_svg]:pixel-icon [&_svg]:size-6">{trailing}</span>
          )}
        </div>
      </div>
    );
  }
);
Input.displayName = "Input";
