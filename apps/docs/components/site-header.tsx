import Link from "next/link";
import { Logo } from "./logo";
import { ThemeToggle } from "./theme-toggle";
import { MobileNav } from "./mobile-nav";
import { NavTree } from "./docs-sidebar";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 bg-lid">
      <a href="#content" className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 sticker face-butter px-4 py-2 font-bold">
        Skip to content
      </a>
      <div className="mx-auto flex h-20 max-w-[1440px] items-center gap-4 px-4 md:gap-6 md:px-8">
        <MobileNav>
          <NavTree />
        </MobileNav>
        <Link href="/" className="flex items-center gap-3 focus-visible:outline-sky" aria-label="pixel3d-ui home">
          <Logo />
        </Link>
        <nav className="ml-auto hidden items-center gap-2 text-[17px] font-bold md:flex" aria-label="Primary">
          <Link href="/docs" className="px-3 py-2 hover:bg-on-lid/10">Docs</Link>
          <Link href="/docs/components/button" className="px-3 py-2 hover:bg-on-lid/10">Components</Link>
          <Link href="/docs/playbook" className="px-3 py-2 hover:bg-on-lid/10">Playbook</Link>
        </nav>
        <div className="ml-auto md:ml-0">
          <ThemeToggle />
        </div>
      </div>
      <div className="pixel-rule mx-auto max-w-[1440px] text-on-lid/15" />
    </header>
  );
}
