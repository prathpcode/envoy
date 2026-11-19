import type { ComponentDoc } from "@/lib/types";
import Types from "@/demos/toast/types";
import Undo from "@/demos/toast/undo";

export const doc: ComponentDoc = {
  slug: "toast",
  name: "Toast",
  category: "Feedback",
  summary: "Crooked stickers that drop onto the corner of the screen with a stepped bounce: lime, tomato, butter, sky or paper.",
  files: ["components/sonner.tsx", "components/button.tsx", "lib/utils.ts", "styles/overlays.css"],
  dependencies: ["sonner", "pixelarticons", "class-variance-authority"],
  registryDependencies: ["button"],
  demos: [
    { id: "types", title: "Inks", Component: Types, height: 200 },
    { id: "undo", title: "With an Undo action", Component: Undo, height: 200 },
  ],
  usage: `
import { Toaster, toast } from "@/components/ui/sonner";

// once, near the root
<Toaster />

toast.success("Project submitted", { description: "Pixel Pets is in the AI track." });
toast.error("Repo link is private");
toast("Vote withdrawn", { action: { label: "Undo", onClick: restore } });
`,
  props: [
    {
      component: "Toaster",
      rows: [
        { name: "position", type: '"top-left" | "top-center" | "top-right" | "bottom-left" | "bottom-center" | "bottom-right"', default: '"bottom-right"', description: "Corner the stickers stack in." },
        { name: "gap", type: "number", default: "20", description: "Space between expanded toasts. Leaves room for the kiss-cuts." },
        { name: "offset", type: "number | string", default: "24", description: "Distance from the screen edge." },
        { name: "id", type: "string", description: "Name a Toaster and send toasts to it with toasterId." },
        { name: "toastOptions", type: "ToastOptions", description: "Sonner options. Always unstyled; your classNames merge with the sticker ones." },
      ],
    },
  ],
  a11y: [
    "Sonner announces toasts in a live region, and Alt+T focuses the stack.",
    "Toasts pause while hovered or focused, and swipe to dismiss.",
    "Text is ink on every colour, and the icon repeats the meaning so it's not colour alone.",
    "Under prefers-reduced-motion they appear without the bounce.",
  ],
  do: [
    "Say what happened in a few words: “Project submitted”.",
    "Offer Undo instead of asking “Are you sure?” for reversible actions.",
  ],
  dont: [
    "Don't toast every click. Toasts are for results.",
    "Don't put the only copy of an error in a toast; show it next to the field too.",
  ],
};
