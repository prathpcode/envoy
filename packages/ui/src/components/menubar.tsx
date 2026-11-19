"use client";
import * as React from "react";
import { Menubar as MenubarPrimitive } from "radix-ui";
import { ChevronRight } from "pixelarticons/react";
import { cn } from "../lib/utils";
import {
  MenuChoiceIndicator,
  menuChoiceItemClass,
  menuContentClass,
  menuItemClass,
  menuLabelClass,
  menuSeparatorClass,
  menuShortcutClass,
  menuSubTriggerClass,
} from "./dropdown-menu";

/**
 * Menubar — a long, straight paper sticker holding menu triggers. The open trigger gets
 * the pink block; its menu is the same paper sticker as DropdownMenu.
 */
export const Menubar = React.forwardRef<
  React.ComponentRef<typeof MenubarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Root>
>(({ className, ...props }, ref) => (
  <MenubarPrimitive.Root
    ref={ref}
    data-slot="menubar"
    className={cn("sticker sticker-lg face-paper flex h-14 w-fit items-center gap-1 px-2 text-ink", className)}
    {...props}
  />
));
Menubar.displayName = "Menubar";

export const MenubarMenu = MenubarPrimitive.Menu;
export const MenubarGroup = MenubarPrimitive.Group;
export const MenubarPortal = MenubarPrimitive.Portal;
export const MenubarSub = MenubarPrimitive.Sub;
export const MenubarRadioGroup = MenubarPrimitive.RadioGroup;

export const MenubarTrigger = React.forwardRef<
  React.ComponentRef<typeof MenubarPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <MenubarPrimitive.Trigger
    ref={ref}
    data-slot="menubar-trigger"
    className={cn(
      "notch-fill flex h-10 cursor-pointer select-none items-center gap-2 px-3 text-base font-extrabold outline-none",
      "hover:[--fill:#eef0f3] focus-visible:[--fill:#eef0f3] data-[highlighted]:[--fill:#eef0f3] data-[state=open]:[--fill:var(--color-pink)]",
      "[&_svg]:pixel-icon [&_svg]:size-5",
      className
    )}
    {...props}
  />
));
MenubarTrigger.displayName = "MenubarTrigger";

export const MenubarContent = React.forwardRef<
  React.ComponentRef<typeof MenubarPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Content>
>(({ className, align = "start", alignOffset = -8, sideOffset = 20, collisionPadding = 16, ...props }, ref) => (
  <MenubarPrimitive.Portal>
    <MenubarPrimitive.Content
      ref={ref}
      data-slot="menubar-content"
      align={align}
      alignOffset={alignOffset}
      sideOffset={sideOffset}
      collisionPadding={collisionPadding}
      className={cn(menuContentClass, "origin-(--radix-menubar-content-transform-origin)", className)}
      {...props}
    />
  </MenubarPrimitive.Portal>
));
MenubarContent.displayName = "MenubarContent";

export const MenubarItem = React.forwardRef<
  React.ComponentRef<typeof MenubarPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Item> & {
    inset?: boolean;
    variant?: "default" | "destructive";
  }
>(({ className, inset, variant = "default", ...props }, ref) => (
  <MenubarPrimitive.Item
    ref={ref}
    data-slot="menubar-item"
    data-inset={inset || undefined}
    data-variant={variant}
    className={cn(menuItemClass, className)}
    {...props}
  />
));
MenubarItem.displayName = "MenubarItem";

export const MenubarCheckboxItem = React.forwardRef<
  React.ComponentRef<typeof MenubarPrimitive.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.CheckboxItem>
>(({ className, children, ...props }, ref) => (
  <MenubarPrimitive.CheckboxItem
    ref={ref}
    data-slot="menubar-checkbox-item"
    className={cn(menuChoiceItemClass, className)}
    {...props}
  >
    <span className="pointer-events-none absolute left-2 grid size-6 place-items-center">
      <MenubarPrimitive.ItemIndicator>
        <MenuChoiceIndicator type="checkbox" />
      </MenubarPrimitive.ItemIndicator>
    </span>
    {children}
  </MenubarPrimitive.CheckboxItem>
));
MenubarCheckboxItem.displayName = "MenubarCheckboxItem";

export const MenubarRadioItem = React.forwardRef<
  React.ComponentRef<typeof MenubarPrimitive.RadioItem>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.RadioItem>
>(({ className, children, ...props }, ref) => (
  <MenubarPrimitive.RadioItem
    ref={ref}
    data-slot="menubar-radio-item"
    className={cn(menuChoiceItemClass, className)}
    {...props}
  >
    <span className="pointer-events-none absolute left-2 grid size-6 place-items-center">
      <MenubarPrimitive.ItemIndicator>
        <MenuChoiceIndicator type="radio" />
      </MenubarPrimitive.ItemIndicator>
    </span>
    {children}
  </MenubarPrimitive.RadioItem>
));
MenubarRadioItem.displayName = "MenubarRadioItem";

export const MenubarLabel = React.forwardRef<
  React.ComponentRef<typeof MenubarPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Label> & { inset?: boolean }
>(({ className, inset, ...props }, ref) => (
  <MenubarPrimitive.Label
    ref={ref}
    data-slot="menubar-label"
    data-inset={inset || undefined}
    className={cn(menuLabelClass, className)}
    {...props}
  />
));
MenubarLabel.displayName = "MenubarLabel";

export const MenubarSeparator = React.forwardRef<
  React.ComponentRef<typeof MenubarPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <MenubarPrimitive.Separator
    ref={ref}
    data-slot="menubar-separator"
    className={cn(menuSeparatorClass, className)}
    {...props}
  />
));
MenubarSeparator.displayName = "MenubarSeparator";

export const MenubarShortcut = ({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) => (
  <span data-slot="menubar-shortcut" className={cn(menuShortcutClass, className)} {...props} />
);
MenubarShortcut.displayName = "MenubarShortcut";

export const MenubarSubTrigger = React.forwardRef<
  React.ComponentRef<typeof MenubarPrimitive.SubTrigger>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.SubTrigger> & { inset?: boolean }
>(({ className, inset, children, ...props }, ref) => (
  <MenubarPrimitive.SubTrigger
    ref={ref}
    data-slot="menubar-sub-trigger"
    data-inset={inset || undefined}
    className={cn(menuSubTriggerClass, className)}
    {...props}
  >
    {children}
    <ChevronRight className="ml-auto" aria-hidden />
  </MenubarPrimitive.SubTrigger>
));
MenubarSubTrigger.displayName = "MenubarSubTrigger";

export const MenubarSubContent = React.forwardRef<
  React.ComponentRef<typeof MenubarPrimitive.SubContent>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.SubContent>
>(({ className, sideOffset = 20, alignOffset = -8, collisionPadding = 16, ...props }, ref) => (
  <MenubarPrimitive.Portal>
    <MenubarPrimitive.SubContent
      ref={ref}
      data-slot="menubar-sub-content"
      sideOffset={sideOffset}
      alignOffset={alignOffset}
      collisionPadding={collisionPadding}
      className={cn(menuContentClass, "origin-(--radix-menubar-content-transform-origin)", className)}
      {...props}
    />
  </MenubarPrimitive.Portal>
));
MenubarSubContent.displayName = "MenubarSubContent";
