"use client";
import * as React from "react";
import { DropdownMenu as DropdownMenuPrimitive } from "radix-ui";
import { Check, ChevronRight, Circle } from "pixelarticons/react";
import { cn } from "../lib/utils";

/**
 * DropdownMenu — a straight paper sticker of actions. The highlighted item gets a pink
 * pixel block (pink = do it; tomato for destructive items). Checked items land a small
 * lime check-sticker (lime = chosen). Shortcuts sit on paper key caps.
 *
 * The menu* class strings are shared by ContextMenu and Menubar.
 */
export const menuContentClass =
  "sticker sticker-lg face-paper overlay-motion z-50 flex min-w-56 flex-col p-2 text-ink outline-none";

export const menuItemClass = cn(
  "notch-fill relative flex h-10 cursor-pointer select-none items-center gap-3 px-3 text-base font-bold outline-none",
  "data-[highlighted]:[--fill:var(--color-pink)] data-[variant=destructive]:data-[highlighted]:[--fill:var(--color-tomato)]",
  "data-[disabled]:pointer-events-none data-[disabled]:cursor-not-allowed data-[disabled]:text-ink-soft/60",
  "data-[inset]:pl-10 [&_svg]:pixel-icon [&_svg]:size-5 [&_svg]:shrink-0"
);

/** checkbox / radio rows leave room on the left for the landed indicator */
export const menuChoiceItemClass = cn(menuItemClass, "pl-10");

export const menuSubTriggerClass = cn(
  menuItemClass,
  "data-[state=open]:not-data-[highlighted]:[--fill:#eef0f3]"
);

export const menuLabelClass = "px-3 pt-2 pb-1 text-sm font-extrabold text-ink-soft data-[inset]:pl-10";

export const menuSeparatorClass = "pixel-rule mx-2 my-1.5 shrink-0 text-ink/20";

/** a paper key cap with notched corners (the Kbd look); 14px is the floor for key hints */
export const menuShortcutClass =
  "notch-fill ml-auto inline-flex h-7 min-w-7 items-center justify-center px-2 text-sm font-bold tracking-normal text-ink-soft [--fill:#eef0f3]";

/** the lime mini-sticker inside a checked checkbox / radio item. Static: the menu itself drops in, the choice is just there. */
export function MenuChoiceIndicator({ type }: { type: "checkbox" | "radio" }) {
  return (
    <span className="sticker face-lime grid size-6 place-items-center">
      {type === "checkbox" ? (
        <Check className="pixel-icon size-4!" aria-hidden />
      ) : (
        <Circle className="pixel-icon size-4!" aria-hidden />
      )}
    </span>
  );
}

export const DropdownMenu = DropdownMenuPrimitive.Root;
export const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;
export const DropdownMenuGroup = DropdownMenuPrimitive.Group;
export const DropdownMenuPortal = DropdownMenuPrimitive.Portal;
export const DropdownMenuSub = DropdownMenuPrimitive.Sub;
export const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup;

export const DropdownMenuContent = React.forwardRef<
  React.ComponentRef<typeof DropdownMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>
>(({ className, sideOffset = 12, collisionPadding = 16, ...props }, ref) => (
  <DropdownMenuPrimitive.Portal>
    <DropdownMenuPrimitive.Content
      ref={ref}
      data-slot="dropdown-menu-content"
      sideOffset={sideOffset}
      collisionPadding={collisionPadding}
      className={cn(menuContentClass, "origin-(--radix-dropdown-menu-content-transform-origin)", className)}
      {...props}
    />
  </DropdownMenuPrimitive.Portal>
));
DropdownMenuContent.displayName = "DropdownMenuContent";

export const DropdownMenuItem = React.forwardRef<
  React.ComponentRef<typeof DropdownMenuPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> & {
    inset?: boolean;
    variant?: "default" | "destructive";
  }
>(({ className, inset, variant = "default", ...props }, ref) => (
  <DropdownMenuPrimitive.Item
    ref={ref}
    data-slot="dropdown-menu-item"
    data-inset={inset || undefined}
    data-variant={variant}
    className={cn(menuItemClass, className)}
    {...props}
  />
));
DropdownMenuItem.displayName = "DropdownMenuItem";

export const DropdownMenuCheckboxItem = React.forwardRef<
  React.ComponentRef<typeof DropdownMenuPrimitive.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.CheckboxItem>
>(({ className, children, ...props }, ref) => (
  <DropdownMenuPrimitive.CheckboxItem
    ref={ref}
    data-slot="dropdown-menu-checkbox-item"
    className={cn(menuChoiceItemClass, className)}
    {...props}
  >
    <span className="pointer-events-none absolute left-2 grid size-6 place-items-center">
      <DropdownMenuPrimitive.ItemIndicator>
        <MenuChoiceIndicator type="checkbox" />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.CheckboxItem>
));
DropdownMenuCheckboxItem.displayName = "DropdownMenuCheckboxItem";

export const DropdownMenuRadioItem = React.forwardRef<
  React.ComponentRef<typeof DropdownMenuPrimitive.RadioItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.RadioItem>
>(({ className, children, ...props }, ref) => (
  <DropdownMenuPrimitive.RadioItem
    ref={ref}
    data-slot="dropdown-menu-radio-item"
    className={cn(menuChoiceItemClass, className)}
    {...props}
  >
    <span className="pointer-events-none absolute left-2 grid size-6 place-items-center">
      <DropdownMenuPrimitive.ItemIndicator>
        <MenuChoiceIndicator type="radio" />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.RadioItem>
));
DropdownMenuRadioItem.displayName = "DropdownMenuRadioItem";

export const DropdownMenuLabel = React.forwardRef<
  React.ComponentRef<typeof DropdownMenuPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label> & { inset?: boolean }
>(({ className, inset, ...props }, ref) => (
  <DropdownMenuPrimitive.Label
    ref={ref}
    data-slot="dropdown-menu-label"
    data-inset={inset || undefined}
    className={cn(menuLabelClass, className)}
    {...props}
  />
));
DropdownMenuLabel.displayName = "DropdownMenuLabel";

export const DropdownMenuSeparator = React.forwardRef<
  React.ComponentRef<typeof DropdownMenuPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Separator
    ref={ref}
    data-slot="dropdown-menu-separator"
    className={cn(menuSeparatorClass, className)}
    {...props}
  />
));
DropdownMenuSeparator.displayName = "DropdownMenuSeparator";

export const DropdownMenuShortcut = ({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) => (
  <span data-slot="dropdown-menu-shortcut" className={cn(menuShortcutClass, className)} {...props} />
);
DropdownMenuShortcut.displayName = "DropdownMenuShortcut";

export const DropdownMenuSubTrigger = React.forwardRef<
  React.ComponentRef<typeof DropdownMenuPrimitive.SubTrigger>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubTrigger> & { inset?: boolean }
>(({ className, inset, children, ...props }, ref) => (
  <DropdownMenuPrimitive.SubTrigger
    ref={ref}
    data-slot="dropdown-menu-sub-trigger"
    data-inset={inset || undefined}
    className={cn(menuSubTriggerClass, className)}
    {...props}
  >
    {children}
    <ChevronRight className="ml-auto" aria-hidden />
  </DropdownMenuPrimitive.SubTrigger>
));
DropdownMenuSubTrigger.displayName = "DropdownMenuSubTrigger";

export const DropdownMenuSubContent = React.forwardRef<
  React.ComponentRef<typeof DropdownMenuPrimitive.SubContent>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubContent>
>(({ className, sideOffset = 20, alignOffset = -8, collisionPadding = 16, ...props }, ref) => (
  <DropdownMenuPrimitive.Portal>
    <DropdownMenuPrimitive.SubContent
      ref={ref}
      data-slot="dropdown-menu-sub-content"
      sideOffset={sideOffset}
      alignOffset={alignOffset}
      collisionPadding={collisionPadding}
      className={cn(menuContentClass, "origin-(--radix-dropdown-menu-content-transform-origin)", className)}
      {...props}
    />
  </DropdownMenuPrimitive.Portal>
));
DropdownMenuSubContent.displayName = "DropdownMenuSubContent";
