import type { ComponentDoc } from "@/lib/types";
import Submit from "@/demos/sticker-burst/submit";
import Proportional from "@/demos/sticker-burst/proportional";

export const doc: ComponentDoc = {
  slug: "sticker-burst",
  name: "StickerBurst",
  category: "3D",
  summary: "A celebratory pop of tiny voxel stickers that arc, tumble and fade from the thing you just finished.",
  three: true,
  files: ["three/sticker-burst.tsx", "three/patterns-extra.ts", "three/patterns.ts", "three/sticker-canvas.tsx"],
  dependencies: ["three", "@react-three/fiber", "@react-three/drei"],
  demos: [
    { id: "submit", title: "Burst on submit", Component: Submit, height: 320 },
    { id: "proportional", title: "Sized to the moment", Component: Proportional, height: 320 },
  ],
  usage: `
// once, inside <StickerCanvas>
import { StickerBurstHost } from "@/components/ui/three/sticker-burst";
<StickerCanvas>
  {children}
  <StickerBurstHost />
</StickerCanvas>

// anywhere
import { useStickerBurst } from "@/components/ui/three/sticker-burst";
const burst = useStickerBurst();
<Button onClick={(e) => burst(e.currentTarget)}>Submit project</Button>
`,
  props: [
    {
      component: "burst(target, options)",
      rows: [
        { name: "target", type: "Element | DOMRect | { x, y }", description: "Where the stickers pop from: an element's centre, a rect's centre, or a viewport point." },
        { name: "options.count", type: "number", default: "18", description: "How many stickers. Keep it proportional to the win (1–60)." },
        { name: "options.size", type: "number", default: "30", description: "Sticker edge in px before depth." },
      ],
    },
  ],
  a11y: [
    "Purely decorative: the canvas is aria-hidden, so announce the result itself (the button label, a toast).",
    "Under prefers-reduced-motion nothing fires at all (The Still Rule).",
    "The full-viewport view ignores the pointer, so it never blocks a click.",
    "Mount one <StickerBurstHost/> inside <StickerCanvas>; extra hosts stay idle.",
  ],
  do: ["Burst on real milestones: submitted, shipped, won.", "Fire it from the control that caused it."],
  dont: ["Don't burst on ordinary clicks, saves or page loads.", "Don't chain bursts on a timer."],
};
