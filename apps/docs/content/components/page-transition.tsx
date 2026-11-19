import type { ComponentDoc } from "@/lib/types";
import Intro from "@/demos/page-transition/intro";

export const doc: ComponentDoc = {
  slug: "page-transition",
  name: "Page Transitions",
  category: "Layout",
  summary: "Route changes slide the new page in instantly; pages and sections get their stickers stuck on as they arrive.",
  files: ["components/page-transition.tsx", "lib/utils.ts"],
  dependencies: ["radix-ui"],
  demos: [{ id: "intro", title: "Intro", Component: Intro, height: 300 }],
  usage: `
// app/providers.tsx (Next.js App Router)
"use client";
import { usePathname } from "next/navigation";
import { PageTransitions } from "@/components/ui/page-transition";

export function Providers({ children }: { children: React.ReactNode }) {
  return <PageTransitions routeKey={usePathname()}>{children}</PageTransitions>;
}

// app/layout.tsx: the part of the page that slides in
<PageSheet>{children}</PageSheet>

// a page: blocks drop in on a hard load (route changes just slide)
<div className="intro-page flex flex-col gap-8">…</div>

// loose stickers that should always stick on, and sections further down
<Intro tumble className="flex gap-4">…</Intro>
<Reveal asChild><section>…</section></Reveal>
`,
  props: [
    {
      component: "PageTransitions",
      rows: [{ name: "routeKey", type: "string", description: "The current route. Every change (links, router.push, back/forward, across layouts) slides the new page in." }],
    },
    {
      component: "PageSheet",
      rows: [{ name: "asChild", type: "boolean", default: "false", description: "Optional marker for the region that slides. Without one, the page's <main> slides." }],
    },
    {
      component: "Intro / Reveal",
      rows: [
        { name: "tumble", type: "boolean", default: "false", description: "Small loose stickers also rotate and scale in. Leave off for blocks and text." },
        { name: "asChild", type: "boolean", default: "false", description: "Stagger the children of your own element instead of a <div>." },
      ],
    },
  ],
  a11y: [
    "Navigation is never delayed or blocked: the router swaps the page, then it slides.",
    "Under prefers-reduced-motion nothing slides or animates in.",
    "Reveal never hides content that is already on screen.",
  ],
};
