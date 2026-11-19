import type { ComponentDoc } from "@/lib/types";
import Basic from "@/demos/switch/basic";
import Controlled from "@/demos/switch/controlled";

export const doc: ComponentDoc = {
  slug: "switch",
  name: "Switch",
  category: "Forms",
  summary: "A sticker track with an ink block knob that springs across; on turns the track sky.",
  files: ["components/switch.tsx", "lib/utils.ts"],
  dependencies: ["radix-ui"],
  demos: [
    { id: "basic", title: "Switches", Component: Basic, height: 300 },
    { id: "controlled", title: "Controlled", Component: Controlled, height: 240 },
  ],
  usage: `
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

<Label><Switch defaultChecked /> Find me a team</Label>
`,
  props: [
    {
      component: "Switch",
      rows: [
        { name: "checked / defaultChecked", type: "boolean", description: "On state." },
        { name: "onCheckedChange", type: "(checked: boolean) => void", description: "Called on every flip." },
        { name: "disabled", type: "boolean", default: "false", description: "Blank, flat and still." },
        { name: "name / value", type: "string", description: "Submit it with a native form." },
      ],
    },
  ],
  a11y: [
    "Radix Switch: role=switch with aria-checked; Space toggles it.",
    "Wrap it in a <Label> or pair it with FieldLabel htmlFor so the text is announced and clickable.",
    "The knob position changes as well as the colour, so on/off doesn't rely on sky alone.",
  ],
  do: ["Use it for settings that apply right away.", "Label what it turns on, not the current state."],
  dont: ["Don't use it in a form that needs a submit; use a Checkbox.", "Don't put “On/Off” text inside the track."],
};
