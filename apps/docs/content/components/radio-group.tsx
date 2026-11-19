import type { ComponentDoc } from "@/lib/types";
import Basic from "@/demos/radio-group/basic";
import Cards from "@/demos/radio-group/cards";

export const doc: ComponentDoc = {
  slug: "radio-group",
  name: "Radio Group",
  category: "Forms",
  summary: "Square paper stickers that land a lime pixel dot, or full sticker tiles that go lime when chosen.",
  files: ["components/radio-group.tsx", "lib/utils.ts"],
  dependencies: ["radix-ui", "pixelarticons"],
  demos: [
    { id: "basic", title: "Radios", Component: Basic, height: 320 },
    { id: "cards", title: "Pick your track", Component: Cards, height: 420 },
  ],
  usage: `
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

<RadioGroup defaultValue="in-person">
  <Label><RadioGroupItem value="in-person" /> In person</Label>
  <Label><RadioGroupItem value="remote" /> Remote</Label>
</RadioGroup>

<RadioGroup variant="cards" defaultValue="ai">
  <RadioGroupItem value="ai">AI agents</RadioGroupItem>
</RadioGroup>
`,
  props: [
    {
      component: "RadioGroup",
      rows: [
        { name: "variant", type: '"default" | "cards"', default: '"default"', description: "Cards turns each item into a sticker tile that holds its own content." },
        { name: "value / defaultValue", type: "string", description: "The chosen item." },
        { name: "onValueChange", type: "(value: string) => void", description: "Called when the choice changes." },
      ],
    },
    {
      component: "RadioGroupItem",
      rows: [
        { name: "value", type: "string", description: "Required. What this option stands for." },
        { name: "tilt", type: 'number | "auto" | false', default: '"auto"', description: "Cards only: resting angle. Chosen cards straighten." },
        { name: "disabled", type: "boolean", default: "false", description: "Blank, flat and still." },
      ],
    },
  ],
  a11y: [
    "Radix RadioGroup: one Tab stop, arrows move and choose, role=radio with aria-checked.",
    "Give the group an aria-label or wrap it in a FieldSet with a FieldLegend.",
    "Cards show a check-sticker as well as the lime face, so the choice isn't colour alone.",
  ],
  do: ["Use cards for 2 to 6 big choices like tracks or plans.", "Keep each card to a title and one line."],
  dont: ["Don't use it for on/off; that's a Switch.", "Don't nest buttons or links inside a card."],
};
