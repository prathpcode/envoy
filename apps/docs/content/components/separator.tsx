import type { ComponentDoc } from "@/lib/types";
import Rules from "@/demos/separator/rules";

export const doc: ComponentDoc = {
  slug: "separator",
  name: "Separator",
  category: "Layout",
  summary: "A 4px dotted pixel rule that splits content, across or down.",
  files: ["components/separator.tsx", "styles/navigation.css", "lib/utils.ts"],
  dependencies: ["radix-ui"],
  demos: [{ id: "rules", title: "Across and down", Component: Rules }],
  usage: `
import { Separator } from "@/components/ui/separator";

<Separator />
<Separator orientation="vertical" />
`,
  props: [
    {
      component: "Separator",
      rows: [
        { name: "orientation", type: '"horizontal" | "vertical"', default: '"horizontal"', description: "Vertical rules stretch to the height of their row." },
        { name: "decorative", type: "boolean", default: "true", description: 'Set false to announce it as role="separator".' },
      ],
    },
  ],
  a11y: [
    "Decorative by default, so screen readers skip it.",
    'With decorative={false} it becomes role="separator" with aria-orientation.',
  ],
  do: ["Let the rule take the text colour; it reads on the lid and on any sticker face."],
  dont: ["Don't use a separator where a gap of bare lid would do.", "Don't stack rules between every row of a short list."],
};
