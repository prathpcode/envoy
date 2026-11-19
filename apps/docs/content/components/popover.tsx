import type { ComponentDoc } from "@/lib/types";
import Invite from "@/demos/popover/invite";

export const doc: ComponentDoc = {
  slug: "popover",
  name: "Popover",
  category: "Overlays",
  summary: "A straight paper sticker that drops in next to its trigger, for small tasks that keep the page in view.",
  files: ["components/popover.tsx", "lib/utils.ts"],
  dependencies: ["radix-ui"],
  demos: [{ id: "invite", title: "Invite a teammate", Component: Invite, height: 200 }],
  usage: `
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";

<Popover>
  <PopoverTrigger asChild><Button variant="secondary">Invite teammate</Button></PopoverTrigger>
  <PopoverContent>…</PopoverContent>
</Popover>
`,
  props: [
    {
      component: "PopoverContent",
      rows: [
        { name: "side", type: '"top" | "right" | "bottom" | "left"', default: '"bottom"', description: "Preferred side. Flips when there is no room." },
        { name: "align", type: '"start" | "center" | "end"', default: '"center"', description: "Alignment against the trigger." },
        { name: "sideOffset", type: "number", default: "12", description: "Gap from the trigger. 12px keeps the two kiss-cuts apart." },
      ],
    },
  ],
  a11y: [
    "Radix Popover: the trigger gets aria-expanded, focus moves inside, and Escape closes and returns focus.",
    "Portaled to the body at z-50, so a sticker's filter never traps it.",
  ],
  do: ["Keep it to one small task: a heading, a field and one action."],
  dont: ["Don't nest a popover inside a popover."],
};
