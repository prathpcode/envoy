import type { ComponentDoc } from "@/lib/types";
import Tones from "@/demos/badge/tones";
import Icons from "@/demos/badge/icons";

export const doc: ComponentDoc = {
  slug: "badge",
  name: "Badge",
  category: "Data display",
  summary: "A tiny crooked sticker for a status that matters.",
  files: ["components/badge.tsx", "lib/utils.ts"],
  dependencies: ["class-variance-authority"],
  demos: [
    { id: "tones", title: "Inks", Component: Tones, height: 200 },
    { id: "icons", title: "With pixel icons", Component: Icons, height: 200 },
  ],
  usage: `
import { Badge } from "@/components/ui/badge";

<Badge tone="lime">Submitted</Badge>
`,
  props: [
    {
      component: "Badge",
      rows: [
        { name: "tone", type: '"paper" | "pink" | "lime" | "sky" | "tomato" | "butter" | "ink"', default: '"paper"', description: "Which ink: lime done, sky live, butter warning, tomato error." },
        { name: "tilt", type: "number", default: "-2", description: "Resting angle in degrees." },
      ],
    },
  ],
  a11y: [
    "A plain span: its text is the status, so make it read on its own.",
    "Icons inside are decorative; mark them aria-hidden.",
  ],
  do: ["Use a badge for a status someone would act on."],
  dont: ["Don't put a badge on every item.", "Don't use pink; badges aren't actions."],
};
