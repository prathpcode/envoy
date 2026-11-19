import type { ComponentDoc } from "@/lib/types";
import Project from "@/demos/card/project";
import Interactive from "@/demos/card/interactive";
import Faces from "@/demos/card/faces";

export const doc: ComponentDoc = {
  slug: "card",
  name: "Card",
  category: "Layout",
  summary: "A big sticker with stepped corners: one heading, one line, one action.",
  files: ["components/card.tsx", "lib/utils.ts"],
  registryDependencies: ["button"],
  demos: [
    { id: "project", title: "Project card", Component: Project, height: 320 },
    { id: "interactive", title: "Corner peel", Component: Interactive, height: 300 },
    { id: "faces", title: "Inks", Component: Faces },
  ],
  usage: `
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

<Card>
  <CardHeader>
    <CardTitle>Voxel Pets</CardTitle>
    <CardDescription>A desk pet made of cubes.</CardDescription>
  </CardHeader>
  <CardFooter><Button>Vote</Button></CardFooter>
</Card>
`,
  props: [
    {
      component: "Card",
      rows: [
        { name: "tilt", type: 'number | "auto" | false', default: "false", description: "Resting angle; auto picks a stable one within ±1.5°." },
        { name: "interactive", type: "boolean", default: "false", description: "Adds the 3D corner-peel on hover." },
        { name: "face", type: '"paper" | "pink" | "lime" | "sky" | "butter" | "ink"', default: '"paper"', description: "Sticker ink. Keep to the ink's one job." },
      ],
    },
    {
      component: "CardMedia",
      rows: [{ name: "children", type: "ReactNode", description: "Full-bleed media area: an image, a Sticker3D, a chart." }],
    },
  ],
  a11y: [
    "A plain div: if the whole card is a link, wrap the title in the link rather than the card.",
    "The corner peel switches off under prefers-reduced-motion.",
  ],
  do: ["Keep to media, one heading, one line and one action.", "Let a single card sit crooked; keep grids of cards straight."],
  dont: ["Don't nest cards.", "Don't build a page from identical icon + heading + text cards."],
};
