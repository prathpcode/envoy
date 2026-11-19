"use client";
import * as React from "react";
import { Dialog as DialogPrimitive } from "radix-ui";
import { Close } from "pixelarticons/react";
import { cn } from "../lib/utils";

/**
 * Dialog — a big paper sticker slapped onto the screen over a 45% ink overlay.
 * It drops in a little crooked and settles straight (dialog bodies never tilt);
 * closing lifts it off. The close button is a small paper sticker stuck on the corner.
 */
export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogPortal = DialogPrimitive.Portal;
export const DialogClose = DialogPrimitive.Close;

export const DialogOverlay = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    data-slot="dialog-overlay"
    className={cn("overlay-fade fixed inset-0 z-50 bg-ink/45", className)}
    {...props}
  />
));
DialogOverlay.displayName = "DialogOverlay";

export interface DialogContentProps extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> {
  /** Show the corner close sticker. Default true. */
  showCloseButton?: boolean;
  /** Classes for the inner scroll body (padding, gap). The sticker itself never clips. */
  bodyClassName?: string;
}

export const DialogContent = React.forwardRef<React.ComponentRef<typeof DialogPrimitive.Content>, DialogContentProps>(
  ({ className, bodyClassName, children, showCloseButton = true, ...props }, ref) => (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Content
        ref={ref}
        data-slot="dialog-content"
        className={cn(
          "sticker sticker-lg face-paper dialog-motion fixed inset-0 z-50 m-auto flex h-fit max-h-[calc(100dvh-3rem)] w-[calc(100%-2.5rem)] max-w-lg flex-col outline-none",
          className
        )}
        {...props}
      >
        {/* scroll lives on an inner wrapper: overflow on a sticker would clip its stepped corners */}
        <div data-slot="dialog-body" className={cn("flex min-h-0 flex-col gap-6 overflow-y-auto p-7", bodyClassName)}>
          {children}
        </div>
        {showCloseButton && (
          <DialogPrimitive.Close
            data-slot="dialog-close"
            aria-label="Close"
            className="sticker face-paper peel focus-cut absolute -top-3 -right-3 grid size-11 cursor-pointer place-items-center [--p3d-tilt:2.5deg]"
          >
            <Close className="pixel-icon size-6" aria-hidden />
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Content>
    </DialogPortal>
  )
);
DialogContent.displayName = "DialogContent";

export const DialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div data-slot="dialog-header" className={cn("flex flex-col gap-2 pr-4", className)} {...props} />
);
DialogHeader.displayName = "DialogHeader";

export const DialogFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    data-slot="dialog-footer"
    className={cn("flex flex-col-reverse gap-4 pt-2 sm:flex-row sm:items-center sm:justify-end", className)}
    {...props}
  />
);
DialogFooter.displayName = "DialogFooter";

export const DialogTitle = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    data-slot="dialog-title"
    className={cn("text-2xl font-extrabold leading-tight tracking-[-0.02em]", className)}
    {...props}
  />
));
DialogTitle.displayName = "DialogTitle";

export const DialogDescription = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    data-slot="dialog-description"
    className={cn("text-base leading-relaxed text-ink-soft", className)}
    {...props}
  />
));
DialogDescription.displayName = "DialogDescription";
