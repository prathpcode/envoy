import type { ComponentDoc } from "@/lib/types";
import ProjectCard from "@/demos/skeleton/project-card";

export const doc: ComponentDoc = {
  slug: "skeleton",
  name: "Skeleton",
  category: "Feedback",
  summary: "A recessed lid block with a dithered pixel shimmer that sweeps across in steps.",
  files: ["components/skeleton.tsx", "styles/data.css", "lib/utils.ts"],
  dependencies: [],
  demos: [{ id: "project-card", title: "Loading projects", Component: ProjectCard, height: 400 }],
  usage: `
import { Skeleton } from "@/components/ui/skeleton";

<div aria-busy="true" aria-label="Loading projects">
  <Skeleton className="size-12" />
  <Skeleton className="h-6 w-48" />
</div>
`,
  a11y: [
    "Skeletons are aria-hidden; put aria-busy and a label on the region that is loading.",
    "The shimmer stops under prefers-reduced-motion.",
  ],
  do: ["Match the shape of what's coming.", "Size with Tailwind: h-6 w-40, size-12."],
  dont: ["Don't leave skeletons up after an error: say what went wrong.", "Don't round them."],
};
