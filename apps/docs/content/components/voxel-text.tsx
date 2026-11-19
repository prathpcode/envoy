import type { ComponentDoc } from "@/lib/types";
import Hack from "@/demos/voxel-text/hack";
import OneInk from "@/demos/voxel-text/one-ink";

export const doc: ComponentDoc = {
  slug: "voxel-text",
  name: "VoxelText",
  category: "3D",
  summary: "A word built from voxel cubes in a 5×7 pixel font, on one white kiss-cut backing, peeling toward you on hover.",
  three: true,
  files: ["three/voxel-text.tsx", "three/patterns-extra.ts", "three/voxel-sticker.tsx", "three/sticker-3d.tsx", "three/sticker-canvas.tsx"],
  dependencies: ["three", "@react-three/fiber", "@react-three/drei"],
  registryDependencies: ["sticker-3d"],
  demos: [
    { id: "hack", title: "Two lines, cycling inks", Component: Hack, height: 380 },
    { id: "one-ink", title: "Your own inks", Component: OneInk, height: 300 },
  ],
  usage: `
import { VoxelText } from "@/components/ui/three/voxel-text";

<h1><VoxelText text="HACK" className="w-96" /></h1>
<VoxelText text={"HACK\\nTHE PIXEL"} />
`,
  props: [
    {
      component: "VoxelText",
      rows: [
        { name: "text", type: "string", description: "A–Z, 0–9 and ! ? . - + : # * ' /. Lowercase is set in capitals; a line break starts a new line." },
        { name: "colors", type: "string[]", default: "pink, sky, lime, butter, tomato", description: "Inks the letters cycle through, one per letter." },
        { name: "motion", type: '"flutter" | "still"', default: '"flutter"', description: "Idle motion. It stops under reduced motion." },
      ],
    },
  ],
  a11y: [
    "The real text sits in a visually hidden span, so wrap it in a heading and it reads as one.",
    "The 3D and its flat SVG fallback are aria-hidden.",
    "Peel and flutter switch off under prefers-reduced-motion.",
  ],
  do: ["Use it for one hero word or a short title.", "Keep it to two lines of a few words."],
  dont: ["Don't set sentences or body copy in it (The Seasoning Rule).", "Don't stack several on one screen."],
};
