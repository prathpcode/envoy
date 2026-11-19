import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/utils";
import { PixelSpinner } from "./button";

/**
 * Spinner — the 8-block pixel spinner, turning in steps(). It announces itself as a
 * status with a label (screen-reader only unless you pass visible children).
 * Sizes are multiples of its 10-cell grid (20 / 30 / 40px) so every block stays crisp.
 *
 *   <Spinner />                                   // "Loading" for screen readers
 *   <Spinner size="lg" label="Building your demo" />
 *   <Spinner>Judging in progress</Spinner>
 */
const spinnerSizes = { sm: 20, md: 30, lg: 40 } as const;

export const spinnerVariants = cva("inline-flex items-center gap-3 font-bold", {
  variants: {
    size: { sm: "text-sm", md: "text-base", lg: "text-lg" },
  },
  defaultVariants: { size: "md" },
});

export interface SpinnerProps extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof spinnerVariants> {
  /** Accessible name. Defaults to the text children, then "Loading". */
  label?: string;
}

export const Spinner = React.forwardRef<HTMLSpanElement, SpinnerProps>(
  ({ className, size, label, children, ...props }, ref) => {
    const name = label ?? (typeof children === "string" ? children : "Loading");
    return (
      <span
        ref={ref}
        data-slot="spinner"
        role="status"
        aria-label={name}
        aria-live="polite"
        className={cn(spinnerVariants({ size }), className)}
        {...props}
      >
        <PixelSpinner size={spinnerSizes[size ?? "md"]} />
        {children ? <span aria-hidden>{children}</span> : null}
      </span>
    );
  }
);
Spinner.displayName = "Spinner";
