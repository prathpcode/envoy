import type { ComponentDoc } from "@/lib/types";
import Gallery from "@/demos/sticker-3d/gallery";
import Custom from "@/demos/sticker-3d/custom";

export const doc: ComponentDoc = {
  slug: "sticker-3d",
  name: "Sticker3D",
  category: "3D",
  summary: "A real three.js voxel sticker that sits in your layout and peels toward you on hover.",
  three: true,
  files: ["three/sticker-3d.tsx", "three/voxel-sticker.tsx", "three/patterns.ts", "three/sticker-canvas.tsx", "lib/utils.ts"],
  dependencies: ["three", "@react-three/fiber", "@react-three/drei"],
  demos: [
    { id: "gallery", title: "Built-in patterns", Component: Gallery, height: 300 },
    { id: "custom", title: "Draw your own", Component: Custom, height: 320 },
  ],
  usage: `
// once, in your root layout
import { StickerCanvas } from "@/components/ui/three/sticker-canvas";
<StickerCanvas>{children}</StickerCanvas>

// anywhere
import { Sticker3D } from "@/components/ui/three/sticker-3d";
<Sticker3D pattern="heart" className="size-48" />
`,
  props: [
    {
      component: "Sticker3D",
      rows: [
        { name: "pattern", type: "PatternName | string[]", description: "A built-in (heart, star, bolt, trophy, rocket, coffee, ghost, check, pixel) or your own rows." },
        { name: "colors", type: "Record<string, string>", description: "Map pattern letters to colours. Defaults: p pink, l lime, s sky, b butter, t tomato, k ink, w white." },
        { name: "motion", type: '"flutter" | "spin" | "still"', default: '"flutter"', description: "Idle motion. All of it stops under reduced motion." },
        { name: "label", type: "string", description: "Accessible name; the sticker renders as role=img." },
      ],
    },
  ],
  a11y: [
    "Rendered as role=img with a label; the canvas itself is aria-hidden.",
    "Before WebGL is ready, and without it, a crisp SVG of the same pattern shows.",
    "One shared canvas per page, so 40 stickers cost one WebGL context.",
  ],
  do: ["Use it for heroes, empty states, avatars and wins.", "Keep it big: 160px and up reads as 3D."],
  dont: ["Don't put one in every table row; use the SVG PatternSVG there."],
};
