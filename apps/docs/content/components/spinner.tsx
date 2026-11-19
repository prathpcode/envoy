import type { ComponentDoc } from "@/lib/types";
import Sizes from "@/demos/spinner/sizes";
import WithText from "@/demos/spinner/with-text";

export const doc: ComponentDoc = {
  slug: "spinner",
  name: "Spinner",
  category: "Feedback",
  summary: "Eight pixel blocks turning in steps, announced as a status.",
  files: ["components/spinner.tsx", "components/button.tsx", "lib/utils.ts"],
  dependencies: ["class-variance-authority"],
  registryDependencies: ["button"],
  demos: [
    { id: "sizes", title: "Sizes", Component: Sizes, height: 200 },
    { id: "with-text", title: "With a label", Component: WithText, height: 200 },
  ],
  usage: `
import { Spinner } from "@/components/ui/spinner";

<Spinner />
<Spinner size="lg" label="Loading the leaderboard" />
<Spinner>Judges are scoring</Spinner>
`,
  props: [
    {
      component: "Spinner",
      rows: [
        { name: "size", type: '"sm" | "md" | "lg"', default: '"md"', description: "20 / 30 / 40px: multiples of its 10-cell grid, so blocks stay crisp." },
        { name: "label", type: "string", default: '"Loading"', description: "Accessible name. Text children are used when no label is given." },
      ],
    },
  ],
  a11y: [
    "role=status with a name, so screen readers hear what is loading.",
    "Under reduced motion it stops turning; the label still announces.",
  ],
  do: ["Say what's loading: “Loading the leaderboard”.", "Use Button's loading prop for buttons instead."],
  dont: ["Don't show a spinner for under 300ms of work.", "Don't put several spinners in one view."],
};
