import type { ComponentDoc } from "@/lib/types";
import Basic from "@/demos/label/basic";

export const doc: ComponentDoc = {
  slug: "label",
  name: "Label",
  category: "Forms",
  summary: "The text beside a Checkbox, Switch or radio; clicking it toggles the control.",
  files: ["components/label.tsx", "lib/utils.ts"],
  dependencies: ["radix-ui"],
  demos: [{ id: "basic", title: "Wrapping & htmlFor", Component: Basic, height: 240 }],
  usage: `
import { Label } from "@/components/ui/label";

<Label><Checkbox /> Bring a laptop charger</Label>
<Label htmlFor="remote">Hacking remotely</Label>
`,
  props: [
    {
      component: "Label",
      rows: [
        { name: "htmlFor", type: "string", description: "The id of the control it names. Not needed when the control is inside." },
        { name: "…label props", type: "LabelHTMLAttributes", description: "Everything a native <label> takes." },
      ],
    },
  ],
  a11y: [
    "Radix Label renders a native <label>, so the control gets its accessible name from it.",
    "Wrap the control or use htmlFor; either makes the whole text a click target.",
    "Dims itself when the peer control is disabled.",
  ],
  do: ["Keep it short and specific.", "Put it to the right of checkboxes and radios."],
  dont: ["Don't use it for name-tag fields; Input and Select carry their own label in the band."],
};
