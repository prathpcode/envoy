import type { ComponentDoc } from "@/lib/types";
import Snippet from "@/demos/code-block/snippet";
import Shell from "@/demos/code-block/shell";

export const doc: ComponentDoc = {
  slug: "code-block",
  name: "CodeBlock",
  category: "Hackathon kit",
  summary: "A straight paper sticker for code, with a copy-button sticker and an optional filename tab.",
  files: ["components/code-block.tsx", "lib/utils.ts"],
  dependencies: ["pixelarticons"],
  demos: [
    { id: "snippet", title: "With a filename", Component: Snippet, height: 340 },
    { id: "shell", title: "A one-liner", Component: Shell, height: 220 },
  ],
  usage: `
import { CodeBlock } from "@/components/ui/code-block";

<CodeBlock filename="ship.ts" code={source} />
`,
  props: [
    {
      component: "CodeBlock",
      rows: [
        { name: "code", type: "string", description: "Plain source text." },
        { name: "filename", type: "string", description: "Shown on an ink tab-sticker over the top edge." },
        { name: "highlight", type: "boolean", default: "true", description: "Ink-only highlighting: soft comments, bold keywords. No colours, so contrast holds." },
        { name: "showLineNumbers", type: "boolean", default: "false", description: "Adds a gutter of line numbers (not copied)." },
      ],
    },
  ],
  a11y: [
    "The copy button is named “Copy code”, and a polite live region says when it worked.",
    "Line numbers are aria-hidden and can't be selected, so copies stay clean.",
    "Long lines scroll inside the sticker, never the page.",
  ],
  do: ["Keep snippets short enough to read without scrolling.", "Name the file when it helps people place it."],
  dont: ["Don't tilt it; code is long text.", "Don't add a caption under it."],
};
