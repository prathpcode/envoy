import type { ComponentDoc } from "@/lib/types";
import TeamMenu from "@/demos/dropdown-menu/team-menu";
import ViewOptions from "@/demos/dropdown-menu/view-options";

export const doc: ComponentDoc = {
  slug: "dropdown-menu",
  name: "Dropdown Menu",
  category: "Overlays",
  summary: "A straight paper sticker of actions: the highlighted row turns pink, and checked rows land a lime check.",
  files: ["components/dropdown-menu.tsx", "lib/utils.ts", "styles/overlays.css"],
  dependencies: ["radix-ui", "pixelarticons"],
  demos: [
    { id: "team-menu", title: "Team menu", Component: TeamMenu, height: 220 },
    { id: "view-options", title: "Checkboxes and radios", Component: ViewOptions, height: 220 },
  ],
  usage: `
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuShortcut,
} from "@/components/ui/dropdown-menu";

<DropdownMenu>
  <DropdownMenuTrigger asChild><Button variant="secondary">Null Pointers</Button></DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuItem>Invite teammate <DropdownMenuShortcut>⌘I</DropdownMenuShortcut></DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuItem variant="destructive">Leave team</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
`,
  props: [
    {
      component: "DropdownMenuItem",
      rows: [
        { name: "variant", type: '"default" | "destructive"', default: '"default"', description: "Destructive rows highlight tomato instead of pink." },
        { name: "inset", type: "boolean", default: "false", description: "Indent to line up with checkbox and radio rows." },
      ],
    },
    {
      component: "DropdownMenuContent",
      rows: [
        { name: "align", type: '"start" | "center" | "end"', default: '"center"', description: "Alignment against the trigger." },
        { name: "sideOffset", type: "number", default: "12", description: "Gap from the trigger." },
      ],
    },
  ],
  a11y: [
    "Radix Menu: arrow keys move, Enter or Space selects, typing jumps to a row, and Escape closes.",
    "Checkbox and radio rows expose menuitemcheckbox and menuitemradio with aria-checked.",
    "Right arrow opens a submenu and left arrow closes it.",
  ],
  do: [
    "Group related actions under a label, and put the destructive one last.",
    "Give every row an icon or none of them.",
  ],
  dont: [
    "Don't put more than about 8 rows in one menu.",
    "Don't use a menu for navigation between pages; use links.",
  ],
};
