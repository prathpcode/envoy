import type { ComponentDoc } from "@/lib/types";
import DemoVideo from "@/demos/dropzone/demo-video";
import Screenshots from "@/demos/dropzone/screenshots";

export const doc: ComponentDoc = {
  slug: "dropzone",
  name: "Dropzone",
  category: "Hackathon kit",
  summary: "An empty sticker slot on the lid that peels up sky when you drag files over it; dropped files slap down as little file stickers.",
  files: ["components/dropzone.tsx", "styles/kit.css", "lib/utils.ts"],
  dependencies: ["pixelarticons"],
  demos: [
    { id: "demo-video", title: "Upload your demo video", Component: DemoVideo, height: 340 },
    { id: "screenshots", title: "Several files", Component: Screenshots, height: 340 },
  ],
  usage: `
import { Dropzone } from "@/components/ui/dropzone";

<Dropzone accept="video/*" maxFiles={1} onFiles={setFiles}>
  Upload your demo video
</Dropzone>
`,
  props: [
    {
      component: "Dropzone",
      rows: [
        { name: "accept", type: "string", description: 'Same syntax as <input accept>: "video/*", ".zip,.pdf". Dropped files are filtered too.' },
        { name: "maxFiles", type: "number", default: "1", description: "With 1, a new file swaps the old one. With more, the slot fills up and then disables." },
        { name: "onFiles", type: "(files: File[]) => void", description: "Called with the whole kept list whenever it changes." },
        { name: "name", type: "string", description: "Name for the hidden file input, for plain form posts." },
        { name: "children", type: "ReactNode", default: '"Drop a file here"', description: "The slot's one line: say what to drop." },
      ],
    },
  ],
  a11y: [
    "A real button: Tab to it, Enter or Space opens the file picker.",
    "Focus turns the dotted outline sky.",
    "Each file sticker has a remove button named after the file.",
    "Skipped files are reported in the slot, so a wrong type never fails silently.",
  ],
  do: ["Name what goes in: “Upload your demo video”.", "Set accept so the picker filters for people."],
  dont: ["Don't add a paragraph of rules; put limits in accept and maxFiles."],
};
