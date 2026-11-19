"use client";
import * as React from "react";
import { Drawer as DrawerPrimitive } from "vaul";
import { cn } from "../lib/utils";

/**
 * Drawer — a big paper sticker you drag up from the bottom edge (vaul).
 * A checkered pixel grip sits on top; drag it (or the sticker) down to dismiss.
 */
export function Drawer({ shouldScaleBackground = false, ...props }: React.ComponentProps<typeof DrawerPrimitive.Root>) {
  return <DrawerPrimitive.Root shouldScaleBackground={shouldScaleBackground} {...props} />;
}
Drawer.displayName = "Drawer";

export const DrawerTrigger = DrawerPrimitive.Trigger;
export const DrawerPortal = DrawerPrimitive.Portal;
export const DrawerClose = DrawerPrimitive.Close;

export const DrawerOverlay = React.forwardRef<
  React.ComponentRef<typeof DrawerPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Overlay
    ref={ref}
    data-slot="drawer-overlay"
    className={cn("fixed inset-0 z-50 bg-ink/45", className)}
    {...props}
  />
));
DrawerOverlay.displayName = "DrawerOverlay";

/** The pixel grab-handle: two offset rows of 4px blocks. Decorative; vaul drags the whole sticker. */
export function DrawerGrip({ className }: { className?: string }) {
  return (
    <div data-slot="drawer-grip" aria-hidden className={cn("mx-auto flex w-16 flex-col gap-1 text-ink/30", className)}>
      <span className="pixel-rule block w-full" />
      <span className="pixel-rule block w-full [background-position:4px_0]" />
    </div>
  );
}

export const DrawerContent = React.forwardRef<
  React.ComponentRef<typeof DrawerPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Content> & { bodyClassName?: string }
>(({ className, bodyClassName, children, ...props }, ref) => (
  <DrawerPortal>
    <DrawerOverlay />
    <DrawerPrimitive.Content
      ref={ref}
      data-slot="drawer-content"
      className={cn(
        // sits 12px off the bottom edge; --initial-transform pushes it fully off-screen when closed
        "sticker sticker-lg face-paper fixed inset-x-3 bottom-3 z-50 mx-auto flex max-h-[85dvh] max-w-2xl flex-col outline-none [--initial-transform:calc(100%+24px)]",
        className
      )}
      {...props}
    >
      <DrawerGrip className="mt-4" />
      <div data-slot="drawer-body" className={cn("flex min-h-0 flex-col gap-6 overflow-y-auto px-7 pt-4 pb-7", bodyClassName)}>
        {children}
      </div>
    </DrawerPrimitive.Content>
  </DrawerPortal>
));
DrawerContent.displayName = "DrawerContent";

export const DrawerHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div data-slot="drawer-header" className={cn("flex flex-col gap-2 text-center sm:text-left", className)} {...props} />
);
DrawerHeader.displayName = "DrawerHeader";

export const DrawerFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div data-slot="drawer-footer" className={cn("mt-auto flex flex-col gap-4 pt-2 sm:flex-row sm:justify-end", className)} {...props} />
);
DrawerFooter.displayName = "DrawerFooter";

export const DrawerTitle = React.forwardRef<
  React.ComponentRef<typeof DrawerPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Title
    ref={ref}
    data-slot="drawer-title"
    className={cn("text-2xl font-extrabold leading-tight tracking-[-0.02em]", className)}
    {...props}
  />
));
DrawerTitle.displayName = "DrawerTitle";

export const DrawerDescription = React.forwardRef<
  React.ComponentRef<typeof DrawerPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Description
    ref={ref}
    data-slot="drawer-description"
    className={cn("text-base leading-relaxed text-ink-soft", className)}
    {...props}
  />
));
DrawerDescription.displayName = "DrawerDescription";
