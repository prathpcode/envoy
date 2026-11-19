import type { ComponentDoc } from "@/lib/types";
import Editor from "@/demos/resizable/editor";
import Plain from "@/demos/resizable/plain";

export const doc: ComponentDoc = {
  slug: "resizable",
  name: "Resizable",
  category: "Layout",
  summary: "Panels you drag apart by a little ink grip sticker.",
  files: ["components/resizable.tsx", "styles/navigation.css", "lib/utils.ts"],
  dependencies: ["react-resizable-panels"],
  demos: [
    { id: "editor", title: "Hack editor", Component: Editor, height: 400 },
    { id: "plain", title: "Rule only", Component: Plain },
  ],
  usage: `
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";

<ResizablePanelGroup orientation="horizontal">
  <ResizablePanel defaultSize="30%">Files</ResizablePanel>
  <ResizableHandle withHandle />
  <ResizablePanel defaultSize="70%">Editor</ResizablePanel>
</ResizablePanelGroup>
`,
  props: [
    {
      component: "ResizablePanelGroup",
      rows: [
        { name: "orientation", type: '"horizontal" | "vertical"', default: '"horizontal"', description: "react-resizable-panels v4 name (v3 called it direction)." },
        { name: "onLayoutChanged", type: "(layout) => void", description: "Fires after a drag ends; use it to save the layout." },
      ],
    },
    {
      component: "ResizablePanel",
      rows: [
        { name: "defaultSize / minSize / maxSize", type: "number | string", description: 'Numbers are pixels; "30%" or "30" are percentages.' },
        { name: "collapsible", type: "boolean", default: "false", description: "Snaps shut when dragged below minSize." },
      ],
    },
    {
      component: "ResizableHandle",
      rows: [{ name: "withHandle", type: "boolean", default: "false", description: "Adds the ink grip sticker over the dotted rule." }],
    },
  ],
  a11y: [
    'Each handle is a focusable role="separator" with aria-valuenow.',
    "Arrow keys resize, Home and End jump to the limits.",
    "Focus turns the grip's kiss-cut sky.",
  ],
  do: ["Set a minSize so no panel can be crushed to nothing.", "Use withHandle when the split isn't obvious."],
  dont: ["Don't make more than three panels in one group."],
};
