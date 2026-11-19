import type { ComponentDoc } from "@/lib/types";
import NameTag from "@/demos/input/name-tag";
import States from "@/demos/input/states";
import Adornments from "@/demos/input/adornments";

export const doc: ComponentDoc = {
  slug: "input",
  name: "Input",
  category: "Forms",
  summary: "A name-tag sticker: the label lives in the band, you write on the white panel.",
  files: ["components/input.tsx", "lib/utils.ts"],
  demos: [
    { id: "name-tag", title: "Name tags", Component: NameTag, height: 320 },
    { id: "states", title: "Error & disabled", Component: States, height: 320 },
    { id: "adornments", title: "Icons & no band", Component: Adornments, height: 300 },
  ],
  usage: `
import { Input } from "@/components/ui/input";

<Input label="Team name" placeholder="Null Pointers" />
<Input label="Repo URL" error="That repo is private: make it public" />
`,
  props: [
    {
      component: "Input",
      rows: [
        { name: "label", type: "ReactNode", description: "Text in the band. Omit it (and pass aria-label) for a plain white tag." },
        { name: "error", type: "ReactNode", description: "Turns the band tomato and replaces the label. Name the problem and the fix." },
        { name: "leading", type: "ReactNode", description: "Pixel icon or element at the start of the writing panel." },
        { name: "trailing", type: "ReactNode", description: "Element at the end: a Kbd hint, a clear button, a unit." },
        { name: "wrapperClassName", type: "string", description: "Classes for the outer sticker, e.g. a max width." },
        { name: "…input props", type: "InputHTMLAttributes", description: "Everything a native <input> takes, ref included." },
      ],
    },
  ],
  a11y: [
    "The band is a real <label htmlFor>, so clicking it focuses the field.",
    "While invalid, the error replaces the label and aria-invalid is set.",
    "Focus turns the band sky and the kiss-cut sky: two signals, not just colour.",
  ],
  do: [
    "Keep labels to a few words: the band is the label, not a sentence.",
    "Write errors as problem + fix.",
  ],
  dont: [
    "Don't add helper text under every field.",
    "Don't tilt fields; forms stay straight for readability.",
  ],
};
