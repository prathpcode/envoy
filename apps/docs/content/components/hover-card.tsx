import type { ComponentDoc } from "@/lib/types";
import Mentor from "@/demos/hover-card/mentor";

export const doc: ComponentDoc = {
  slug: "hover-card",
  name: "Hover Card",
  category: "Overlays",
  summary: "A paper sticker that drops in while you hover a link, to preview who or what is behind it.",
  files: ["components/hover-card.tsx", "lib/utils.ts"],
  dependencies: ["radix-ui"],
  demos: [{ id: "mentor", title: "Mentor preview", Component: Mentor, height: 220 }],
  usage: `
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card";

<HoverCard>
  <HoverCardTrigger asChild><a href="/mentors/ada">@ada-codes</a></HoverCardTrigger>
  <HoverCardContent>…</HoverCardContent>
</HoverCard>
`,
  props: [
    {
      component: "HoverCard",
      rows: [
        { name: "openDelay", type: "number", default: "700", description: "Milliseconds of hover before it drops in." },
        { name: "closeDelay", type: "number", default: "300", description: "Milliseconds before it lifts off after the pointer leaves." },
      ],
    },
  ],
  a11y: [
    "It opens on hover and on keyboard focus of the trigger.",
    "Touch screens never show it, so the link itself must work on its own.",
  ],
  do: ["Use it for previews: a person, a project, a repo."],
  dont: ["Don't hide the only way to do something inside a hover card."],
};
