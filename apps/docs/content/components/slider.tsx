import type { ComponentDoc } from "@/lib/types";
import TeamSize from "@/demos/slider/team-size";
import Range from "@/demos/slider/range";
import States from "@/demos/slider/states";

export const doc: ComponentDoc = {
  slug: "slider",
  name: "Slider",
  category: "Forms",
  summary: "A paper sticker bar with a pink pixel fill and a crooked ink thumb you peel and drag.",
  files: ["components/slider.tsx", "styles/forms.css", "lib/utils.ts"],
  dependencies: ["radix-ui"],
  demos: [
    { id: "team-size", title: "Team size", Component: TeamSize, height: 260 },
    { id: "range", title: "Range", Component: Range, height: 260 },
    { id: "states", title: "Disabled & vertical", Component: States, height: 300 },
  ],
  usage: `
import { Slider } from "@/components/ui/slider";

<Slider defaultValue={[3]} min={1} max={5} aria-label="Team size" />
<Slider defaultValue={[10, 22]} min={6} max={30} thumbLabels={["Start", "Stop"]} />
`,
  props: [
    {
      component: "Slider",
      rows: [
        { name: "value / defaultValue", type: "number[]", description: "One number for a single thumb, two for a range." },
        { name: "min / max / step", type: "number", default: "0 / 100 / 1", description: "The scale." },
        { name: "showValue", type: "boolean", default: "true", description: "Shows the value sticker above the thumb while dragging or keyboard-focused." },
        { name: "formatValue", type: "(value: number) => ReactNode", description: "Formats the value sticker, e.g. hours as 22:00." },
        { name: "thumbLabels", type: "string[]", description: "Accessible names per thumb. Needed for a range." },
        { name: "orientation", type: '"horizontal" | "vertical"', default: '"horizontal"', description: "Vertical needs a height." },
      ],
    },
  ],
  a11y: [
    "Radix Slider: each thumb is role=slider; arrows step, Page Up/Down jump, Home/End go to the ends.",
    "Name every thumb: aria-label for one, thumbLabels for a range.",
    "The value sticker is decoration; screen readers read aria-valuenow.",
    "Under reduced motion the thumb doesn't lift.",
  ],
  do: ["Show the current value next to the slider when it matters.", "Use a range for windows like hours or budgets."],
  dont: ["Don't use it for exact numbers like a prize amount; use an Input.", "Don't put more than two thumbs on one bar."],
};
