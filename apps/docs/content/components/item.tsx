import type { ComponentDoc } from "@/lib/types";
import Teams from "@/demos/item/teams";
import Links from "@/demos/item/links";

export const doc: ComponentDoc = {
  slug: "item",
  name: "Item",
  category: "Layout",
  summary: "A list row as a straight paper sticker: media, a title, one line, actions.",
  files: ["components/item.tsx", "lib/utils.ts"],
  dependencies: ["radix-ui", "class-variance-authority"],
  registryDependencies: ["button"],
  demos: [
    { id: "teams", title: "Teams to judge", Component: Teams, height: 420 },
    { id: "links", title: "As links", Component: Links },
  ],
  usage: `
import { Item, ItemActions, ItemContent, ItemDescription, ItemMedia, ItemTitle } from "@/components/ui/item";

<Item>
  <ItemMedia variant="icon"><Robot /></ItemMedia>
  <ItemContent>
    <ItemTitle>Byte Club</ItemTitle>
    <ItemDescription>An agent that files your expense reports.</ItemDescription>
  </ItemContent>
  <ItemActions><Button size="sm">Judge</Button></ItemActions>
</Item>
`,
  props: [
    {
      component: "Item",
      rows: [
        { name: "variant", type: '"paper" | "lid" | "flat"', default: '"paper"', description: "White sticker, lid-coloured sticker, or a white one lying flat." },
        { name: "size", type: '"default" | "sm"', default: '"default"', description: "Row height 72 / 56px." },
        { name: "asChild", type: "boolean", default: "false", description: "Render an <a> (or Link); the row then lifts on hover." },
      ],
    },
    {
      component: "ItemMedia",
      rows: [{ name: "variant", type: '"default" | "icon" | "image"', default: '"default"', description: "A 48px square for a pixel icon or a thumbnail." }],
    },
  ],
  a11y: [
    'ItemGroup is role="list"; give each Item role="listitem" when grouped.',
    "As a link the whole row is one target, and focus turns its kiss-cut sky.",
  ],
  do: ["One title and one line per row.", "Put the main action at the end, in ItemActions."],
  dont: ["Don't tilt rows; lists stay straight.", "Don't put a badge on every row."],
};
