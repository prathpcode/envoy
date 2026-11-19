import type { ComponentDoc } from "@/lib/types";
import Palette from "@/demos/command/palette";
import Inline from "@/demos/command/inline";

export const doc: ComponentDoc = {
  slug: "command",
  name: "Command",
  category: "Overlays",
  summary: "A search name-tag over a list you can filter by typing. The highlighted row becomes a lime block.",
  files: ["components/command.tsx", "components/dialog.tsx", "components/dropdown-menu.tsx", "lib/utils.ts", "styles/overlays.css"],
  dependencies: ["cmdk", "radix-ui", "pixelarticons"],
  registryDependencies: ["dialog", "input", "dropdown-menu"],
  demos: [
    { id: "palette", title: "⌘K palette", Component: Palette, height: 200 },
    { id: "inline", title: "Inline", Component: Inline, height: 440 },
  ],
  usage: `
import {
  CommandDialog, CommandInput, CommandList, CommandEmpty,
  CommandGroup, CommandItem, CommandShortcut,
} from "@/components/ui/command";

<CommandDialog open={open} onOpenChange={setOpen}>
  <CommandInput label="Jump to" placeholder="Track, team or page" />
  <CommandList>
    <CommandEmpty>No track by that name.</CommandEmpty>
    <CommandGroup heading="Tracks">
      <CommandItem onSelect={go}>AI agents</CommandItem>
    </CommandGroup>
  </CommandList>
</CommandDialog>
`,
  props: [
    {
      component: "Command",
      rows: [
        { name: "frame", type: "boolean", default: "true", description: "Draw its own paper sticker. Pass false when it sits inside another sticker." },
      ],
    },
    {
      component: "CommandInput",
      rows: [
        { name: "label", type: "ReactNode", description: "Text for the name-tag band. Without it, the tag is plain white." },
        { name: "wrapperClassName", type: "string", description: "Classes for the name-tag wrapper." },
      ],
    },
    {
      component: "CommandDialog",
      rows: [
        { name: "title", type: "string", default: '"Command palette"', description: "Screen-reader title for the dialog." },
        { name: "description", type: "string", default: '"Search for a page or an action"', description: "Screen-reader description." },
        { name: "showCloseButton", type: "boolean", default: "false", description: "Show the dialog's corner close sticker." },
        { name: "commandProps", type: "CommandProps", description: "Props for the inner Command (filter, loop, value)." },
      ],
    },
  ],
  a11y: [
    "cmdk: the input is a combobox, and up/down arrows move through the listbox rows.",
    "Enter runs the highlighted row, and Escape closes the dialog.",
    "The ⌘K shortcut is yours to bind (see the demo).",
  ],
  do: ["Group rows under short headings: Tracks, Pages, Actions."],
  dont: ["Don't make it the only way to reach a page."],
};
