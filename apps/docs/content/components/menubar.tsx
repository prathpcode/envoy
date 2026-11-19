import type { ComponentDoc } from "@/lib/types";
import ProjectBar from "@/demos/menubar/project-bar";

export const doc: ComponentDoc = {
  slug: "menubar",
  name: "Menubar",
  category: "Overlays",
  summary: "A long, straight paper sticker of menus. The open one gets the pink block.",
  files: ["components/menubar.tsx", "components/dropdown-menu.tsx", "lib/utils.ts", "styles/overlays.css"],
  dependencies: ["radix-ui", "pixelarticons"],
  registryDependencies: ["dropdown-menu"],
  demos: [{ id: "project-bar", title: "Project bar", Component: ProjectBar, height: 260 }],
  usage: `
import {
  Menubar, MenubarMenu, MenubarTrigger, MenubarContent, MenubarItem, MenubarShortcut,
} from "@/components/ui/menubar";

<Menubar>
  <MenubarMenu>
    <MenubarTrigger>Project</MenubarTrigger>
    <MenubarContent>
      <MenubarItem>New submission <MenubarShortcut>⌘N</MenubarShortcut></MenubarItem>
    </MenubarContent>
  </MenubarMenu>
</Menubar>
`,
  props: [
    {
      component: "MenubarItem",
      rows: [
        { name: "variant", type: '"default" | "destructive"', default: '"default"', description: "Destructive rows highlight tomato instead of pink." },
        { name: "inset", type: "boolean", default: "false", description: "Indent to line up with checkbox and radio rows." },
      ],
    },
  ],
  a11y: [
    "Radix Menubar: left and right arrows move between menus, and down arrow opens one.",
    "Once a menu is open, hovering the other triggers switches menus.",
  ],
  do: ["Use it for app-like tools with many commands, like a project editor."],
  dont: ["Don't use it as site navigation. That's Navigation Menu."],
};
