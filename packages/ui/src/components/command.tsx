"use client";
import * as React from "react";
import { Command as CommandPrimitive } from "cmdk";
import { Search } from "pixelarticons/react";
import { cn } from "../lib/utils";
import { nameTagClasses } from "./input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./dialog";
import { menuSeparatorClass, menuShortcutClass } from "./dropdown-menu";

/**
 * Command — a search name-tag on top of a list (cmdk). The highlighted item gets a lime
 * pixel block: you're choosing where to go. Use CommandDialog for a ⌘K palette.
 */
export const Command = React.forwardRef<
  React.ComponentRef<typeof CommandPrimitive>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive> & {
    /** Draw its own paper sticker. Pass false inside a Dialog / Popover sticker. */
    frame?: boolean;
  }
>(({ className, frame = true, ...props }, ref) => (
  <CommandPrimitive
    ref={ref}
    data-slot="command"
    className={cn("flex w-full flex-col gap-3 text-ink outline-none", frame && "sticker sticker-lg face-paper p-3", className)}
    {...props}
  />
));
Command.displayName = "Command";

export const CommandInput = React.forwardRef<
  React.ComponentRef<typeof CommandPrimitive.Input>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input> & {
    /** Text for the name-tag band. Without it, the tag is plain white. */
    label?: React.ReactNode;
    wrapperClassName?: string;
  }
>(({ className, wrapperClassName, label, ...props }, ref) => (
  <div
    data-slot="command-input-wrapper"
    className={cn(nameTagClasses({ hasBand: Boolean(label), invalid: false }), wrapperClassName)}
  >
    {label && (
      <span aria-hidden className="px-3 pt-1 pb-2 text-base font-bold leading-tight">
        {label}
      </span>
    )}
    <div className="flex h-12 items-center gap-2 bg-paper px-3 text-ink">
      <Search className="pixel-icon size-6 shrink-0 text-ink-soft" aria-hidden />
      <CommandPrimitive.Input
        ref={ref}
        data-slot="command-input"
        aria-label={typeof label === "string" ? label : props["aria-label"]}
        className={cn(
          "h-full min-w-0 flex-1 bg-transparent text-lg font-medium text-ink outline-none placeholder:text-placeholder disabled:cursor-not-allowed",
          className
        )}
        {...props}
      />
    </div>
  </div>
));
CommandInput.displayName = "CommandInput";

export const CommandList = React.forwardRef<
  React.ComponentRef<typeof CommandPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.List>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.List
    ref={ref}
    data-slot="command-list"
    className={cn("max-h-80 scroll-py-2 overflow-x-hidden overflow-y-auto outline-none", className)}
    {...props}
  />
));
CommandList.displayName = "CommandList";

export const CommandEmpty = React.forwardRef<
  React.ComponentRef<typeof CommandPrimitive.Empty>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Empty>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Empty
    ref={ref}
    data-slot="command-empty"
    className={cn("py-8 text-center text-base font-medium text-ink-soft", className)}
    {...props}
  />
));
CommandEmpty.displayName = "CommandEmpty";

export const CommandGroup = React.forwardRef<
  React.ComponentRef<typeof CommandPrimitive.Group>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Group>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Group
    ref={ref}
    data-slot="command-group"
    className={cn(
      "py-1 [&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:pt-2 [&_[cmdk-group-heading]]:pb-1 [&_[cmdk-group-heading]]:text-sm [&_[cmdk-group-heading]]:font-extrabold [&_[cmdk-group-heading]]:text-ink-soft",
      className
    )}
    {...props}
  />
));
CommandGroup.displayName = "CommandGroup";

export const CommandSeparator = React.forwardRef<
  React.ComponentRef<typeof CommandPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Separator
    ref={ref}
    data-slot="command-separator"
    className={cn(menuSeparatorClass, className)}
    {...props}
  />
));
CommandSeparator.displayName = "CommandSeparator";

export const CommandItem = React.forwardRef<
  React.ComponentRef<typeof CommandPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Item>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Item
    ref={ref}
    data-slot="command-item"
    className={cn(
      "notch-fill relative flex h-11 cursor-pointer select-none items-center gap-3 px-3 text-base font-bold outline-none",
      "data-[selected=true]:[--fill:var(--color-lime)]",
      "data-[disabled=true]:pointer-events-none data-[disabled=true]:text-ink-soft/60",
      "[&_svg]:pixel-icon [&_svg]:size-5 [&_svg]:shrink-0",
      className
    )}
    {...props}
  />
));
CommandItem.displayName = "CommandItem";

export const CommandShortcut = ({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) => (
  <span data-slot="command-shortcut" className={cn(menuShortcutClass, className)} {...props} />
);
CommandShortcut.displayName = "CommandShortcut";

export interface CommandDialogProps extends React.ComponentProps<typeof Dialog> {
  /** Screen-reader title for the dialog. */
  title?: string;
  /** Screen-reader description for the dialog. */
  description?: string;
  className?: string;
  showCloseButton?: boolean;
  /** Props for the inner Command (filter, loop, value…). */
  commandProps?: React.ComponentPropsWithoutRef<typeof CommandPrimitive>;
}

export function CommandDialog({
  title = "Command palette",
  description = "Search for a page or an action",
  children,
  className,
  showCloseButton = false,
  commandProps,
  ...props
}: CommandDialogProps) {
  return (
    <Dialog {...props}>
      <DialogContent className={cn("max-w-xl", className)} bodyClassName="p-3" showCloseButton={showCloseButton}>
        <DialogHeader className="sr-only">
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <Command frame={false} {...commandProps}>
          {children}
        </Command>
      </DialogContent>
    </Dialog>
  );
}
CommandDialog.displayName = "CommandDialog";
