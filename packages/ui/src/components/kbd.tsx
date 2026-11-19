import * as React from "react";
import { cn } from "../lib/utils";

/**
 * Kbd — a key cap: a tiny straight paper sticker with a stepped pixel lip along the bottom.
 * KbdGroup spaces caps for a shortcut. Text never drops below 14px.
 *
 *   <KbdGroup><Kbd>Ctrl</Kbd><Kbd>K</Kbd></KbdGroup>
 */
export const Kbd = React.forwardRef<HTMLElement, React.ComponentPropsWithoutRef<"kbd">>(
  ({ className, ...props }, ref) => (
    <kbd
      ref={ref}
      data-slot="kbd"
      className={cn(
        "sticker face-paper pointer-events-none inline-flex h-8 min-w-8 shrink-0 select-none items-center justify-center gap-1 px-2 pb-1 align-middle font-p3d text-sm font-bold leading-none text-ink",
        // the lip: a 4px recessed band inside the notched corners
        "after:pointer-events-none after:absolute after:inset-x-1 after:bottom-0 after:h-1 after:bg-[#bfc4cc] after:content-['']",
        "[&_svg]:pixel-icon [&_svg]:size-4",
        className
      )}
      {...props}
    />
  )
);
Kbd.displayName = "Kbd";

export const KbdGroup = React.forwardRef<HTMLElement, React.ComponentPropsWithoutRef<"kbd">>(
  ({ className, ...props }, ref) => (
    <kbd
      ref={ref}
      data-slot="kbd-group"
      className={cn("inline-flex items-center gap-3 align-middle font-p3d", className)}
      {...props}
    />
  )
);
KbdGroup.displayName = "KbdGroup";
