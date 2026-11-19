import type { ComponentDoc } from "@/lib/types";
import Schedule from "@/demos/scroll-area/schedule";
import Horizontal from "@/demos/scroll-area/horizontal";

export const doc: ComponentDoc = {
  slug: "scroll-area",
  name: "Scroll Area",
  category: "Layout",
  summary: "A scrolling region with an ink block thumb on a recessed lid track.",
  files: ["components/scroll-area.tsx", "styles/navigation.css", "lib/utils.ts"],
  dependencies: ["radix-ui"],
  registryDependencies: ["separator"],
  demos: [
    { id: "schedule", title: "Weekend schedule", Component: Schedule, height: 380 },
    { id: "horizontal", title: "Sideways", Component: Horizontal },
  ],
  usage: `
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

<div className="sticker sticker-lg face-paper p-2">
  <ScrollArea className="h-72">…</ScrollArea>
</div>
`,
  props: [
    {
      component: "ScrollArea",
      rows: [
        { name: "type", type: '"hover" | "scroll" | "auto" | "always"', default: '"hover"', description: "When the custom scrollbar shows." },
      ],
    },
    {
      component: "ScrollBar",
      rows: [{ name: "orientation", type: '"vertical" | "horizontal"', default: '"vertical"', description: "Add a horizontal ScrollBar inside ScrollArea for sideways content." }],
    },
  ],
  a11y: [
    "Native scrolling underneath: wheel, touch, and keyboard all work.",
    "The viewport is focusable for keyboard scrolling and shows a sky ring on focus.",
  ],
  do: ["Put the ScrollArea inside a sticker; it clips, so it can't be the sticker itself."],
  dont: ["Don't scroll the whole page with it.", "Don't nest scroll areas."],
};
