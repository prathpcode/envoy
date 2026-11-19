import type { ComponentDoc } from "@/lib/types";
import Names from "@/demos/pixel-avatar/names";
import Three from "@/demos/pixel-avatar/three";

export const doc: ComponentDoc = {
  slug: "pixel-avatar",
  name: "PixelAvatar",
  category: "Hackathon kit",
  summary: "A symmetric 8×8 pixel sprite generated from a name, printed on a crooked paper sticker. Same name, same face.",
  files: ["components/pixel-avatar.tsx", "three/sticker-3d.tsx", "three/voxel-sticker.tsx", "three/patterns.ts", "three/sticker-canvas.tsx", "lib/utils.ts"],
  dependencies: ["class-variance-authority", "three", "@react-three/fiber", "@react-three/drei"],
  registryDependencies: ["sticker-3d"],
  demos: [
    { id: "names", title: "One sprite per name", Component: Names, height: 320 },
    { id: "three", title: "As voxel stickers", Component: Three, height: 260 },
  ],
  usage: `
import { PixelAvatar } from "@/components/ui/pixel-avatar";

<PixelAvatar name="Ada" />
<PixelAvatar name="Ada" size="lg" three />
`,
  props: [
    {
      component: "PixelAvatar",
      rows: [
        { name: "name", type: "string", description: "Seeds the sprite (case and outer spaces ignored) and names the image." },
        { name: "size", type: '"sm" | "md" | "lg"', default: '"md"', description: "40 / 56 / 80px stickers." },
        { name: "tilt", type: 'number | "auto" | false', default: '"auto"', description: "Resting angle. Pass false inside lists and tables." },
        { name: "three", type: "boolean", default: "false", description: "Render as a three.js voxel sticker on the shared canvas." },
      ],
    },
  ],
  a11y: [
    "role=img named after the person, so a row of avatars reads as names.",
    "The three version keeps the same name and shows the flat sprite until WebGL is ready.",
  ],
  do: ["Use it wherever a person or team has no photo.", "Use three for a profile hero, not for lists."],
  dont: ["Don't print the name next to it and in its label twice for screen readers."],
};
