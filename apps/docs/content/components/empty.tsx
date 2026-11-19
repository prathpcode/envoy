import type { ComponentDoc } from "@/lib/types";
import NoProjects from "@/demos/empty/no-projects";

export const doc: ComponentDoc = {
  slug: "empty",
  name: "Empty",
  category: "Feedback",
  summary: "An empty state on bare lid: a 3D sticker, one heading, one line and one action.",
  three: true,
  files: ["components/empty.tsx", "lib/utils.ts"],
  dependencies: [],
  registryDependencies: ["sticker-3d", "button"],
  demos: [{ id: "no-projects", title: "No projects yet", Component: NoProjects, height: 480 }],
  usage: `
import { Empty, EmptyActions, EmptyDescription, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { Sticker3D } from "@/components/ui/three/sticker-3d";

<Empty>
  <EmptyMedia><Sticker3D pattern="ghost" /></EmptyMedia>
  <EmptyTitle>No projects yet</EmptyTitle>
  <EmptyDescription>Start one and your team's build lands here.</EmptyDescription>
  <EmptyActions><Button>New project</Button></EmptyActions>
</Empty>
`,
  props: [
    {
      component: "EmptyMedia",
      rows: [
        { name: "className", type: "string", description: "176px square by default; its child fills it (Sticker3D or PatternSVG)." },
      ],
    },
  ],
  a11y: [
    "The title is a real heading, so the empty region is easy to find.",
    "Sticker3D is role=img with a label; give it one that fits the moment.",
  ],
  do: ["Lead with the one action that fixes the emptiness.", "Let bare lid do the framing."],
  dont: ["Don't wrap it in a card.", "Don't add a second line or a footnote."],
};
