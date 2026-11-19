import type { ComponentDoc } from "@/lib/types";
import Dashboard from "@/demos/sidebar/dashboard";

export const doc: ComponentDoc = {
  slug: "sidebar",
  name: "Sidebar",
  category: "Navigation",
  summary: "An app sidebar recessed into the lid, collapsing to an icon rail and sliding in on phones.",
  files: ["components/sidebar.tsx", "styles/navigation.css", "lib/utils.ts"],
  dependencies: ["radix-ui", "pixelarticons"],
  registryDependencies: ["button"],
  demos: [{ id: "dashboard", title: "Hackathon dashboard", Component: Dashboard, height: 600 }],
  usage: `
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupLabel, SidebarInset, SidebarMenu,
  SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger,
} from "@/components/ui/sidebar";

<SidebarProvider>
  <Sidebar>
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel>Event</SidebarGroupLabel>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton isActive><Home /><span>Overview</span></SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroup>
    </SidebarContent>
  </Sidebar>
  <SidebarInset><SidebarTrigger /></SidebarInset>
</SidebarProvider>
`,
  props: [
    {
      component: "SidebarProvider",
      rows: [
        { name: "defaultOpen", type: "boolean", default: "true", description: "Desktop starts expanded (true) or as an icon rail (false)." },
        { name: "open", type: "boolean", description: "Controlled desktop state." },
        { name: "onOpenChange", type: "(open: boolean) => void", description: "Called when the desktop state changes." },
      ],
    },
    {
      component: "Sidebar",
      rows: [{ name: "collapsible", type: '"icon" | "none"', default: '"icon"', description: "Collapse to a 72px icon rail, or never collapse." }],
    },
    {
      component: "SidebarMenuButton",
      rows: [
        { name: "isActive", type: "boolean", default: "false", description: "The current page: a crooked pink sticker with aria-current." },
        { name: "asChild", type: "boolean", default: "false", description: "Render your router's Link instead of a button." },
      ],
    },
    {
      component: "useSidebar",
      rows: [
        { name: "state", type: '"expanded" | "collapsed"', description: "Desktop state." },
        { name: "isMobile / openMobile", type: "boolean", description: "Under 768px the sidebar is an overlay; openMobile says if it's showing." },
        { name: "toggleSidebar", type: "() => void", description: "Toggles whichever mode is active." },
      ],
    },
  ],
  a11y: [
    "SidebarTrigger is a labelled button with aria-expanded; Ctrl or Cmd + B toggles too.",
    "In the rail, item labels become screen-reader-only, so every button keeps its name.",
    "On phones the panel is a modal dialog: focus moves in, Tab is trapped, Escape or the backdrop closes it, and focus returns to the trigger.",
    'The active item carries aria-current="page".',
  ],
  do: [
    "Give every menu button a pixel icon and a span label, so the rail still reads.",
    "Keep one active item.",
  ],
  dont: [
    "Don't put more than two groups above the fold.",
    "Don't add badges to every item.",
  ],
};
