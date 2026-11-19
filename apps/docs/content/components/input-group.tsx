import type { ComponentDoc } from "@/lib/types";
import CopyLink from "@/demos/input-group/copy-link";
import Search from "@/demos/input-group/search";
import Pitch from "@/demos/input-group/pitch";

export const doc: ComponentDoc = {
  slug: "input-group",
  name: "Input Group",
  category: "Forms",
  summary: "A name-tag field with addons in the writing panel: a prefix, an icon, a Kbd hint or a small button.",
  files: ["components/input-group.tsx", "components/input.tsx", "components/button.tsx", "lib/utils.ts"],
  dependencies: ["radix-ui", "class-variance-authority"],
  registryDependencies: ["input", "button"],
  demos: [
    { id: "copy-link", title: "Prefix + copy button", Component: CopyLink, height: 260 },
    { id: "search", title: "Icons, Kbd & units", Component: Search, height: 340 },
    { id: "pitch", title: "Textarea with a footer", Component: Pitch, height: 340 },
  ],
  usage: `
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput, InputGroupText } from "@/components/ui/input-group";

<InputGroup label="Demo link">
  <InputGroupAddon><InputGroupText>https://</InputGroupText></InputGroupAddon>
  <InputGroupInput placeholder="null-pointers.dev" />
  <InputGroupAddon align="inline-end">
    <InputGroupButton size="icon-sm" aria-label="Copy link"><Copy /></InputGroupButton>
  </InputGroupAddon>
</InputGroup>
`,
  props: [
    {
      component: "InputGroup",
      rows: [
        { name: "label", type: "ReactNode", description: "Band text, wired to the control inside. Omit it and pass aria-label to the control." },
        { name: "error", type: "ReactNode", description: "Turns the band tomato and replaces the label." },
        { name: "disabled", type: "boolean", description: "Blanks the sticker and disables the control." },
        { name: "controlId", type: "string", description: "id for the input inside; generated when omitted." },
        { name: "panelClassName", type: "string", description: "Classes for the white writing panel." },
      ],
    },
    {
      component: "InputGroupAddon",
      rows: [{ name: "align", type: '"inline-start" | "inline-end" | "block-start" | "block-end"', default: '"inline-start"', description: "Where the addon sits. Block addons take a full row." }],
    },
    {
      component: "InputGroupButton",
      rows: [
        { name: "size", type: '"sm" | "icon-sm"', default: '"sm"', description: "36px tall, or a 36px square. Icon-only needs aria-label." },
        { name: "variant", type: "Button variant", default: '"ink"', description: "Any Button ink." },
      ],
    },
  ],
  a11y: [
    "The band labels the control inside; clicking a text or icon addon focuses it.",
    "Prefixes like https:// are visible text, not part of the value: say so in your validation.",
    "Icon-only buttons need an aria-label; swap it when the state changes (Copy link → Copied).",
  ],
  do: ["Use a prefix for fixed parts like https:// or $.", "Keep to one button per group."],
  dont: ["Don't use a pink button inside unless it's the form's main action.", "Don't stack more than two addons on one side."],
};
