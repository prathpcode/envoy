import type { ComponentDoc } from "@/lib/types";
import SubmitProject from "@/demos/dialog/submit-project";
import Rules from "@/demos/dialog/rules";

export const doc: ComponentDoc = {
  slug: "dialog",
  name: "Dialog",
  category: "Overlays",
  summary: "A big paper sticker slapped onto the screen: it drops in crooked, settles straight and lifts off when closed.",
  files: ["components/dialog.tsx", "lib/utils.ts", "styles/overlays.css"],
  dependencies: ["radix-ui", "pixelarticons"],
  demos: [
    { id: "submit-project", title: "Submit project", Component: SubmitProject, height: 200 },
    { id: "rules", title: "Read and confirm", Component: Rules, height: 200 },
  ],
  usage: `
import {
  Dialog, DialogTrigger, DialogContent, DialogHeader,
  DialogTitle, DialogDescription, DialogFooter, DialogClose,
} from "@/components/ui/dialog";

<Dialog>
  <DialogTrigger asChild><Button>Submit project</Button></DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Submit your project</DialogTitle>
      <DialogDescription>You can edit it until judging opens.</DialogDescription>
    </DialogHeader>
    <DialogFooter>
      <DialogClose asChild><Button variant="secondary">Not yet</Button></DialogClose>
      <Button>Submit</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
`,
  props: [
    {
      component: "DialogContent",
      rows: [
        { name: "showCloseButton", type: "boolean", default: "true", description: "The small paper close sticker stuck on the top-right corner." },
        { name: "bodyClassName", type: "string", description: "Classes for the inner scroll body (padding and gap). The sticker itself never clips." },
      ],
    },
  ],
  a11y: [
    "Radix Dialog: focus is trapped inside, Escape closes, and focus returns to the trigger.",
    "DialogTitle names the dialog and DialogDescription describes it. Keep both, or hide them with sr-only.",
    "The close sticker is a real button with aria-label=\"Close\".",
    "Under prefers-reduced-motion the slap-in and lift-out become instant.",
  ],
  do: [
    "Keep it to a title, one line and the fields that matter.",
    "Name the confirm button after the action: “Submit”, not “OK”.",
  ],
  dont: [
    "Don't stack a dialog on top of a dialog.",
    "Don't tilt the dialog body. Only its small stickers sit crooked.",
  ],
};
