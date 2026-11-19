"use client";
import * as React from "react";
import { NavigationMenu as NavigationMenuPrimitive } from "radix-ui";
import { cva } from "class-variance-authority";
import { ChevronDown } from "pixelarticons/react";
import { cn } from "../lib/utils";

/**
 * NavigationMenu — top-level triggers are paper stickers that peel; the menu itself is a
 * straight paper panel sticker that drops in under them. Same API as shadcn.
 */
export const NavigationMenu = React.forwardRef<
  React.ComponentRef<typeof NavigationMenuPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Root> & { viewport?: boolean }
>(({ className, children, viewport = true, ...props }, ref) => (
  <NavigationMenuPrimitive.Root
    ref={ref}
    data-slot="navigation-menu"
    data-viewport={viewport}
    className={cn("group/navigation-menu relative z-40 flex max-w-full flex-1 items-center justify-center md:max-w-max", className)}
    {...props}
  >
    {children}
    {viewport && <NavigationMenuViewport />}
  </NavigationMenuPrimitive.Root>
));
NavigationMenu.displayName = "NavigationMenu";

export const NavigationMenuList = React.forwardRef<
  React.ComponentRef<typeof NavigationMenuPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.List>
>(({ className, ...props }, ref) => (
  <NavigationMenuPrimitive.List
    ref={ref}
    data-slot="navigation-menu-list"
    className={cn("group flex flex-1 list-none flex-wrap items-center justify-center gap-3 p-1", className)}
    {...props}
  />
));
NavigationMenuList.displayName = "NavigationMenuList";

export const NavigationMenuItem = React.forwardRef<
  React.ComponentRef<typeof NavigationMenuPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Item>
>(({ className, ...props }, ref) => (
  <NavigationMenuPrimitive.Item
    ref={ref}
    data-slot="navigation-menu-item"
    className={cn("relative", className)}
    {...props}
  />
));
NavigationMenuItem.displayName = "NavigationMenuItem";

const tilts = ["-1.4deg", "1.1deg", "-0.7deg", "1.6deg", "-1.8deg", "0.8deg"];

/** Paper peel-sticker styling for top-level triggers and plain top-level links. */
export const navigationMenuTriggerStyle = cva(
  "sticker sticker-disabled focus-cut peel face-paper inline-flex h-11 flex-row cursor-pointer items-center gap-2 px-4 text-[17px] font-extrabold outline-none data-[state=open]:[--p3d-tilt:0deg] data-[active]:face-lime data-[active]:sticker-flat [&_svg]:pixel-icon"
);

export const NavigationMenuTrigger = React.forwardRef<
  React.ComponentRef<typeof NavigationMenuPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Trigger> & { index?: number }
>(({ className, children, index = 0, style, ...props }, ref) => (
  <NavigationMenuPrimitive.Trigger
    ref={ref}
    data-slot="navigation-menu-trigger"
    style={{ ["--p3d-tilt" as string]: tilts[index % tilts.length], ...style }}
    className={cn(navigationMenuTriggerStyle(), "group/trigger", className)}
    {...props}
  >
    {children}
    <ChevronDown
      aria-hidden
      className="size-5 transition-transform duration-[240ms] ease-[steps(3,end)] group-data-[state=open]/trigger:rotate-180"
    />
  </NavigationMenuPrimitive.Trigger>
));
NavigationMenuTrigger.displayName = "NavigationMenuTrigger";

export const NavigationMenuContent = React.forwardRef<
  React.ComponentRef<typeof NavigationMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Content>
>(({ className, ...props }, ref) => (
  <NavigationMenuPrimitive.Content
    ref={ref}
    data-slot="navigation-menu-content"
    className={cn(
      "left-0 top-0 w-full p-4 md:absolute md:w-auto",
      "data-[motion^=from-]:animate-drop-in",
      // without a viewport, the content is its own sticker
      "group-data-[viewport=false]/navigation-menu:sticker group-data-[viewport=false]/navigation-menu:sticker-lg group-data-[viewport=false]/navigation-menu:face-paper group-data-[viewport=false]/navigation-menu:top-full group-data-[viewport=false]/navigation-menu:mt-4 group-data-[viewport=false]/navigation-menu:overlay-motion",
      className
    )}
    {...props}
  />
));
NavigationMenuContent.displayName = "NavigationMenuContent";

export const NavigationMenuViewport = React.forwardRef<
  React.ComponentRef<typeof NavigationMenuPrimitive.Viewport>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Viewport>
>(({ className, ...props }, ref) => (
  <div className="absolute top-full left-0 z-50 flex w-full justify-center pt-4 md:w-auto">
    <NavigationMenuPrimitive.Viewport
      ref={ref}
      data-slot="navigation-menu-viewport"
      className={cn(
        "sticker sticker-lg face-paper overlay-motion relative origin-top",
        "h-[var(--radix-navigation-menu-viewport-height)] w-full md:w-[var(--radix-navigation-menu-viewport-width)]",
        "transition-[width,height] duration-300 ease-out-expo",
        className
      )}
      {...props}
    />
  </div>
));
NavigationMenuViewport.displayName = "NavigationMenuViewport";

export const NavigationMenuLink = React.forwardRef<
  React.ComponentRef<typeof NavigationMenuPrimitive.Link>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Link>
>(({ className, ...props }, ref) => (
  <NavigationMenuPrimitive.Link
    ref={ref}
    data-slot="navigation-menu-link"
    className={cn(
      "flex flex-col gap-1 px-3 py-2.5 text-base font-semibold text-ink outline-none transition-colors",
      "hover:bg-lid-deep/45 focus-visible:bg-sky",
      "data-[active]:bg-lime data-[active]:font-extrabold",
      "[&_svg]:pixel-icon [&_svg]:size-6",
      className
    )}
    {...props}
  />
));
NavigationMenuLink.displayName = "NavigationMenuLink";

export const NavigationMenuIndicator = React.forwardRef<
  React.ComponentRef<typeof NavigationMenuPrimitive.Indicator>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Indicator>
>(({ className, ...props }, ref) => (
  <NavigationMenuPrimitive.Indicator
    ref={ref}
    data-slot="navigation-menu-indicator"
    className={cn("top-full z-[60] flex h-4 items-end justify-center", className)}
    {...props}
  >
    {/* a 3-row pixel caret pointing up at the open trigger */}
    <svg viewBox="0 0 12 6" width="24" height="12" aria-hidden className="pixel-icon translate-y-1 fill-paper">
      <rect x="4" y="0" width="4" height="2" />
      <rect x="2" y="2" width="8" height="2" />
      <rect x="0" y="4" width="12" height="2" />
    </svg>
  </NavigationMenuPrimitive.Indicator>
));
NavigationMenuIndicator.displayName = "NavigationMenuIndicator";
