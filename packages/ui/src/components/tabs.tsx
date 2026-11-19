"use client";
import * as React from "react";
import { Tabs as TabsPrimitive } from "radix-ui";
import { cn } from "../lib/utils";

/**
 * Tabs — a row of paper stickers; the selected one turns lime, straightens and lies flat.
 * A panel drops in when the user switches to it, never on first render (no flicker on load).
 */
export const Tabs = React.forwardRef<
  React.ComponentRef<typeof TabsPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Root>
>(({ onValueChange, ...props }, ref) => {
  const [switched, setSwitched] = React.useState(false);
  return (
    <TabsPrimitive.Root
      ref={ref}
      data-slot="tabs"
      data-switched={switched ? "" : undefined}
      onValueChange={(v) => {
        setSwitched(true);
        onValueChange?.(v);
      }}
      {...props}
    />
  );
});
Tabs.displayName = "Tabs";

export const TabsList = React.forwardRef<
  React.ComponentRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    data-slot="tabs-list"
    className={cn("inline-flex flex-wrap items-center gap-3 p-1", className)}
    {...props}
  />
));
TabsList.displayName = "TabsList";

const tilts = ["-1.5deg", "1.2deg", "-0.8deg", "1.8deg", "-2deg", "0.9deg"];

export const TabsTrigger = React.forwardRef<
  React.ComponentRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger> & { index?: number }
>(({ className, index = 0, style, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    data-slot="tabs-trigger"
    style={{ ["--p3d-tilt" as string]: tilts[index % tilts.length], ...style }}
    className={cn(
      "sticker sticker-disabled focus-cut peel face-paper inline-flex h-11 cursor-pointer items-center gap-2 px-4 text-[17px] font-extrabold",
      "data-[state=active]:face-lime data-[state=active]:sticker-flat data-[state=active]:[--p3d-tilt:0deg]",
      "[&_svg]:pixel-icon [&_svg]:size-5",
      className
    )}
    {...props}
  />
));
TabsTrigger.displayName = "TabsTrigger";

export const TabsContent = React.forwardRef<
  React.ComponentRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    data-slot="tabs-content"
    className={cn("mt-6 outline-none in-data-switched:data-[state=active]:animate-tab-in", className)}
    {...props}
  />
));
TabsContent.displayName = "TabsContent";
