import type { ComponentDoc } from "@/lib/types";
import Faq from "@/demos/accordion/faq";
import Multiple from "@/demos/accordion/multiple";

export const doc: ComponentDoc = {
  slug: "accordion",
  name: "Accordion",
  category: "Layout",
  summary: "A stack of paper stickers that hinge open from the top edge, one answer at a time.",
  files: ["components/accordion.tsx", "styles/navigation.css", "lib/utils.ts"],
  dependencies: ["radix-ui", "pixelarticons"],
  demos: [
    { id: "faq", title: "Hackathon FAQ", Component: Faq, height: 380 },
    { id: "multiple", title: "Several open at once", Component: Multiple, height: 440 },
  ],
  usage: `
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

<Accordion type="single" collapsible>
  <AccordionItem value="team">
    <AccordionTrigger>How big can a team be?</AccordionTrigger>
    <AccordionContent>Up to four people.</AccordionContent>
  </AccordionItem>
</Accordion>
`,
  props: [
    {
      component: "Accordion",
      rows: [
        { name: "type", type: '"single" | "multiple"', description: "One item open at a time, or any number." },
        { name: "collapsible", type: "boolean", default: "false", description: 'With type="single", lets the open item close again.' },
        { name: "defaultValue", type: "string | string[]", description: "Item value(s) open on first render." },
      ],
    },
    {
      component: "AccordionItem",
      rows: [
        { name: "value", type: "string", description: "Unique key for the item." },
        { name: "disabled", type: "boolean", default: "false", description: "Blank, flat sticker that won't open." },
      ],
    },
  ],
  a11y: [
    "Triggers are buttons inside headings, with aria-expanded and aria-controls from Radix.",
    "Arrow Up and Down move between triggers; Home and End jump to the ends.",
    "Focus turns the item's kiss-cut sky.",
    "Under prefers-reduced-motion the content opens instantly, without the hinge.",
  ],
  do: [
    "Phrase triggers as the question people actually ask.",
    "Keep each answer to a line or two.",
  ],
  dont: [
    "Don't hide the one thing everyone needs (the deadline) inside an accordion.",
    "Don't nest accordions inside accordions.",
  ],
};
