import type { ComponentDoc } from "@/lib/types";
import Upload from "@/demos/progress/upload";
import Indeterminate from "@/demos/progress/indeterminate";

export const doc: ComponentDoc = {
  slug: "progress",
  name: "Progress",
  category: "Feedback",
  summary: "A pixel XP bar: a paper track that fills with pink blocks, one 8px block at a time.",
  files: ["components/progress.tsx", "styles/data.css", "lib/utils.ts"],
  dependencies: ["radix-ui"],
  demos: [
    { id: "upload", title: "Upload progress", Component: Upload, height: 260 },
    { id: "indeterminate", title: "Indeterminate", Component: Indeterminate, height: 220 },
  ],
  usage: `
import { Progress } from "@/components/ui/progress";

<Progress value={64} aria-label="Uploading demo video" />
<Progress value={null} aria-label="Building preview" />
`,
  props: [
    {
      component: "Progress",
      rows: [
        { name: "value", type: "number | null", description: "Current value. null shows the indeterminate scanner." },
        { name: "max", type: "number", default: "100", description: "The value that means done." },
      ],
    },
  ],
  a11y: [
    "Radix progressbar semantics with aria-valuenow, aria-valuemax and a value text.",
    "Name it with aria-label or aria-labelledby pointing at the visible label.",
    "The fill still lands block by block under reduced motion, without the easing.",
  ],
  do: ["Show the percent next to the label for long uploads.", "Use null when you can't measure it."],
  dont: ["Don't fake progress that doesn't move.", "Don't stack two bars for one task."],
};
