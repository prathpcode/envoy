import type { ComponentDoc } from "@/lib/types";
import Event from "@/demos/navigation-menu/event";

export const doc: ComponentDoc = {
  slug: "navigation-menu",
  name: "Navigation Menu",
  category: "Navigation",
  summary: "Site navigation whose paper triggers peel up and drop a straight paper panel of links.",
  files: ["components/navigation-menu.tsx", "lib/utils.ts"],
  dependencies: ["radix-ui", "class-variance-authority", "pixelarticons"],
  demos: [{ id: "event", title: "Event site nav", Component: Event, height: 440 }],
  usage: `
import {
  NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink,
  NavigationMenuList, NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

<NavigationMenu>
  <NavigationMenuList>
    <NavigationMenuItem>
      <NavigationMenuTrigger>Schedule</NavigationMenuTrigger>
      <NavigationMenuContent>
        <NavigationMenuLink href="/kickoff">Kickoff</NavigationMenuLink>
      </NavigationMenuContent>
    </NavigationMenuItem>
  </NavigationMenuList>
</NavigationMenu>
`,
  props: [
    {
      component: "NavigationMenu",
      rows: [
        { name: "viewport", type: "boolean", default: "true", description: "Share one panel sticker under the list. false makes each content its own sticker." },
      ],
    },
    {
      component: "NavigationMenuTrigger",
      rows: [{ name: "index", type: "number", default: "0", description: "Picks a stable resting tilt so neighbours don't match." }],
    },
    {
      component: "NavigationMenuLink",
      rows: [{ name: "active", type: "boolean", default: "false", description: "Marks the current page: the row turns lime." }],
    },
    {
      component: "navigationMenuTriggerStyle",
      rows: [{ name: "()", type: "() => string", description: "Trigger classes for a plain top-level link." }],
    },
  ],
  a11y: [
    "Radix handles roving focus: arrow keys move between triggers, Enter or Space opens, Escape closes.",
    "Triggers expose aria-expanded; the open panel is linked with aria-controls.",
    "Focus turns a trigger's kiss-cut sky and fills a link row sky.",
  ],
  do: ["Group links by what people come for: schedule, tracks, prizes.", "Give each link one short line at most."],
  dont: ["Don't tilt the open panel; menus stay straight.", "Don't put forms inside the menu."],
};
