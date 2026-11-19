import type { ComponentDoc } from "@/lib/types";
import Team from "@/demos/avatar/team";
import Group from "@/demos/avatar/group";

export const doc: ComponentDoc = {
  slug: "avatar",
  name: "Avatar",
  category: "Data display",
  summary: "A small square sticker with your photo printed on it, or your initials on an ink picked from your name.",
  files: ["components/avatar.tsx", "styles/data.css", "lib/utils.ts"],
  dependencies: ["radix-ui", "class-variance-authority"],
  demos: [
    { id: "team", title: "Photos and initials", Component: Team, height: 240 },
    { id: "group", title: "Avatar groups", Component: Group, height: 280 },
  ],
  usage: `
import { Avatar, AvatarFallback, AvatarGroup, AvatarImage } from "@/components/ui/avatar";

<Avatar>
  <AvatarImage src="/ada.png" alt="Ada Byron" />
  <AvatarFallback>Ada Byron</AvatarFallback>
</Avatar>

<AvatarGroup max={3}>{members.map((m) => <Avatar key={m}><AvatarFallback>{m}</AvatarFallback></Avatar>)}</AvatarGroup>
`,
  props: [
    {
      component: "Avatar",
      rows: [
        { name: "size", type: '"sm" | "md" | "lg" | "xl"', default: '"md"', description: "40 / 48 / 64 / 96px squares." },
        { name: "tilt", type: 'number | "auto" | false', default: '"auto"', description: "Resting angle. Inside a group the group alternates it." },
      ],
    },
    {
      component: "AvatarFallback",
      rows: [
        { name: "name", type: "string", description: "Picks the ink (pink, lime, sky or butter) and the initials. Defaults to the text children." },
      ],
    },
    {
      component: "AvatarGroup",
      rows: [
        { name: "max", type: "number", description: "Show this many, then a +n sticker." },
        { name: "size", type: '"sm" | "md" | "lg" | "xl"', description: "Size for every member." },
      ],
    },
  ],
  a11y: [
    "AvatarImage needs alt text; the fallback is named by the person or team.",
    "The same name always gets the same ink, so colour is a hint, never the only cue.",
    "Give AvatarGroup an aria-label such as the team name.",
  ],
  do: ["Pass the full name to the fallback: it makes the initials for you.", "Cap long groups with max."],
  dont: ["Don't use avatars as buttons without wrapping them in one."],
};
