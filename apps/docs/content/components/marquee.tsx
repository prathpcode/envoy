import type { ComponentDoc } from "@/lib/types";
import Tracks from "@/demos/marquee/tracks";
import Crew from "@/demos/marquee/crew";

export const doc: ComponentDoc = {
  slug: "marquee",
  name: "Marquee",
  category: "Hackathon kit",
  summary: "An endless row of crooked stickers scrolling across the lid, pausing when you hover or focus it.",
  files: ["components/marquee.tsx", "styles/kit.css", "lib/utils.ts"],
  demos: [
    { id: "tracks", title: "Tracks", Component: Tracks, height: 200 },
    { id: "crew", title: "The crew, the other way", Component: Crew, height: 220 },
  ],
  usage: `
import { Marquee } from "@/components/ui/marquee";

<Marquee speed={40}>
  <Badge tone="sky">AI tools</Badge>
  <Badge tone="lime">Climate</Badge>
</Marquee>
`,
  props: [
    {
      component: "Marquee",
      rows: [
        { name: "speed", type: "number", default: "40", description: "Pixels per second." },
        { name: "direction", type: '"left" | "right"', default: '"left"', description: "Which way the stickers travel." },
        { name: "pauseOnHover", type: "boolean", default: "true", description: "Stops while hovered or while something inside has focus." },
        { name: "gap", type: "number", default: "24", description: "Space between stickers in px. Keep it 12 or more so kiss-cuts don't touch." },
      ],
    },
  ],
  a11y: [
    "Children are read once; the looping copy is aria-hidden and inert.",
    "Under prefers-reduced-motion it stops and wraps into a still, centred cluster.",
    "It pauses on keyboard focus, so links inside can be read and clicked.",
  ],
  do: ["Use it for tracks, prizes or the crew.", "Keep the stickers short: one or two words."],
  dont: ["Don't put the only copy of important info in it.", "Don't run two marquees side by side."],
};
