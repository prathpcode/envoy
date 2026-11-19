import type { ComponentDoc } from "@/lib/types";
import IconButtons from "@/demos/tooltip/icon-buttons";

export const doc: ComponentDoc = {
  slug: "tooltip",
  name: "Tooltip",
  category: "Overlays",
  summary: "A small ink sticker with paper text that names an icon button.",
  files: ["components/tooltip.tsx", "lib/utils.ts", "styles/overlays.css"],
  dependencies: ["radix-ui"],
  demos: [{ id: "icon-buttons", title: "Icon buttons", Component: IconButtons, height: 200 }],
  usage: `
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

// once, near the root
<TooltipProvider>{children}</TooltipProvider>

<Tooltip>
  <TooltipTrigger asChild>
    <Button size="icon" aria-label="Open repo"><Github /></Button>
  </TooltipTrigger>
  <TooltipContent>Open repo</TooltipContent>
</Tooltip>
`,
  props: [
    {
      component: "TooltipProvider",
      rows: [
        { name: "delayDuration", type: "number", default: "200", description: "Milliseconds of hover before a tooltip appears." },
        { name: "skipDelayDuration", type: "number", default: "300", description: "Moving between triggers within this time skips the delay." },
      ],
    },
    {
      component: "TooltipContent",
      rows: [
        { name: "side", type: '"top" | "right" | "bottom" | "left"', default: '"top"', description: "Preferred side. Flips when there is no room." },
        { name: "sideOffset", type: "number", default: "12", description: "Gap from the trigger." },
      ],
    },
  ],
  a11y: [
    "Opens on hover and keyboard focus, and Escape dismisses it.",
    "The text becomes the trigger's accessible description. Icon buttons still need their own aria-label.",
    "16px bold text, never uppercase.",
  ],
  do: ["Use a few words that name the action."],
  dont: [
    "Don't put links or buttons inside a tooltip.",
    "Don't use a tooltip to explain a field; write a better label.",
  ],
};
