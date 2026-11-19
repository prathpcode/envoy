"use client";
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { WarningDiamond } from "pixelarticons/react";
import { cn } from "../lib/utils";
import { Label } from "./label";

/**
 * Field — layout for composing forms on the lid. Name-tag fields (Input, Textarea, Select)
 * carry their own label; use Field + FieldLabel for Switch, Checkbox and RadioGroup.
 * Errors are a tomato sticker that names the problem and the fix.
 *
 *   <FieldSet><FieldLegend>Your team</FieldLegend><FieldGroup>
 *     <Field orientation="horizontal"><Switch id="mentor" /><FieldLabel htmlFor="mentor">Find me a mentor</FieldLabel></Field>
 *   </FieldGroup></FieldSet>
 */
export const FieldSet = React.forwardRef<HTMLFieldSetElement, React.ComponentPropsWithoutRef<"fieldset">>(
  ({ className, ...props }, ref) => (
    <fieldset
      ref={ref}
      data-slot="field-set"
      className={cn("m-0 flex min-w-0 flex-col gap-5 border-0 p-0 disabled:opacity-60", className)}
      {...props}
    />
  )
);
FieldSet.displayName = "FieldSet";

export const FieldLegend = React.forwardRef<
  HTMLLegendElement,
  React.ComponentPropsWithoutRef<"legend"> & { variant?: "legend" | "label" }
>(({ className, variant = "legend", ...props }, ref) => (
  <legend
    ref={ref}
    data-slot="field-legend"
    data-variant={variant}
    className={cn(
      "mb-1 p-0 text-on-lid",
      variant === "legend" ? "text-2xl font-extrabold tracking-[-0.01em]" : "text-[17px] font-bold",
      className
    )}
    {...props}
  />
));
FieldLegend.displayName = "FieldLegend";

export const FieldGroup = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<"div">>(
  ({ className, ...props }, ref) => (
    <div ref={ref} data-slot="field-group" className={cn("flex w-full flex-col gap-6", className)} {...props} />
  )
);
FieldGroup.displayName = "FieldGroup";

export const fieldVariants = cva("group/field flex w-full gap-3", {
  variants: {
    orientation: {
      vertical: "flex-col",
      horizontal: "flex-row items-center [&>[data-slot=field-error]]:basis-full",
      responsive: "flex-col sm:flex-row sm:items-center",
    },
  },
  defaultVariants: { orientation: "vertical" },
});

export const Field = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<"div"> & VariantProps<typeof fieldVariants> & { invalid?: boolean }
>(({ className, orientation = "vertical", invalid, ...props }, ref) => (
  <div
    ref={ref}
    role="group"
    data-slot="field"
    data-orientation={orientation}
    data-invalid={invalid || undefined}
    className={cn(fieldVariants({ orientation }), orientation === "horizontal" && "flex-wrap", className)}
    {...props}
  />
));
Field.displayName = "Field";

export const FieldLabel = React.forwardRef<
  React.ComponentRef<typeof Label>,
  React.ComponentPropsWithoutRef<typeof Label>
>(({ className, ...props }, ref) => (
  <Label ref={ref} data-slot="field-label" className={cn("group-data-[invalid]/field:font-bold", className)} {...props} />
));
FieldLabel.displayName = "FieldLabel";

/** Helper line. Use it only when it prevents an error (The Few Voices Rule). */
export const FieldDescription = React.forwardRef<HTMLParagraphElement, React.ComponentPropsWithoutRef<"p">>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      data-slot="field-description"
      className={cn("text-base font-medium leading-snug text-on-lid-soft", className)}
      {...props}
    />
  )
);
FieldDescription.displayName = "FieldDescription";

export interface FieldErrorProps extends React.ComponentPropsWithoutRef<"div"> {
  /** e.g. from react-hook-form / zod: the first message is shown. */
  errors?: Array<{ message?: string } | undefined>;
}

/** A straight tomato sticker. Write it as problem + fix: "Pick a track so judges can find you". */
export const FieldError = React.forwardRef<HTMLDivElement, FieldErrorProps>(
  ({ className, children, errors, ...props }, ref) => {
    const content = children ?? errors?.find((e) => e?.message)?.message;
    if (!content) return null;
    return (
      <div
        ref={ref}
        role="alert"
        data-slot="field-error"
        className={cn(
          "sticker face-tomato inline-flex w-fit max-w-full items-center gap-2 px-3 py-1.5 text-base font-bold leading-snug animate-drop-in",
          className
        )}
        {...props}
      >
        <WarningDiamond className="pixel-icon size-5 shrink-0" aria-hidden />
        <span>{content}</span>
      </div>
    );
  }
);
FieldError.displayName = "FieldError";
