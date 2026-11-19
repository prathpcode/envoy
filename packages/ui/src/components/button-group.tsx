import * as React from "react";
import { cn } from "../lib/utils";

/**
 * ButtonGroup — fuses Buttons edge to edge into one straight sticker strip: a single
 * kiss-cut around the whole strip, ink pixel dividers between segments. Each Button keeps
 * its ink. The fusing styles live in styles/navigation.css (`[data-slot="button-group"]`).
 */
export interface ButtonGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: "horizontal" | "vertical";
}

export const ButtonGroup = React.forwardRef<HTMLDivElement, ButtonGroupProps>(
  ({ className, orientation = "horizontal", ...props }, ref) => (
    <div
      ref={ref}
      role="group"
      data-slot="button-group"
      data-orientation={orientation}
      className={cn(
        "sticker face-paper inline-flex w-fit items-stretch",
        orientation === "vertical" ? "flex-col" : "flex-row",
        className
      )}
      {...props}
    />
  )
);
ButtonGroup.displayName = "ButtonGroup";

/** A non-interactive paper segment in the strip: a count, a unit, a label. */
export const ButtonGroupText = React.forwardRef<HTMLSpanElement, React.HTMLAttributes<HTMLSpanElement>>(
  ({ className, ...props }, ref) => (
    <span
      ref={ref}
      data-slot="button-group-text"
      className={cn(
        "sticker face-paper inline-flex items-center gap-2 px-4 text-base font-extrabold tabular-nums [&_svg]:pixel-icon [&_svg]:size-5",
        className
      )}
      {...props}
    />
  )
);
ButtonGroupText.displayName = "ButtonGroupText";
