import type { ComponentDoc } from "@/lib/types";
import Inks from "@/demos/dither-image/inks";

export const doc: ComponentDoc = {
  slug: "dither-image",
  name: "DitherImage",
  category: "Hackathon kit",
  summary: "Any image printed like a vinyl sticker: a 4×4 Bayer dither in Ink plus one ink colour, with crisp chunky pixels.",
  files: ["components/dither-image.tsx", "lib/utils.ts"],
  demos: [{ id: "inks", title: "Three inks", Component: Inks, height: 380 }],
  usage: `
import { DitherImage } from "@/components/ui/dither-image";

<DitherImage src="/team.jpg" alt="Null Pointers at demo day" ink="sky" />
`,
  props: [
    {
      component: "DitherImage",
      rows: [
        { name: "src", type: "string", description: "Any image URL. Cross-origin images need CORS and crossOrigin, or they show undithered." },
        { name: "alt", type: "string", description: "Describe the picture. Pass an empty string only when it's pure decoration." },
        { name: "ink", type: '"pink" | "lime" | "sky" | "butter" | "tomato" | "paper" | string', default: '"pink"', description: "The light tone of the duotone; the dark tone is always Ink." },
        { name: "scale", type: "number", default: "3", description: "One dither dot in CSS px. Bigger is chunkier." },
        { name: "frame", type: "boolean", default: "true", description: "Print it on a crooked paper sticker." },
        { name: "tilt", type: 'number | "auto" | false', default: '"auto"', description: "Resting angle of the frame." },
      ],
    },
  ],
  a11y: [
    "role=img with your alt; the canvas itself is aria-hidden.",
    "An empty alt hides it from screen readers entirely.",
    "Runs once per size change on the CPU, with no animation.",
  ],
  do: ["Use it for team photos, project shots and empty states.", "Pick the ink that matches the section's one job."],
  dont: ["Don't dither screenshots people need to read.", "Don't fill a background with it (The Seasoning Rule)."],
};
