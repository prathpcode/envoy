import type { ComponentDoc } from "@/lib/types";
import Hero from "@/demos/sticker-scene/hero";
import Custom from "@/demos/sticker-scene/custom";

export const doc: ComponentDoc = {
  slug: "sticker-scene",
  name: "StickerScene",
  category: "3D",
  summary: "A hero-sized cluster of voxel stickers floating at different depths that drift, lean toward your pointer and peel when touched.",
  three: true,
  files: ["three/sticker-scene.tsx", "three/voxel-sticker.tsx", "three/sticker-3d.tsx", "three/patterns.ts", "three/sticker-canvas.tsx", "lib/utils.ts"],
  dependencies: ["three", "@react-three/fiber", "@react-three/drei"],
  registryDependencies: ["sticker-3d"],
  demos: [
    { id: "hero", title: "Landing hero", Component: Hero, height: 560 },
    { id: "custom", title: "Your own stickers", Component: Custom, height: 400 },
  ],
  usage: `
import { StickerScene } from "@/components/ui/three/sticker-scene";

<StickerScene className="h-[520px]" density={16}>
  <h1>Hack the pixel</h1>
</StickerScene>
`,
  props: [
    {
      component: "StickerScene",
      rows: [
        { name: "stickers", type: "(PatternName | string[] | { pattern, colors })[]", default: "all built-ins", description: "What floats. The list repeats to fill the cluster." },
        { name: "density", type: "number", default: "14", description: "How many stickers float (1–40)." },
        { name: "label", type: "string", description: "Accessible name. Leave it out when the scene is pure decoration." },
        { name: "children", type: "ReactNode", description: "Content for the clear middle; the cluster keeps out of its way." },
      ],
    },
  ],
  a11y: [
    "Decorative by default (aria-hidden); pass label to expose it as one image.",
    "Your children stay ordinary DOM: headings, links and buttons work as usual.",
    "Under prefers-reduced-motion the cluster holds still: no drift, parallax or peel.",
  ],
  do: ["Use one per page, as the landing hero.", "Give it a heading and one action in the middle."],
  dont: ["Don't put dense UI inside it; stickers float around the middle.", "Don't push density past what reads as a loose cluster."],
};
