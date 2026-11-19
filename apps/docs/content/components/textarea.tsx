import type { ComponentDoc } from "@/lib/types";
import ProjectDescription from "@/demos/textarea/project-description";
import States from "@/demos/textarea/states";

export const doc: ComponentDoc = {
  slug: "textarea",
  name: "Textarea",
  category: "Forms",
  summary: "A tall name-tag sticker for long answers, with an optional auto-grow panel.",
  files: ["components/textarea.tsx", "components/input.tsx", "lib/utils.ts"],
  registryDependencies: ["input"],
  demos: [
    { id: "project-description", title: "Auto-grow", Component: ProjectDescription, height: 300 },
    { id: "states", title: "Error & disabled", Component: States, height: 420 },
  ],
  usage: `
import { Textarea } from "@/components/ui/textarea";

<Textarea label="Project description" autoGrow placeholder="What does it do?" />
<Textarea label="What did you build?" error="Too short: add one line on what it does" />
`,
  props: [
    {
      component: "Textarea",
      rows: [
        { name: "label", type: "ReactNode", description: "Text in the band. Omit it (and pass aria-label) for a plain white tag." },
        { name: "error", type: "ReactNode", description: "Turns the band tomato and replaces the label. Name the problem and the fix." },
        { name: "autoGrow", type: "boolean", default: "false", description: "The panel grows with the text instead of scrolling." },
        { name: "rows", type: "number", default: "4", description: "Starting height in lines." },
        { name: "wrapperClassName", type: "string", description: "Classes for the outer sticker, e.g. a max width." },
        { name: "…textarea props", type: "TextareaHTMLAttributes", description: "Everything a native <textarea> takes, ref included." },
      ],
    },
  ],
  a11y: [
    "The band is a real <label htmlFor>, so clicking it focuses the field.",
    "While invalid, the error replaces the label and aria-invalid is set.",
    "Focus turns the band and the kiss-cut sky.",
  ],
  do: ["Use autoGrow for answers of unknown length, like a project description.", "Write errors as problem + fix."],
  dont: ["Don't tilt it; long text stays straight.", "Don't add a character counter unless there's a real limit."],
};
