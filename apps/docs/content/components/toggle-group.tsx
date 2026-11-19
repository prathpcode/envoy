import type { ComponentDoc } from "@/lib/types";
import Dietary from "@/demos/toggle-group/dietary";
import Single from "@/demos/toggle-group/single";

export const doc: ComponentDoc = {
  slug: "toggle-group",
  name: "Toggle Group",
  category: "Forms",
  summary: "A row of toggle stickers for picking one or many; chosen ones go lime and lie flat.",
  files: ["components/toggle-group.tsx", "components/toggle.tsx", "lib/utils.ts"],
  dependencies: ["radix-ui", "class-variance-authority"],
  registryDependencies: ["toggle"],
  demos: [
    { id: "dietary", title: "Dietary needs", Component: Dietary },
    { id: "single", title: "Pick one", Component: Single },
  ],
  usage: `
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

<ToggleGroup type="multiple" aria-label="Dietary needs">
  <ToggleGroupItem value="vegan">Vegan</ToggleGroupItem>
  <ToggleGroupItem value="halal">Halal</ToggleGroupItem>
</ToggleGroup>
`,
  props: [
    {
      component: "ToggleGroup",
      rows: [
        { name: "type", type: '"single" | "multiple"', description: "Required. One choice or many." },
        { name: "value / defaultValue", type: "string | string[]", description: "A string for single, an array for multiple." },
        { name: "variant", type: '"default" | "outline"', default: '"default"', description: "Passed down to every item." },
        { name: "size", type: '"sm" | "default" | "lg"', default: '"default"', description: "Passed down to every item." },
      ],
    },
    {
      component: "ToggleGroupItem",
      rows: [
        { name: "value", type: "string", description: "Required." },
        { name: "tilt", type: 'number | "auto" | false', default: '"auto"', description: "Resting angle while unpressed." },
      ],
    },
  ],
  a11y: [
    "Radix ToggleGroup: one Tab stop, arrows move between items, Space and Enter press.",
    "Give the group an aria-label that names the choice.",
    "Icon-only items need an aria-label each.",
  ],
  do: ["Use multiple for tags like dietary needs.", "Use single for a view switch."],
  dont: ["Don't use it for more than about eight options.", "Don't mix icon-only and text items in one group."],
};
