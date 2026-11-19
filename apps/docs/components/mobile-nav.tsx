"use client";
import * as React from "react";
import { Menu, Close } from "pixelarticons/react";
import { usePathname } from "next/navigation";
import { Button } from "@pixel3d/ui";

/** Mobile docs nav: a full-height lid panel holding the same nav tree. */
export function MobileNav({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  const pathname = usePathname();
  React.useEffect(() => setOpen(false), [pathname]);
  return (
    <div className="lg:hidden">
      <Button variant="secondary" size="icon" tilt={false} aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} onClick={() => setOpen((o) => !o)}>
        {open ? <Close /> : <Menu />}
      </Button>
      {open && (
        <div className="fixed inset-x-0 top-20 bottom-0 z-50 overflow-y-auto bg-lid p-6 animate-drop-in">{children}</div>
      )}
    </div>
  );
}
