"use client";
import * as React from "react";
import { Check, ChevronsVertical } from "pixelarticons/react";
import { cn } from "../lib/utils";
import { nameTagClasses } from "./input";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "./command";

/**
 * Combobox — the shadcn Popover + Command pattern, ready to use. The trigger is a
 * name-tag field; the list highlights with a lime block, and the chosen option lands a
 * lime check-sticker.
 */
export interface ComboboxOption {
  value: string;
  label: string;
  /** a pixelarticons element, e.g. <Robot /> */
  icon?: React.ReactNode;
  disabled?: boolean;
  /** extra search terms */
  keywords?: string[];
}

export interface ComboboxProps {
  options: ComboboxOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** Band text on the name tag. */
  label?: React.ReactNode;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: React.ReactNode;
  disabled?: boolean;
  className?: string;
  id?: string;
}

export function Combobox({
  options,
  value,
  defaultValue = "",
  onValueChange,
  label,
  placeholder = "Pick one",
  searchPlaceholder = "Search…",
  emptyText = "Nothing matches.",
  disabled,
  className,
  id,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [inner, setInner] = React.useState(defaultValue);
  const current = value !== undefined ? value : inner;
  const selected = options.find((o) => o.value === current);

  const choose = (next: string) => {
    const v = next === current ? "" : next;
    setInner(v);
    onValueChange?.(v);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          id={id}
          type="button"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          data-slot="combobox-trigger"
          className={cn(
            nameTagClasses({ hasBand: Boolean(label), invalid: false, disabled }),
            "cursor-pointer text-left outline-none disabled:cursor-not-allowed",
            className
          )}
        >
          {label && <span className="px-3 pt-1 pb-2 text-base font-bold leading-tight">{label}</span>}
          <span className="flex h-12 items-center gap-2 bg-paper px-3 text-ink">
            {selected?.icon && (
              <span className="flex shrink-0 [&_svg]:pixel-icon [&_svg]:size-6">{selected.icon}</span>
            )}
            <span className={cn("min-w-0 flex-1 truncate text-lg font-medium", !selected && "text-placeholder")}>
              {selected ? selected.label : placeholder}
            </span>
            <ChevronsVertical className="pixel-icon size-6 shrink-0 text-ink-soft" aria-hidden />
          </span>
        </button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-(--radix-popover-trigger-width) min-w-72 p-3">
        <Command frame={false}>
          <CommandInput placeholder={searchPlaceholder} aria-label={searchPlaceholder} />
          <CommandList>
            <CommandEmpty>{emptyText}</CommandEmpty>
            <CommandGroup>
              {options.map((o) => (
                <CommandItem
                  key={o.value}
                  value={o.value}
                  keywords={[o.label, ...(o.keywords ?? [])]}
                  disabled={o.disabled}
                  onSelect={() => choose(o.value)}
                >
                  {o.icon}
                  <span className="min-w-0 flex-1 truncate">{o.label}</span>
                  {o.value === current && (
                    <span className="sticker face-lime grid size-6 shrink-0 place-items-center">
                      <Check className="pixel-icon size-4!" aria-hidden />
                    </span>
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
Combobox.displayName = "Combobox";
