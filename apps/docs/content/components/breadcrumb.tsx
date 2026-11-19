import type { ComponentDoc } from "@/lib/types";
import Basic from "@/demos/breadcrumb/basic";
import Collapsed from "@/demos/breadcrumb/collapsed";

export const doc: ComponentDoc = {
  slug: "breadcrumb",
  name: "Breadcrumb",
  category: "Navigation",
  summary: "The trail back home, with the current page stuck on as a small crooked pink sticker.",
  files: ["components/breadcrumb.tsx", "lib/utils.ts"],
  dependencies: ["radix-ui", "pixelarticons"],
  demos: [
    { id: "basic", title: "Project trail", Component: Basic, height: 200 },
    { id: "collapsed", title: "Collapsed middle", Component: Collapsed, height: 200 },
  ],
  usage: `
import {
  Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

<Breadcrumb>
  <BreadcrumbList>
    <BreadcrumbItem><BreadcrumbLink href="/projects">Projects</BreadcrumbLink></BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem><BreadcrumbPage>Voxel Pets</BreadcrumbPage></BreadcrumbItem>
  </BreadcrumbList>
</Breadcrumb>
`,
  props: [
    {
      component: "BreadcrumbLink",
      rows: [{ name: "asChild", type: "boolean", default: "false", description: "Render your router's Link with breadcrumb styling." }],
    },
    {
      component: "BreadcrumbPage",
      rows: [{ name: "tilt", type: "number", default: "-2", description: "Resting angle of the pink page sticker, in degrees." }],
    },
    {
      component: "BreadcrumbSeparator",
      rows: [{ name: "children", type: "ReactNode", default: "<ChevronRight />", description: "Swap the pixel chevron for another pixel icon." }],
    },
  ],
  a11y: [
    'Renders a nav with aria-label="Breadcrumb" and an ordered list.',
    'The current page carries aria-current="page".',
    "Separators and the ellipsis are hidden from screen readers.",
  ],
  do: ["Keep labels to the page's real name.", "Collapse the middle with BreadcrumbEllipsis when the trail gets long."],
  dont: ["Don't use a breadcrumb on a flat, one-level site.", "Don't add a second pink sticker next to it."],
};
