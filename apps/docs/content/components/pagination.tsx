import type { ComponentDoc } from "@/lib/types";
import Projects from "@/demos/pagination/projects";
import Labels from "@/demos/pagination/labels";

export const doc: ComponentDoc = {
  slug: "pagination",
  name: "Pagination",
  category: "Navigation",
  summary: "Pages as small square stickers; the one you're on is lime and pressed flat.",
  files: ["components/pagination.tsx", "lib/utils.ts"],
  dependencies: ["pixelarticons"],
  demos: [
    { id: "projects", title: "Project gallery", Component: Projects, height: 200 },
    { id: "labels", title: "Custom prev and next", Component: Labels, height: 200 },
  ],
  usage: `
import {
  Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious,
} from "@/components/ui/pagination";

<Pagination>
  <PaginationContent>
    <PaginationItem><PaginationPrevious href="?page=1" /></PaginationItem>
    <PaginationItem><PaginationLink href="?page=2" isActive>2</PaginationLink></PaginationItem>
    <PaginationItem><PaginationNext href="?page=3" /></PaginationItem>
  </PaginationContent>
</Pagination>
`,
  props: [
    {
      component: "PaginationLink",
      rows: [
        { name: "isActive", type: "boolean", default: "false", description: "The current page: lime, straight and flat, with aria-current." },
        { name: "size", type: '"icon" | "default"', default: '"icon"', description: "A 44px square, or a padded sticker for text." },
      ],
    },
    {
      component: "PaginationPrevious / PaginationNext",
      rows: [{ name: "children", type: "ReactNode", default: '"Prev" / "Next"', description: "Label beside the pixel arrow, hidden under 640px." }],
    },
  ],
  a11y: [
    'Renders a nav with aria-label="Pagination".',
    'The current page has aria-current="page".',
    "Under 640px the prev and next labels become screen-reader-only, so the arrows keep their names.",
    "Every target is at least 44px.",
  ],
  do: ["Show the first, last and nearby pages; collapse the rest into an ellipsis."],
  dont: ["Don't page through fewer than two screens of content.", "Don't use pink for the current page; lime means chosen."],
};
