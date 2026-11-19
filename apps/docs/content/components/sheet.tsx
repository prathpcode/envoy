import type { ComponentDoc } from "@/lib/types";
import TeamSettings from "@/demos/sheet/team-settings";
import Sides from "@/demos/sheet/sides";

export const doc: ComponentDoc = {
  slug: "sheet",
  name: "Sheet",
  category: "Overlays",
  summary: "A big paper sticker that slides in from any edge of the screen and settles straight.",
  files: ["components/sheet.tsx", "lib/utils.ts", "styles/overlays.css"],
  dependencies: ["radix-ui", "class-variance-authority", "pixelarticons"],
  demos: [
    { id: "team-settings", title: "Team settings", Component: TeamSettings, height: 200 },
    { id: "sides", title: "Sides", Component: Sides, height: 200 },
  ],
  usage: `
import {
  Sheet, SheetTrigger, SheetContent, SheetHeader,
  SheetTitle, SheetDescription, SheetFooter, SheetClose,
} from "@/components/ui/sheet";

<Sheet>
  <SheetTrigger asChild><Button variant="secondary">Team settings</Button></SheetTrigger>
  <SheetContent side="right">
    <SheetHeader>
      <SheetTitle>Team settings</SheetTitle>
      <SheetDescription>Changes save for everyone on the team.</SheetDescription>
    </SheetHeader>
    <SheetFooter>
      <SheetClose asChild><Button>Save</Button></SheetClose>
    </SheetFooter>
  </SheetContent>
</Sheet>
`,
  props: [
    {
      component: "SheetContent",
      rows: [
        { name: "side", type: '"top" | "right" | "bottom" | "left"', default: '"right"', description: "The edge it slides in from. It rests 12px off that edge so the kiss-cut shows." },
        { name: "showCloseButton", type: "boolean", default: "true", description: "The paper close sticker in the top-right corner." },
        { name: "bodyClassName", type: "string", description: "Classes for the inner scroll body." },
      ],
    },
  ],
  a11y: [
    "Built on Radix Dialog: focus trap, Escape to close, and focus returns to the trigger.",
    "SheetTitle names it. Keep it, even if you hide it visually.",
  ],
  do: [
    "Use it for settings and side tasks next to the page.",
    "Put the save action in SheetFooter, which sticks to the bottom.",
  ],
  dont: ["Don't use a sheet for a yes/no question. That's an AlertDialog."],
};
