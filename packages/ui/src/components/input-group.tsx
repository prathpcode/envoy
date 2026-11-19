"use client";
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/utils";
import { Button, type ButtonProps } from "./button";
import { nameTagClasses } from "./input";

/**
 * InputGroup — a name-tag field whose writing panel holds addons next to the text:
 * a prefix like `https://`, a pixel icon, a Kbd hint or a small Copy button.
 *
 *   <InputGroup label="Demo link">
 *     <InputGroupAddon><InputGroupText>https://</InputGroupText></InputGroupAddon>
 *     <InputGroupInput placeholder="null-pointers.dev" />
 *     <InputGroupAddon align="inline-end"><InputGroupButton aria-label="Copy"><Copy /></InputGroupButton></InputGroupAddon>
 *   </InputGroup>
 */
const InputGroupContext = React.createContext<{ id?: string; invalid: boolean; disabled?: boolean }>({
  invalid: false,
});

export interface InputGroupProps extends React.ComponentPropsWithoutRef<"div"> {
  label?: React.ReactNode;
  /** Replaces the label in the band while invalid. Name the problem + the fix. */
  error?: React.ReactNode;
  disabled?: boolean;
  /** id for the control inside (InputGroupInput / InputGroupTextarea pick it up). */
  controlId?: string;
  /** Classes for the white writing panel. */
  panelClassName?: string;
}

export const InputGroup = React.forwardRef<HTMLDivElement, InputGroupProps>(
  ({ className, panelClassName, label, error, disabled, controlId, children, ...props }, ref) => {
    const autoId = React.useId();
    const id = controlId ?? autoId;
    const invalid = Boolean(error) || props["aria-invalid"] === true || props["aria-invalid"] === "true";
    const hasBand = Boolean(label || error);
    const ctx = React.useMemo(() => ({ id, invalid, disabled }), [id, invalid, disabled]);
    return (
      <InputGroupContext.Provider value={ctx}>
        <div
          ref={ref}
          role="group"
          data-slot="input-group"
          data-invalid={invalid || undefined}
          data-disabled={disabled || undefined}
          className={cn(nameTagClasses({ hasBand, invalid, disabled }), className)}
          {...props}
        >
          {hasBand && (
            <label htmlFor={id} className="px-3 pt-1 pb-2 text-base font-bold leading-tight">
              {invalid && error ? error : label}
            </label>
          )}
          <div
            data-slot="input-group-panel"
            className={cn("flex min-h-12 flex-wrap items-center gap-x-2 bg-paper px-3 text-ink", panelClassName)}
          >
            {children}
          </div>
        </div>
      </InputGroupContext.Provider>
    );
  }
);
InputGroup.displayName = "InputGroup";

export const inputGroupAddonVariants = cva(
  "flex shrink-0 cursor-text select-none items-center gap-2 text-lg font-medium text-ink-soft [&_svg]:pixel-icon [&_svg]:size-6",
  {
    variants: {
      align: {
        "inline-start": "order-first",
        "inline-end": "order-last",
        "block-start": "order-first basis-full pt-3",
        "block-end": "order-last basis-full justify-between pb-3",
      },
    },
    defaultVariants: { align: "inline-start" },
  }
);

export const InputGroupAddon = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<"div"> & VariantProps<typeof inputGroupAddonVariants>
>(({ className, align = "inline-start", onClick, ...props }, ref) => (
  <div
    ref={ref}
    role="group"
    data-slot="input-group-addon"
    data-align={align}
    className={cn(inputGroupAddonVariants({ align }), className)}
    onClick={(e) => {
      onClick?.(e);
      // clicking a text/icon addon writes into the field, like a real label
      if ((e.target as HTMLElement).closest("button")) return;
      e.currentTarget.parentElement?.querySelector<HTMLElement>("input, textarea")?.focus();
    }}
    {...props}
  />
));
InputGroupAddon.displayName = "InputGroupAddon";

export const InputGroupText = React.forwardRef<HTMLSpanElement, React.ComponentPropsWithoutRef<"span">>(
  ({ className, ...props }, ref) => (
    <span
      ref={ref}
      data-slot="input-group-text"
      className={cn("flex items-center gap-2 whitespace-nowrap text-lg font-medium text-ink-soft", className)}
      {...props}
    />
  )
);
InputGroupText.displayName = "InputGroupText";

export interface InputGroupButtonProps extends Omit<ButtonProps, "size"> {
  size?: "sm" | "icon-sm";
}

/** A small, straight sticker button that lives inside the writing panel. */
export const InputGroupButton = React.forwardRef<HTMLButtonElement, InputGroupButtonProps>(
  ({ className, size = "sm", variant = "ink", tilt = false, type = "button", ...props }, ref) => (
    <Button
      ref={ref}
      type={type}
      variant={variant}
      tilt={tilt}
      size={size === "icon-sm" ? "icon" : "sm"}
      data-slot="input-group-button"
      className={cn(size === "icon-sm" ? "size-9 [&_svg]:size-5" : "h-9 px-3 text-base [&_svg]:size-5", className)}
      {...props}
    />
  )
);
InputGroupButton.displayName = "InputGroupButton";

export const InputGroupInput = React.forwardRef<HTMLInputElement, React.ComponentPropsWithoutRef<"input">>(
  ({ className, id, disabled, ...props }, ref) => {
    const ctx = React.useContext(InputGroupContext);
    return (
      <input
        ref={ref}
        id={id ?? ctx.id}
        disabled={disabled ?? ctx.disabled}
        aria-invalid={ctx.invalid || undefined}
        data-slot="input-group-control"
        className={cn(
          "h-12 min-w-0 flex-1 bg-transparent text-lg font-medium text-ink outline-none placeholder:text-placeholder disabled:cursor-not-allowed",
          className
        )}
        {...props}
      />
    );
  }
);
InputGroupInput.displayName = "InputGroupInput";

export const InputGroupTextarea = React.forwardRef<HTMLTextAreaElement, React.ComponentPropsWithoutRef<"textarea">>(
  ({ className, id, disabled, ...props }, ref) => {
    const ctx = React.useContext(InputGroupContext);
    return (
      <textarea
        ref={ref}
        id={id ?? ctx.id}
        disabled={disabled ?? ctx.disabled}
        aria-invalid={ctx.invalid || undefined}
        data-slot="input-group-control"
        className={cn(
          "min-h-24 w-full min-w-0 flex-1 resize-none bg-transparent py-3 text-lg font-medium text-ink outline-none placeholder:text-placeholder disabled:cursor-not-allowed",
          className
        )}
        {...props}
      />
    );
  }
);
InputGroupTextarea.displayName = "InputGroupTextarea";
