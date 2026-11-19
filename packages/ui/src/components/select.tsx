"use client";
import * as React from "react";
import { Select as SelectPrimitive } from "radix-ui";
import { Check, ChevronDown, ChevronUp } from "pixelarticons/react";
import { cn } from "../lib/utils";
import { nameTagClasses } from "./input";

/**
 * Select — Radix Select dressed as stickers.
 * With a `label`, the trigger is a name-tag field (band + white writing panel).
 * Without one, it's a straight paper sticker with a pixel chevron.
 * The list is a straight paper sticker that drops in; the chosen item lands a lime check-sticker.
 *
 *   <Select><SelectTrigger label="Track"><SelectValue placeholder="Pick one" /></SelectTrigger>
 *     <SelectContent><SelectItem value="ai">AI</SelectItem></SelectContent></Select>
 */
export const Select = SelectPrimitive.Root;
export const SelectGroup = SelectPrimitive.Group;

export const SelectValue = React.forwardRef<
  React.ComponentRef<typeof SelectPrimitive.Value>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Value>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Value ref={ref} data-slot="select-value" className={cn("truncate", className)} {...props} />
));
SelectValue.displayName = "SelectValue";

export interface SelectTriggerProps extends React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger> {
  /** Name-tag band text. Without it the trigger is a plain paper sticker: pass aria-label. */
  label?: React.ReactNode;
  /** Replaces the label in the band while invalid. Name the problem + the fix. */
  error?: React.ReactNode;
  /** Height of the bare (no-label) trigger. */
  size?: "sm" | "default";
  wrapperClassName?: string;
}

const chevron = (
  <SelectPrimitive.Icon asChild>
    <ChevronDown
      className="pixel-icon size-6 shrink-0 text-ink transition-transform duration-200 ease-peel group-data-[state=open]/trigger:rotate-180"
      aria-hidden
    />
  </SelectPrimitive.Icon>
);

export const SelectTrigger = React.forwardRef<React.ComponentRef<typeof SelectPrimitive.Trigger>, SelectTriggerProps>(
  ({ className, wrapperClassName, label, error, size = "default", id, disabled, children, ...props }, ref) => {
    const autoId = React.useId();
    const triggerId = id ?? autoId;
    const invalid = Boolean(error) || props["aria-invalid"] === true || props["aria-invalid"] === "true";
    const hasBand = Boolean(label || error);

    if (!hasBand) {
      return (
        <SelectPrimitive.Trigger
          ref={ref}
          id={triggerId}
          disabled={disabled}
          data-slot="select-trigger"
          data-size={size}
          aria-invalid={invalid || undefined}
          style={{ ["--p3d-tilt" as string]: "0deg" }}
          className={cn(
            "group/trigger sticker sticker-disabled focus-cut peel face-paper inline-flex w-fit min-w-40 cursor-pointer items-center justify-between gap-3 text-left font-semibold text-ink",
            "data-[placeholder]:text-ink-soft [&_svg]:pixel-icon",
            size === "sm" ? "h-10 px-3 text-base" : "h-12 px-4 text-lg",
            invalid && "face-tomato",
            className
          )}
          {...props}
        >
          {children}
          {chevron}
        </SelectPrimitive.Trigger>
      );
    }

    return (
      <div
        data-slot="select-field"
        data-invalid={invalid || undefined}
        data-disabled={disabled || undefined}
        className={cn(nameTagClasses({ hasBand, invalid, disabled }), wrapperClassName)}
      >
        <label htmlFor={triggerId} className="px-3 pt-1 pb-2 text-base font-bold leading-tight">
          {invalid && error ? error : label}
        </label>
        <SelectPrimitive.Trigger
          ref={ref}
          id={triggerId}
          disabled={disabled}
          data-slot="select-trigger"
          aria-invalid={invalid || undefined}
          className={cn(
            "group/trigger flex h-12 w-full min-w-0 cursor-pointer items-center justify-between gap-3 bg-paper px-3 text-left text-lg font-medium text-ink outline-none",
            "data-[placeholder]:text-placeholder disabled:cursor-not-allowed",
            className
          )}
          {...props}
        >
          {children}
          {chevron}
        </SelectPrimitive.Trigger>
      </div>
    );
  }
);
SelectTrigger.displayName = "SelectTrigger";

export const SelectScrollUpButton = React.forwardRef<
  React.ComponentRef<typeof SelectPrimitive.ScrollUpButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollUpButton
    ref={ref}
    data-slot="select-scroll-up-button"
    className={cn("flex h-8 cursor-default items-center justify-center text-ink", className)}
    {...props}
  >
    <ChevronUp className="pixel-icon size-5" aria-hidden />
  </SelectPrimitive.ScrollUpButton>
));
SelectScrollUpButton.displayName = "SelectScrollUpButton";

export const SelectScrollDownButton = React.forwardRef<
  React.ComponentRef<typeof SelectPrimitive.ScrollDownButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollDownButton
    ref={ref}
    data-slot="select-scroll-down-button"
    className={cn("flex h-8 cursor-default items-center justify-center text-ink", className)}
    {...props}
  >
    <ChevronDown className="pixel-icon size-5" aria-hidden />
  </SelectPrimitive.ScrollDownButton>
));
SelectScrollDownButton.displayName = "SelectScrollDownButton";

export const SelectContent = React.forwardRef<
  React.ComponentRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = "popper", sideOffset = 12, ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      data-slot="select-content"
      position={position}
      sideOffset={position === "popper" ? sideOffset : undefined}
      className={cn(
        // never overflow-hidden on a sticker: the Viewport inside does the scrolling
        "sticker sticker-lg face-paper overlay-motion relative z-50 flex max-h-(--radix-select-content-available-height) min-w-[12rem] flex-col p-2 text-ink",
        position === "popper" && "min-w-(--radix-select-trigger-width)",
        className
      )}
      {...props}
    >
      <SelectScrollUpButton />
      <SelectPrimitive.Viewport data-slot="select-viewport" className="flex flex-col gap-1 p-1">
        {children}
      </SelectPrimitive.Viewport>
      <SelectScrollDownButton />
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
));
SelectContent.displayName = "SelectContent";

export const SelectLabel = React.forwardRef<
  React.ComponentRef<typeof SelectPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    data-slot="select-label"
    className={cn("px-3 pt-2 pb-1 text-base font-bold text-ink-soft", className)}
    {...props}
  />
));
SelectLabel.displayName = "SelectLabel";

export const SelectItem = React.forwardRef<
  React.ComponentRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    data-slot="select-item"
    className={cn(
      "relative flex min-h-11 w-full cursor-pointer select-none items-center gap-3 py-2 pr-12 pl-3 text-[17px] font-semibold text-ink outline-none",
      "data-[highlighted]:bg-sky/30 data-[state=checked]:font-extrabold",
      "data-[disabled]:cursor-not-allowed data-[disabled]:text-ink-soft data-[disabled]:opacity-70",
      "[&_svg]:pixel-icon [&_svg]:size-5",
      className
    )}
    {...props}
  >
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    <SelectPrimitive.ItemIndicator
      data-slot="select-item-indicator"
      className="absolute right-2 grid size-7 place-items-center bg-lime text-ink shadow-[0_2px_0_rgb(var(--p3d-shadow)/0.25)]"
    >
      <Check className="pixel-icon size-5" aria-hidden />
    </SelectPrimitive.ItemIndicator>
  </SelectPrimitive.Item>
));
SelectItem.displayName = "SelectItem";

export const SelectSeparator = React.forwardRef<
  React.ComponentRef<typeof SelectPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator
    ref={ref}
    data-slot="select-separator"
    className={cn("pixel-rule mx-2 my-2 text-ink-soft/40", className)}
    {...props}
  />
));
SelectSeparator.displayName = "SelectSeparator";
