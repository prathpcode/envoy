"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@pixel3d/ui";

/** Sidebar link: the active page wears a pink sticker. */
export function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  const active = usePathname() === href;
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "px-3 py-1.5 text-[17px] font-semibold text-on-lid-soft transition-colors hover:text-on-lid",
        active && "sticker face-pink crooked my-1 font-extrabold text-ink [--p3d-tilt:-1.5deg]"
      )}
    >
      {children}
    </Link>
  );
}
