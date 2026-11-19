import type { ComponentDoc } from "@/lib/types";
import Live from "@/demos/leaderboard/live";

export const doc: ComponentDoc = {
  slug: "leaderboard",
  name: "Leaderboard",
  category: "Hackathon kit",
  summary: "Ranked rows of paper stickers with pixel score bars that slide into their new places as scores change.",
  files: ["components/leaderboard.tsx", "lib/utils.ts"],
  dependencies: ["pixelarticons"],
  demos: [{ id: "live", title: "Live judging", Component: Live, height: 560 }],
  usage: `
import { Leaderboard } from "@/components/ui/leaderboard";

<Leaderboard
  entries={[
    { id: "np", name: "Null Pointers", score: 920 },
    { id: "bc", name: "Byte Club", score: 860 },
  ]}
/>
`,
  props: [
    {
      component: "Leaderboard",
      rows: [
        { name: "entries", type: "{ id, name, score, avatar? }[]", description: "Unsorted is fine: rows are ranked by score. Keep ids stable so rows can slide." },
        { name: "max", type: "number", default: "top score", description: "The score that fills a bar." },
        { name: "blocks", type: "number", default: "16", description: "Pixel blocks per score bar." },
        { name: "formatScore", type: "(score) => ReactNode", description: "How the number reads, e.g. with units." },
      ],
    },
  ],
  a11y: [
    "An ordered list: each row reads its rank, name and score.",
    "The pixel bar is aria-hidden; the number carries the value.",
    "Rows jump straight to their place under prefers-reduced-motion.",
  ],
  do: ["Pass a PixelAvatar per team.", "Update in place; the rows animate the change."],
  dont: ["Don't add a meta row under each name.", "Don't re-key rows on update, or they can't slide."],
};
