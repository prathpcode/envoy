import type { ComponentDoc } from "@/lib/types";
import Basic from "@/demos/toggle/basic";
import Variants from "@/demos/toggle/variants";

export const doc: ComponentDoc = {
  slug: "toggle",
  name: "Toggle",
  category: "Forms",
  summary: "A paper sticker you press in: pressed turns lime, lies flat and straightens.",
  files: ["components/toggle.tsx", "lib/utils.ts"],
  dependencies: ["radix-ui", "class-variance-authority"],
  demos: [
    { id: "basic", title: "Toggles", Component: Basic },
    { id: "variants", title: "Sizes & outline", Component: Variants },
  ],
  usage: `
import { Toggle } from "@/components/ui/toggle";

<Toggle aria-label="Star project"><Heart /></Toggle>
<Toggle defaultPressed>Remote friendly</Toggle>
`,
  props: [
    {
      component: "Toggle",
      rows: [
        { name: "variant", type: '"default" | "outline"', default: '"default"', description: "Paper sticker, or a blank lid-coloured one with just the kiss-cut." },
        { name: "size", type: '"sm" | "default" | "lg"', default: '"default"', description: "Height 40 / 48 / 56px." },
        { name: "pressed / defaultPressed", type: "boolean", description: "On state." },
        { name: "onPressedChange", type: "(pressed: boolean) => void", description: "Called on every press." },
        { name: "tilt", type: 'number | "auto" | false', default: '"auto"', description: "Resting angle while unpressed." },
      ],
    },
  ],
  a11y: [
    "A <button> with aria-pressed; Space and Enter toggle it.",
    "Icon-only toggles need an aria-label.",
    "Pressed is lime and flat, so it reads without colour too.",
  ],
  do: ["Use it for a single on/off option in a toolbar.", "Keep the label the same in both states."],
  dont: ["Don't use it for settings that apply instantly; that's a Switch.", "Don't swap the label to say what it'll do next."],
};
