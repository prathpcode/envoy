import { meta } from "@/content/components/_index";
import { CATEGORIES } from "./types";

export const guides = [
  { href: "/docs", title: "Introduction" },
  { href: "/docs/installation", title: "Installation" },
  { href: "/docs/principles", title: "Design principles" },
  { href: "/docs/theming", title: "Theming & tokens" },
  { href: "/docs/stickers", title: "The sticker material" },
  { href: "/docs/motion", title: "Motion & physics" },
  { href: "/docs/three", title: "3D with three.js" },
  { href: "/docs/accessibility", title: "Accessibility" },
  { href: "/docs/playbook", title: "Hackathon playbook" },
  { href: "/docs/registry", title: "Registry & CLI" },
] as const;

export function componentNav() {
  return CATEGORIES.map((category) => ({
    category,
    items: meta.filter((m) => m.category === category).sort((a, b) => a.name.localeCompare(b.name)),
  })).filter((g) => g.items.length > 0);
}

export const allComponents = meta;
