import type { ComponentDoc } from "@/lib/types";
import Basic from "@/demos/kbd/basic";
import InInput from "@/demos/kbd/in-input";

export const doc: ComponentDoc = {
  slug: "kbd",
  name: "Kbd",
  category: "Forms",
  summary: "A key cap: a tiny paper sticker with a stepped pixel lip along the bottom.",
  files: ["components/kbd.tsx", "lib/utils.ts"],
  demos: [
    { id: "basic", title: "Shortcuts", Component: Basic, height: 240 },
    { id: "in-input", title: "In a field", Component: InInput, height: 200 },
  ],
  usage: `
import { Kbd, KbdGroup } from "@/components/ui/kbd";

<KbdGroup>
  <Kbd>Ctrl</Kbd>
  <Kbd>K</Kbd>
</KbdGroup>
`,
  props: [
    {
      component: "Kbd",
      rows: [{ name: "…kbd props", type: "HTMLAttributes", description: "A native <kbd>. Put the key name inside as text." }],
    },
    {
      component: "KbdGroup",
      rows: [{ name: "…kbd props", type: "HTMLAttributes", description: "Wraps the keys of one shortcut with sticker spacing." }],
    },
  ],
  a11y: [
    "A native <kbd>, so screen readers know it's keyboard input.",
    "Spell key names as words (Ctrl, Shift, Enter) instead of symbols.",
  ],
  do: ["Show shortcuts next to the action they trigger.", "Write the key names people see on their keyboard."],
  dont: ["Don't use it as a button; it isn't clickable.", "Don't use symbol glyphs for keys."],
};
