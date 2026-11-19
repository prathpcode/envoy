import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Check, InfoBox, SquareAlert, WarningDiamond } from "pixelarticons/react";
import { cn } from "../lib/utils";

/**
 * Alert — a straight sticker with a leading pixel icon. The face carries the meaning:
 * info = sky, success = lime, warning = butter, destructive = tomato, default = paper.
 * One title, one line. Pass `icon` to swap the pixel icon, or icon={false} to drop it.
 *
 *   <Alert variant="warning"><AlertTitle>Submissions close at 09:00</AlertTitle></Alert>
 */
export const alertVariants = cva("sticker sticker-lg flex w-full items-start gap-4 px-6 py-5 text-ink", {
  variants: {
    variant: {
      default: "face-paper",
      info: "face-sky",
      success: "face-lime",
      warning: "face-butter",
      destructive: "face-tomato",
    },
  },
  defaultVariants: { variant: "default" },
});

const icons = {
  default: InfoBox,
  info: InfoBox,
  success: Check,
  warning: WarningDiamond,
  destructive: SquareAlert,
} as const;

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof alertVariants> {
  /** Replace the pixel icon, or false for none. */
  icon?: React.ReactNode | false;
}

export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant, icon, role, children, ...props }, ref) => {
    const v = variant ?? "default";
    const Icon = icons[v];
    return (
      <div
        ref={ref}
        data-slot="alert"
        data-variant={v}
        role={role ?? (v === "destructive" || v === "warning" ? "alert" : "status")}
        className={cn(alertVariants({ variant }), className)}
        {...props}
      >
        {icon === false ? null : (
          <span aria-hidden className="mt-0.5 flex shrink-0 [&_svg]:pixel-icon [&_svg]:size-6">
            {icon ?? <Icon />}
          </span>
        )}
        <div className="flex min-w-0 flex-1 flex-col gap-1">{children}</div>
      </div>
    );
  }
);
Alert.displayName = "Alert";

export const AlertTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h5
      ref={ref}
      data-slot="alert-title"
      className={cn("text-lg font-extrabold leading-snug tracking-[-0.01em]", className)}
      {...props}
    />
  )
);
AlertTitle.displayName = "AlertTitle";

export const AlertDescription = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="alert-description"
      className={cn("text-base font-medium leading-relaxed", className)}
      {...props}
    />
  )
);
AlertDescription.displayName = "AlertDescription";
