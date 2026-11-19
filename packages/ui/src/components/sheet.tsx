"use client";
import * as React from "react";
import { Dialog as SheetPrimitive } from "radix-ui";
import { cva, type VariantProps } from "class-variance-authority";
import { Close } from "pixelarticons/react";
import { cn } from "../lib/utils";

/**
 * Sheet — a big paper sticker that slides in from an edge and settles straight.
 * It sits 12px off the screen edge so the whole kiss-cut shows: a sticker, not a panel.
 */
export const Sheet = SheetPrimitive.Root;
export const SheetTrigger = SheetPrimitive.Trigger;
export const SheetClose = SheetPrimitive.Close;
export const SheetPortal = SheetPrimitive.Portal;

export const SheetOverlay = React.forwardRef<
  React.ComponentRef<typeof SheetPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Overlay
    ref={ref}
    data-slot="sheet-overlay"
    className={cn("overlay-fade fixed inset-0 z-50 bg-ink/45", className)}
    {...props}
  />
));
SheetOverlay.displayName = "SheetOverlay";

export const sheetVariants = cva(
  "sticker sticker-lg face-paper sheet-motion fixed z-50 flex flex-col outline-none",
  {
    variants: {
      side: {
        top: "inset-x-3 top-3 max-h-[calc(100dvh-1.5rem)]",
        bottom: "inset-x-3 bottom-3 max-h-[calc(100dvh-1.5rem)]",
        left: "inset-y-3 left-3 w-[calc(100%-1.5rem)] max-w-md",
        right: "inset-y-3 right-3 w-[calc(100%-1.5rem)] max-w-md",
      },
    },
    defaultVariants: { side: "right" },
  }
);

export interface SheetContentProps
  extends React.ComponentPropsWithoutRef<typeof SheetPrimitive.Content>,
    VariantProps<typeof sheetVariants> {
  showCloseButton?: boolean;
  bodyClassName?: string;
}

export const SheetContent = React.forwardRef<React.ComponentRef<typeof SheetPrimitive.Content>, SheetContentProps>(
  ({ side = "right", className, bodyClassName, children, showCloseButton = true, ...props }, ref) => (
    <SheetPortal>
      <SheetOverlay />
      <SheetPrimitive.Content
        ref={ref}
        data-slot="sheet-content"
        data-side={side}
        className={cn(sheetVariants({ side }), className)}
        {...props}
      >
        <div data-slot="sheet-body" className={cn("flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto p-7", bodyClassName)}>
          {children}
        </div>
        {showCloseButton && (
          <SheetPrimitive.Close
            data-slot="sheet-close"
            aria-label="Close"
            className="sticker face-paper peel focus-cut absolute top-5 right-5 grid size-11 cursor-pointer place-items-center [--p3d-tilt:2.5deg]"
          >
            <Close className="pixel-icon size-6" aria-hidden />
          </SheetPrimitive.Close>
        )}
      </SheetPrimitive.Content>
    </SheetPortal>
  )
);
SheetContent.displayName = "SheetContent";

export const SheetHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div data-slot="sheet-header" className={cn("flex flex-col gap-2 pr-14", className)} {...props} />
);
SheetHeader.displayName = "SheetHeader";

export const SheetFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    data-slot="sheet-footer"
    className={cn("mt-auto flex flex-col-reverse gap-4 pt-2 sm:flex-row sm:items-center sm:justify-end", className)}
    {...props}
  />
);
SheetFooter.displayName = "SheetFooter";

export const SheetTitle = React.forwardRef<
  React.ComponentRef<typeof SheetPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Title>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Title
    ref={ref}
    data-slot="sheet-title"
    className={cn("text-2xl font-extrabold leading-tight tracking-[-0.02em]", className)}
    {...props}
  />
));
SheetTitle.displayName = "SheetTitle";

export const SheetDescription = React.forwardRef<
  React.ComponentRef<typeof SheetPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Description>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Description
    ref={ref}
    data-slot="sheet-description"
    className={cn("text-base leading-relaxed text-ink-soft", className)}
    {...props}
  />
));
SheetDescription.displayName = "SheetDescription";
