import type { ComponentDoc } from "@/lib/types";
import Variants from "@/demos/alert/variants";

export const doc: ComponentDoc = {
  slug: "alert",
  name: "Alert",
  category: "Feedback",
  summary: "A straight sticker with a pixel icon, whose ink says what kind of news it is.",
  files: ["components/alert.tsx", "lib/utils.ts"],
  dependencies: ["class-variance-authority", "pixelarticons"],
  demos: [{ id: "variants", title: "Inks", Component: Variants, height: 640 }],
  usage: `
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

<Alert variant="destructive">
  <AlertTitle>Demo link is broken</AlertTitle>
  <AlertDescription>Check the URL is public, then resubmit.</AlertDescription>
</Alert>
`,
  props: [
    {
      component: "Alert",
      rows: [
        { name: "variant", type: '"default" | "info" | "success" | "warning" | "destructive"', default: '"default"', description: "Paper, sky, lime, butter or tomato, each with its own pixel icon." },
        { name: "icon", type: "ReactNode | false", description: "Swap the pixel icon, or false for none." },
      ],
    },
  ],
  a11y: [
    "Warning and destructive alerts are role=alert and interrupt; the rest are role=status.",
    "The icon is decorative; the title carries the message.",
    "Ink text on every face, 6.3:1 or better.",
  ],
  do: ["Name the problem and the fix in the description.", "Keep it to a title and one line."],
  dont: ["Don't use a warning ink for good news.", "Don't add a coloured left border; the face is the colour."],
};
