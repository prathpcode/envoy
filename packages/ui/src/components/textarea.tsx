"use client";
import * as React from "react";
import { cn } from "../lib/utils";
import { nameTagClasses } from "./input";

/**
 * Textarea — the same name-tag sticker as Input, with a taller writing panel.
 * The band carries the label (ink at rest, sky on focus, tomato with the error).
 * `autoGrow` lets the panel grow with the text instead of scrolling. Always straight.
 *
 *   <Textarea label="Project description" autoGrow placeholder="What does it do?" />
 */
export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: React.ReactNode;
  /** Replaces the label in the band while invalid. Name the problem + the fix. */
  error?: React.ReactNode;
  /** Grow with the content instead of scrolling. */
  autoGrow?: boolean;
  wrapperClassName?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, wrapperClassName, label, error, autoGrow = false, id, disabled, onInput, rows = 4, ...props }, ref) => {
    const autoId = React.useId();
    const textareaId = id ?? autoId;
    const invalid = Boolean(error) || props["aria-invalid"] === true || props["aria-invalid"] === "true";
    const hasBand = Boolean(label || error);
    const innerRef = React.useRef<HTMLTextAreaElement | null>(null);

    const setRefs = React.useCallback(
      (node: HTMLTextAreaElement | null) => {
        innerRef.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) ref.current = node;
      },
      [ref]
    );

    const grow = React.useCallback(() => {
      const el = innerRef.current;
      if (!autoGrow || !el) return;
      el.style.height = "auto";
      el.style.height = `${el.scrollHeight}px`;
    }, [autoGrow]);

    // re-measure when a controlled value changes from outside
    React.useLayoutEffect(grow, [grow, props.value]);

    return (
      <div
        data-slot="textarea"
        data-invalid={invalid || undefined}
        data-disabled={disabled || undefined}
        className={cn(nameTagClasses({ hasBand, invalid, disabled }), wrapperClassName)}
      >
        {hasBand && (
          <label htmlFor={textareaId} className="px-3 pt-1 pb-2 text-base font-bold leading-tight">
            {invalid && error ? error : label}
          </label>
        )}
        <div className="flex bg-paper px-3 py-2 text-ink">
          <textarea
            ref={setRefs}
            id={textareaId}
            rows={rows}
            disabled={disabled}
            aria-invalid={invalid || undefined}
            onInput={(e) => {
              grow();
              onInput?.(e);
            }}
            className={cn(
              "min-h-24 w-full min-w-0 flex-1 bg-transparent py-1 text-lg font-medium leading-normal text-ink outline-none placeholder:text-placeholder disabled:cursor-not-allowed",
              autoGrow ? "resize-none overflow-hidden" : "resize-y",
              className
            )}
            {...props}
          />
        </div>
      </div>
    );
  }
);
Textarea.displayName = "Textarea";
