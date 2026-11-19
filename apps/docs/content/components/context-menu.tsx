import type { ComponentDoc } from "@/lib/types";
import ProjectCard from "@/demos/context-menu/project-card";

export const doc: ComponentDoc = {
  slug: "context-menu",
  name: "Context Menu",
  category: "Overlays",
  summary: "The right-click menu, as the same straight paper sticker as Dropdown Menu.",
  files: ["components/context-menu.tsx", "components/dropdown-menu.tsx", "lib/utils.ts", "styles/overlays.css"],
  dependencies: ["radix-ui", "pixelarticons"],
  registryDependencies: ["dropdown-menu"],
  demos: [{ id: "project-card", title: "Project card", Component: ProjectCard, height: 280 }],
  usage: `
import {
  ContextMenu, ContextMenuTrigger, ContextMenuContent, ContextMenuItem,
} from "@/components/ui/context-menu";

<ContextMenu>
  <ContextMenuTrigger>Right-click me</ContextMenuTrigger>
  <ContextMenuContent>
    <ContextMenuItem>Open demo</ContextMenuItem>
    <ContextMenuItem variant="destructive">Withdraw project</ContextMenuItem>
  </ContextMenuContent>
</ContextMenu>
`,
  props: [
    {
      component: "ContextMenuItem",
      rows: [
        { name: "variant", type: '"default" | "destructive"', default: '"default"', description: "Destructive rows highlight tomato instead of pink." },
        { name: "inset", type: "boolean", default: "false", description: "Indent to line up with checkbox and radio rows." },
      ],
    },
  ],
  a11y: [
    "Opens with right-click, long-press, or Shift+F10 / the menu key on the focused trigger.",
    "Same keyboard model as Dropdown Menu.",
  ],
  do: ["Mirror actions that also exist somewhere visible."],
  dont: ["Don't hide the only way to do something in a context menu."],
};
