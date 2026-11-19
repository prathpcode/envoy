import type { ComponentDoc } from "@/lib/types";
import Registration from "@/demos/stepper/registration";
import Vertical from "@/demos/stepper/vertical";

export const doc: ComponentDoc = {
  slug: "stepper",
  name: "Stepper",
  category: "Hackathon kit",
  summary: "Square sticker steps joined by pixel-dotted rules: lime with a landed check when done, pink for where you are.",
  files: ["components/stepper.tsx", "lib/utils.ts"],
  dependencies: ["pixelarticons"],
  demos: [
    { id: "registration", title: "Registration", Component: Registration, height: 300 },
    { id: "vertical", title: "Vertical", Component: Vertical, height: 520 },
  ],
  usage: `
import { Stepper } from "@/components/ui/stepper";

<Stepper steps={["Team", "Project", "Demo video", "Submit"]} current={1} />
`,
  props: [
    {
      component: "Stepper",
      rows: [
        { name: "steps", type: "(string | { id?, title })[]", description: "One short title per step." },
        { name: "current", type: "number", description: "Index of the current step. Earlier steps are done; steps.length marks everything done." },
        { name: "orientation", type: '"horizontal" | "vertical"', default: '"horizontal"', description: "Vertical suits schedules and narrow sidebars." },
      ],
    },
  ],
  a11y: [
    "An ordered list; the current step has aria-current=step.",
    "Done and current are spoken after each title, not only shown in colour.",
    "Give it an aria-label that names the flow.",
  ],
  do: ["Keep it to 3–6 steps with one-word titles.", "Move current forward only when a step is really done."],
  dont: ["Don't add descriptions under every step.", "Don't tilt it; steps are structure."],
};
