import type { ComponentDoc } from "@/lib/types";
import Basic from "@/demos/checkbox/basic";

export const doc: ComponentDoc = {
  slug: "checkbox",
  name: "Checkbox",
  category: "Forms",
  summary: "A stamp. Checking turns the whole sticker lime with a pixel check and thunks it down.",
  files: ["components/checkbox.tsx", "lib/utils.ts"],
  dependencies: ["radix-ui", "pixelarticons"],
  demos: [{ id: "basic", title: "Checkboxes", Component: Basic, height: 320 }],
  usage: `
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

<Label><Checkbox defaultChecked /> I agree to the code of conduct</Label>
`,
  props: [
    {
      component: "Checkbox",
      rows: [
        { name: "checked", type: 'boolean | "indeterminate"', description: "Controlled state. Indeterminate lands a minus sticker." },
        { name: "defaultChecked", type: "boolean", description: "Uncontrolled starting state." },
        { name: "onCheckedChange", type: "(checked) => void", description: "Called on every toggle." },
        { name: "disabled", type: "boolean", default: "false", description: "Blank, flat and still." },
      ],
    },
  ],
  a11y: [
    "Radix Checkbox: role=checkbox, Space toggles, aria-checked includes mixed.",
    "Wrap in <Label> (or use aria-label) so the text is the click target too.",
  ],
};
