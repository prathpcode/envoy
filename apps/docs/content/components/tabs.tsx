import type { ComponentDoc } from "@/lib/types";
import Tracks from "@/demos/tabs/tracks";
import Icons from "@/demos/tabs/icons";

export const doc: ComponentDoc = {
  slug: "tabs",
  name: "Tabs",
  category: "Navigation",
  summary: "A row of paper stickers; the chosen one turns lime, straightens and lies flat.",
  files: ["components/tabs.tsx", "lib/utils.ts"],
  dependencies: ["radix-ui"],
  demos: [
    { id: "tracks", title: "Tracks", Component: Tracks },
    { id: "icons", title: "With pixel icons", Component: Icons },
  ],
  usage: `
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

<Tabs defaultValue="ai">
  <TabsList aria-label="Tracks">
    <TabsTrigger value="ai" index={0}>AI agents</TabsTrigger>
    <TabsTrigger value="hw" index={1}>Hardware</TabsTrigger>
  </TabsList>
  <TabsContent value="ai">…</TabsContent>
  <TabsContent value="hw">…</TabsContent>
</Tabs>
`,
  props: [
    {
      component: "TabsTrigger",
      rows: [
        { name: "index", type: "number", default: "0", description: "Position in the list; picks a stable resting tilt so neighbours differ." },
        { name: "disabled", type: "boolean", default: "false", description: "Blank, flat sticker that can't be chosen." },
      ],
    },
  ],
  a11y: [
    "Radix tablist semantics: arrow keys move between tabs, Home and End jump to the ends.",
    "Give TabsList an aria-label.",
    "Focus turns a tab's kiss-cut sky; panels drop in, or appear instantly under reduced motion.",
  ],
  do: ["Keep labels to one or two words.", "Pass index so each tab rests at its own angle."],
  dont: ["Don't use tabs for steps in a sequence.", "Don't put more than five tabs in a row."],
};
