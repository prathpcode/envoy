"use client";
import * as React from "react";
import { AlertDialog as AlertDialogPrimitive } from "radix-ui";
import { type VariantProps } from "class-variance-authority";
import { cn, useTilt, type Tilt } from "../lib/utils";
import { buttonVariants } from "./button";

/**
 * AlertDialog — the dialog sticker for a decision that can't be undone. No corner close:
 * you answer it. Confirm a destroy with `variant="destructive"` (tomato); Cancel is paper.
 */
export const AlertDialog = AlertDialogPrimitive.Root;
export const AlertDialogTrigger = AlertDialogPrimitive.Trigger;
export const AlertDialogPortal = AlertDialogPrimitive.Portal;

export const AlertDialogOverlay = React.forwardRef<
  React.ComponentRef<typeof AlertDialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Overlay
    ref={ref}
    data-slot="alert-dialog-overlay"
    className={cn("overlay-fade fixed inset-0 z-50 bg-ink/45", className)}
    {...props}
  />
));
AlertDialogOverlay.displayName = "AlertDialogOverlay";

export const AlertDialogContent = React.forwardRef<
  React.ComponentRef<typeof AlertDialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Content> & { bodyClassName?: string }
>(({ className, bodyClassName, children, ...props }, ref) => (
  <AlertDialogPortal>
    <AlertDialogOverlay />
    <AlertDialogPrimitive.Content
      ref={ref}
      data-slot="alert-dialog-content"
      className={cn(
        "sticker sticker-lg face-paper dialog-motion fixed inset-0 z-50 m-auto flex h-fit max-h-[calc(100dvh-3rem)] w-[calc(100%-2.5rem)] max-w-md flex-col outline-none",
        className
      )}
      {...props}
    >
      <div data-slot="alert-dialog-body" className={cn("flex min-h-0 flex-col gap-6 overflow-y-auto p-7", bodyClassName)}>
        {children}
      </div>
    </AlertDialogPrimitive.Content>
  </AlertDialogPortal>
));
AlertDialogContent.displayName = "AlertDialogContent";

export const AlertDialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div data-slot="alert-dialog-header" className={cn("flex flex-col gap-2", className)} {...props} />
);
AlertDialogHeader.displayName = "AlertDialogHeader";

export const AlertDialogFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    data-slot="alert-dialog-footer"
    className={cn("flex flex-col-reverse gap-4 pt-2 sm:flex-row sm:items-center sm:justify-end", className)}
    {...props}
  />
);
AlertDialogFooter.displayName = "AlertDialogFooter";

export const AlertDialogTitle = React.forwardRef<
  React.ComponentRef<typeof AlertDialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Title
    ref={ref}
    data-slot="alert-dialog-title"
    className={cn("text-2xl font-extrabold leading-tight tracking-[-0.02em]", className)}
    {...props}
  />
));
AlertDialogTitle.displayName = "AlertDialogTitle";

export const AlertDialogDescription = React.forwardRef<
  React.ComponentRef<typeof AlertDialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Description
    ref={ref}
    data-slot="alert-dialog-description"
    className={cn("text-base leading-relaxed text-ink-soft", className)}
    {...props}
  />
));
AlertDialogDescription.displayName = "AlertDialogDescription";

type AlertButtonProps = VariantProps<typeof buttonVariants> & { tilt?: Tilt };

export const AlertDialogAction = React.forwardRef<
  React.ComponentRef<typeof AlertDialogPrimitive.Action>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Action> & AlertButtonProps
>(({ className, variant = "primary", size = "md", tilt = "auto", style, ...props }, ref) => {
  const tiltStyle = useTilt(tilt);
  return (
    <AlertDialogPrimitive.Action
      ref={ref}
      data-slot="alert-dialog-action"
      className={cn(buttonVariants({ variant, size }), className)}
      style={{ ...tiltStyle, ...style }}
      {...props}
    />
  );
});
AlertDialogAction.displayName = "AlertDialogAction";

export const AlertDialogCancel = React.forwardRef<
  React.ComponentRef<typeof AlertDialogPrimitive.Cancel>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Cancel> & AlertButtonProps
>(({ className, variant = "secondary", size = "md", tilt = "auto", style, ...props }, ref) => {
  const tiltStyle = useTilt(tilt);
  return (
    <AlertDialogPrimitive.Cancel
      ref={ref}
      data-slot="alert-dialog-cancel"
      className={cn(buttonVariants({ variant, size }), className)}
      style={{ ...tiltStyle, ...style }}
      {...props}
    />
  );
});
AlertDialogCancel.displayName = "AlertDialogCancel";
