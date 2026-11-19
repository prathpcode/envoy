import type { ComponentDoc } from "@/lib/types";
import Track from "@/demos/combobox/track";

export const doc: ComponentDoc = {
  slug: "combobox",
  name: "Combobox",
  category: "Forms",
  summary: "A name-tag field that opens a searchable list. The pick lands a lime check-sticker.",
  files: ["components/combobox.tsx", "lib/utils.ts"],
  dependencies: ["cmdk", "radix-ui", "pixelarticons"],
  registryDependencies: ["command", "popover", "input"],
  demos: [{ id: "track", title: "Pick your track", Component: Track, height: 220 }],
  usage: `
import { Combobox } from "@/components/ui/combobox";

<Combobox
  label="Your track"
  options={[{ value: "ai", label: "AI agents" }, { value: "hardware", label: "Hardware hacks" }]}
  value={track}
  onValueChange={setTrack}
/>
`,
  props: [
    {
      component: "Combobox",
      rows: [
        { name: "options", type: "{ value; label; icon?; disabled?; keywords? }[]", description: "The choices. Search matches label and keywords." },
        { name: "value", type: "string", description: "Controlled value. An empty string means nothing is picked." },
        { name: "defaultValue", type: "string", default: '""', description: "Uncontrolled starting value." },
        { name: "onValueChange", type: "(value: string) => void", description: "Called on pick. Picking the current option clears it." },
        { name: "label", type: "ReactNode", description: "Band text on the name tag." },
        { name: "placeholder", type: "string", default: '"Pick one"', description: "Shown until something is picked." },
        { name: "searchPlaceholder", type: "string", default: '"Search…"', description: "Placeholder in the search tag." },
        { name: "emptyText", type: "ReactNode", default: '"Nothing matches."', description: "Shown when the search finds nothing." },
      ],
    },
  ],
  a11y: [
    "The trigger has role=combobox and aria-expanded.",
    "Typing filters, the arrow keys move, Enter picks, and Escape closes.",
  ],
  do: ["Use it when there are more than about 7 options."],
  dont: ["Don't use it for 3 options; use a radio group or toggle group."],
};
