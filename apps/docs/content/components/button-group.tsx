import type { ComponentDoc } from "@/lib/types";
import Vote from "@/demos/button-group/vote";
import Actions from "@/demos/button-group/actions";
import Vertical from "@/demos/button-group/vertical";

export const doc: ComponentDoc = {
  slug: "button-group",
  name: "Button Group",
  category: "Actions",
  summary: "Buttons fused edge to edge into one straight sticker strip with ink pixel dividers.",
  files: ["components/button-group.tsx", "styles/navigation.css", "lib/utils.ts"],
  registryDependencies: ["button"],
  demos: [
    { id: "vote", title: "Vote counter", Component: Vote, height: 200 },
    { id: "actions", title: "Split and toolbar", Component: Actions, height: 200 },
    { id: "vertical", title: "Vertical", Component: Vertical, height: 240 },
  ],
  usage: `
import { ButtonGroup, ButtonGroupText } from "@/components/ui/button-group";

<ButtonGroup aria-label="Vote">
  <Button variant="secondary" aria-label="Upvote"><ThumbsUp /></Button>
  <ButtonGroupText>128</ButtonGroupText>
</ButtonGroup>
`,
  props: [
    {
      component: "ButtonGroup",
      rows: [{ name: "orientation", type: '"horizontal" | "vertical"', default: '"horizontal"', description: "Lay the strip out across or down." }],
    },
    {
      component: "ButtonGroupText",
      rows: [{ name: "children", type: "ReactNode", description: "A non-interactive segment: a count, a unit, a label." }],
    },
  ],
  a11y: [
    'Renders role="group"; give it an aria-label.',
    "Each Button stays a real button with its own focus; the whole strip's kiss-cut turns sky.",
    "Icon-only segments need an aria-label.",
  ],
  do: ["Group actions that act on the same thing.", "Keep it to two to four segments."],
  dont: ["Don't put two different pink actions in one strip.", "Don't tilt a group; strips stay straight."],
};
