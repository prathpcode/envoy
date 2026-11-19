import type { ComponentDoc } from "@/lib/types";
import Team from "@/demos/team-card/team";

export const doc: ComponentDoc = {
  slug: "team-card",
  name: "TeamCard",
  category: "Hackathon kit",
  summary: "One card sticker per hackathon team: the crew's pixel avatars, the team name, its track and one action.",
  files: ["components/team-card.tsx", "components/card.tsx", "components/badge.tsx", "components/pixel-avatar.tsx", "lib/utils.ts"],
  registryDependencies: ["card", "badge", "pixel-avatar"],
  demos: [{ id: "team", title: "Teams", Component: Team, height: 420 }],
  usage: `
import { TeamCard } from "@/components/ui/team-card";

<TeamCard
  name="Null Pointers"
  track="AI tools"
  members={["Ada", "Linus", "Grace"]}
  action={<Button size="sm">Join team</Button>}
/>
`,
  props: [
    {
      component: "TeamCard",
      rows: [
        { name: "name", type: "string", description: "The team name, set as the card's heading." },
        { name: "members", type: "string[]", description: "Member names; each becomes a PixelAvatar." },
        { name: "track", type: "ReactNode", description: "The track, on a badge." },
        { name: "trackTone", type: '"sky" | "lime" | "butter" | …', default: '"sky"', description: "Badge ink for the track." },
        { name: "action", type: "ReactNode", description: "The one action, usually a small Button." },
        { name: "maxAvatars", type: "number", default: "4", description: "Avatars before the rest fold into a +N sticker." },
        { name: "tilt", type: 'number | "auto" | false', default: '"auto"', description: "Resting angle; pass false in dense grids." },
      ],
    },
  ],
  a11y: [
    "Members are a list named after the team; each avatar is an image named after its person.",
    "The +N sticker reads as “and N more”.",
  ],
  do: ["Keep it to avatars, name, track and one action.", "Use one pink action per row of cards."],
  dont: ["Don't add meta rows like “3 members · 2h ago”.", "Don't nest it in another card."],
};
