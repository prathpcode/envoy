import type { ComponentDoc } from "@/lib/types";
import Track from "@/demos/select/track";
import Bare from "@/demos/select/bare";
import States from "@/demos/select/states";

export const doc: ComponentDoc = {
  slug: "select",
  name: "Select",
  category: "Forms",
  summary: "A name-tag field that drops a paper list; the chosen item lands a lime check-sticker.",
  files: ["components/select.tsx", "components/input.tsx", "lib/utils.ts"],
  dependencies: ["radix-ui", "pixelarticons"],
  registryDependencies: ["input"],
  demos: [
    { id: "track", title: "Name-tag trigger", Component: Track, height: 420 },
    { id: "bare", title: "No label, with groups", Component: Bare, height: 420 },
    { id: "states", title: "Error & disabled", Component: States, height: 360 },
  ],
  usage: `
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

<Select>
  <SelectTrigger label="Track">
    <SelectValue placeholder="Pick a track" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="ai">AI agents</SelectItem>
    <SelectItem value="games">Games</SelectItem>
  </SelectContent>
</Select>
`,
  props: [
    {
      component: "SelectTrigger",
      rows: [
        { name: "label", type: "ReactNode", description: "Makes the trigger a name-tag field with this band text. Without it, it's a paper sticker: pass aria-label." },
        { name: "error", type: "ReactNode", description: "Turns the band tomato and replaces the label. Name the problem and the fix." },
        { name: "size", type: '"sm" | "default"', default: '"default"', description: "Height of the bare trigger: 40 or 48px." },
        { name: "wrapperClassName", type: "string", description: "Classes for the name-tag sticker." },
      ],
    },
    {
      component: "SelectContent",
      rows: [
        { name: "position", type: '"popper" | "item-aligned"', default: '"popper"', description: "Popper drops the list below the trigger, at least as wide." },
        { name: "sideOffset", type: "number", default: "12", description: "Gap from the trigger; keeps the kiss-cuts apart." },
      ],
    },
  ],
  a11y: [
    "Radix Select: role=combobox trigger and a listbox; arrows move, Enter picks, typing jumps to a match.",
    "The name-tag band is a <label> for the trigger, so it's announced as the field name.",
    "The chosen item has aria-selected; the check-sticker is decoration only.",
  ],
  do: ["Use it for 5 to 15 options; fewer fit as radio cards.", "Group long lists with SelectLabel."],
  dont: ["Don't tilt the trigger or the list.", "Don't use it for actions; that's a dropdown menu."],
};
