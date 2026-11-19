import type { ComponentDoc } from "@/lib/types";
import Roster from "@/demos/collapsible/roster";

export const doc: ComponentDoc = {
  slug: "collapsible",
  name: "Collapsible",
  category: "Layout",
  summary: "Shows and hides a region with the same top-edge hinge as Accordion.",
  files: ["components/collapsible.tsx", "styles/navigation.css"],
  dependencies: ["radix-ui"],
  registryDependencies: ["button"],
  demos: [{ id: "roster", title: "Team roster", Component: Roster, height: 420 }],
  usage: `
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

<Collapsible>
  <CollapsibleTrigger asChild>
    <Button variant="secondary">Show teammates</Button>
  </CollapsibleTrigger>
  <CollapsibleContent>…</CollapsibleContent>
</Collapsible>
`,
  props: [
    {
      component: "Collapsible",
      rows: [
        { name: "open", type: "boolean", description: "Controlled open state." },
        { name: "defaultOpen", type: "boolean", default: "false", description: "Open on first render." },
        { name: "onOpenChange", type: "(open: boolean) => void", description: "Called when the trigger toggles." },
        { name: "disabled", type: "boolean", default: "false", description: "Stops the trigger from toggling." },
      ],
    },
  ],
  a11y: [
    "The trigger gets aria-expanded and aria-controls from Radix.",
    "Use asChild with a Button so the trigger stays a real button; icon-only triggers need an aria-label.",
    "Under prefers-reduced-motion the content appears instantly.",
  ],
  do: ["Use it for optional detail: extra teammates, advanced settings."],
  dont: ["Don't use it for a list of questions; that's an Accordion."],
};
