import type { ComponentDoc } from "@/lib/types";
import Vote from "@/demos/drawer/vote";

export const doc: ComponentDoc = {
  slug: "drawer",
  name: "Drawer",
  category: "Overlays",
  summary: "A paper sticker you drag up from the bottom edge, with a checkered pixel grip on top.",
  files: ["components/drawer.tsx", "lib/utils.ts"],
  dependencies: ["vaul"],
  demos: [{ id: "vote", title: "People's choice vote", Component: Vote, height: 200 }],
  usage: `
import {
  Drawer, DrawerTrigger, DrawerContent, DrawerHeader,
  DrawerTitle, DrawerDescription, DrawerFooter, DrawerClose,
} from "@/components/ui/drawer";

<Drawer>
  <DrawerTrigger asChild><Button>Vote</Button></DrawerTrigger>
  <DrawerContent>
    <DrawerHeader>
      <DrawerTitle>People's choice</DrawerTitle>
      <DrawerDescription>One vote.</DrawerDescription>
    </DrawerHeader>
    <DrawerFooter>
      <DrawerClose asChild><Button>Cast vote</Button></DrawerClose>
    </DrawerFooter>
  </DrawerContent>
</Drawer>
`,
  props: [
    {
      component: "Drawer",
      rows: [
        { name: "shouldScaleBackground", type: "boolean", default: "false", description: "vaul's scale-the-page effect. Off by default, so the lid stays put." },
        { name: "snapPoints", type: "(number | string)[]", description: "vaul snap points, e.g. [0.5, 1]." },
      ],
    },
    {
      component: "DrawerContent",
      rows: [{ name: "bodyClassName", type: "string", description: "Classes for the inner scroll body." }],
    },
  ],
  a11y: [
    "vaul is built on Radix Dialog: focus trap, and Escape or an overlay click closes it.",
    "Dragging is optional. Every action also has a button.",
  ],
  do: ["Use it on phones for short tasks within thumb reach."],
  dont: ["Don't put long forms in a drawer. Use a Sheet or a page."],
};
