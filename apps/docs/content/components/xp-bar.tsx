import type { ComponentDoc } from "@/lib/types";
import LevelUp from "@/demos/xp-bar/level-up";
import Variants from "@/demos/xp-bar/variants";

export const doc: ComponentDoc = {
  slug: "xp-bar",
  name: "XPBar",
  category: "Hackathon kit",
  summary: "A game-style XP, health or mana bar of discrete 8px blocks that land one by one when you gain.",
  files: ["components/xp-bar.tsx", "styles/kit.css", "lib/utils.ts"],
  demos: [
    { id: "level-up", title: "Level up", Component: LevelUp, height: 280 },
    { id: "variants", title: "Health and mana", Component: Variants, height: 440 },
  ],
  usage: `
import { XPBar } from "@/components/ui/xp-bar";

<XPBar value={340} max={500} level={7} label="Ada" />
<XPBar variant="health" value={hp} label="Demo server" />
`,
  props: [
    {
      component: "XPBar",
      rows: [
        { name: "value", type: "number", description: "Current amount, clamped to 0…max." },
        { name: "max", type: "number", default: "100", description: "The amount that fills the bar." },
        { name: "level", type: "number", description: "Shown on an ink level sticker at the start." },
        { name: "label", type: "ReactNode", description: "Names the bar, visibly and for screen readers." },
        { name: "variant", type: '"xp" | "health" | "mana"', default: '"xp"', description: "XP is lime, mana is sky, health goes lime → butter → tomato as it drops." },
        { name: "blocks", type: "number", default: "30", description: "How many 8px blocks the bar is cut into." },
        { name: "hideValue", type: "boolean", default: "false", description: "Hide the value / max readout." },
      ],
    },
  ],
  a11y: [
    "role=progressbar with aria-valuenow, min, max and a value text that includes the level.",
    "Named by its label.",
    "Blocks appear instantly under prefers-reduced-motion.",
  ],
  do: ["Use it for playful progress: XP, streaks, quotas.", "Pair a gain with the action that caused it."],
  dont: ["Don't use it for file uploads or page loads; that's Progress.", "Don't stack more than a few on one card."],
};
