import type { ComponentDoc } from "@/lib/types";
import Variants from "@/demos/button/variants";
import Icons from "@/demos/button/icons";
import Sizes from "@/demos/button/sizes";
import States from "@/demos/button/states";
import AsLink from "@/demos/button/as-link";

export const doc: ComponentDoc = {
  slug: "button",
  name: "Button",
  category: "Actions",
  summary: "A die-cut sticker that peels up on hover and slaps down when you press it.",
  files: ["components/button.tsx", "lib/utils.ts"],
  dependencies: ["radix-ui", "class-variance-authority"],
  demos: [
    { id: "variants", title: "Inks", Component: Variants },
    { id: "icons", title: "With pixel icons", Component: Icons },
    { id: "sizes", title: "Sizes", Component: Sizes },
    { id: "states", title: "Loading, disabled & tilt", Component: States },
    { id: "as-link", title: "As a link", Component: AsLink, height: 200 },
  ],
  usage: `
import { Button } from "@/components/ui/button";

<Button onClick={ship}>Ship it</Button>
<Button variant="secondary" tilt={false}>Cancel</Button>
`,
  props: [
    {
      component: "Button",
      rows: [
        { name: "variant", type: '"primary" | "secondary" | "success" | "destructive" | "ink" | "ghost"', default: '"primary"', description: "Which ink. Pink acts, lime confirms, tomato destroys." },
        { name: "size", type: '"sm" | "md" | "lg" | "icon"', default: '"md"', description: "Height 40 / 48 / 56px. Icon is a 48px square; give it an aria-label." },
        { name: "tilt", type: 'number | "auto" | false', default: '"auto"', description: "Resting angle in degrees. Auto picks a stable angle between ±2.5°." },
        { name: "loading", type: "boolean", default: "false", description: "Shows the pixel spinner and blocks clicks." },
        { name: "asChild", type: "boolean", default: "false", description: "Render your own element (a Next.js Link) with button styling." },
      ],
    },
  ],
  a11y: [
    "Native <button>: Enter and Space activate it, and focus shows a sky kiss-cut ring.",
    "Icon-only buttons need an aria-label; the pixel icon itself is aria-hidden.",
    "loading sets aria-busy and disables the button so it can't double-submit.",
    "Peel and slap motion switch off under prefers-reduced-motion.",
  ],
  do: [
    "Use one pink button per region: it's the action.",
    "Name the action in the label: “Submit project”, not “OK”.",
    "Let small groups sit crooked; that's the charm.",
  ],
  dont: [
    "Don't stack three pink buttons side by side.",
    "Don't tilt buttons inside dense toolbars or tables; pass tilt={false}.",
    "Don't add a helper line under a button; the label carries it.",
  ],
};
