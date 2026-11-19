"use client";
import * as React from "react";
import { ToggleGroup as ToggleGroupPrimitive } from "radix-ui";
import { type VariantProps } from "class-variance-authority";
import { cn, useTilt, type Tilt } from "../lib/utils";
import { toggleVariants } from "./toggle";

/**
 * ToggleGroup — a row of Toggle stickers (single or multiple). Each pressed item turns lime,
 * lies flat and straightens. variant/size set on the group flow down to every item.
 */
const ToggleGroupContext = React.createContext<VariantProps<typeof toggleVariants>>({
  variant: "default",
  size: "default",
});

export const ToggleGroup = React.forwardRef<
  React.ComponentRef<typeof ToggleGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Root> & VariantProps<typeof toggleVariants>
>(({ className, variant, size, children, ...props }, ref) => {
  const ctx = React.useMemo(() => ({ variant, size }), [variant, size]);
  return (
    <ToggleGroupPrimitive.Root
      ref={ref}
      data-slot="toggle-group"
      data-variant={variant}
      data-size={size}
      className={cn("flex flex-wrap items-center gap-3 p-1", className)}
      {...props}
    >
      <ToggleGroupContext.Provider value={ctx}>{children}</ToggleGroupContext.Provider>
    </ToggleGroupPrimitive.Root>
  );
});
ToggleGroup.displayName = "ToggleGroup";

export const ToggleGroupItem = React.forwardRef<
  React.ComponentRef<typeof ToggleGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Item> &
    VariantProps<typeof toggleVariants> & { tilt?: Tilt }
>(({ className, variant, size, tilt = "auto", style, ...props }, ref) => {
  const ctx = React.useContext(ToggleGroupContext);
  const tiltStyle = useTilt(tilt);
  return (
    <ToggleGroupPrimitive.Item
      ref={ref}
      data-slot="toggle-group-item"
      style={{ ...tiltStyle, ...style }}
      className={cn(toggleVariants({ variant: ctx.variant ?? variant, size: ctx.size ?? size }), className)}
      {...props}
    />
  );
});
ToggleGroupItem.displayName = "ToggleGroupItem";
