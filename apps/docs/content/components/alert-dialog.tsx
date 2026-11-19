import type { ComponentDoc } from "@/lib/types";
import DeleteTeam from "@/demos/alert-dialog/delete-team";
import LeaveHackathon from "@/demos/alert-dialog/leave-hackathon";

export const doc: ComponentDoc = {
  slug: "alert-dialog",
  name: "Alert Dialog",
  category: "Overlays",
  summary: "A dialog sticker you have to answer: confirm or cancel, with tomato for anything destructive.",
  files: ["components/alert-dialog.tsx", "lib/utils.ts", "styles/overlays.css"],
  dependencies: ["radix-ui", "class-variance-authority"],
  registryDependencies: ["button"],
  demos: [
    { id: "delete-team", title: "Delete team", Component: DeleteTeam, height: 200 },
    { id: "leave-hackathon", title: "Withdraw submission", Component: LeaveHackathon, height: 200 },
  ],
  usage: `
import {
  AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader,
  AlertDialogTitle, AlertDialogDescription, AlertDialogFooter,
  AlertDialogCancel, AlertDialogAction,
} from "@/components/ui/alert-dialog";

<AlertDialog>
  <AlertDialogTrigger asChild><Button variant="destructive">Delete team</Button></AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Delete Null Pointers?</AlertDialogTitle>
      <AlertDialogDescription>This can't be undone.</AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Keep team</AlertDialogCancel>
      <AlertDialogAction variant="destructive">Delete team</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
`,
  props: [
    {
      component: "AlertDialogAction / AlertDialogCancel",
      rows: [
        { name: "variant", type: '"primary" | "secondary" | "success" | "destructive" | "ink" | "ghost"', default: 'Action "primary", Cancel "secondary"', description: "Button ink. Use destructive (tomato) when the action destroys something." },
        { name: "size", type: '"sm" | "md" | "lg"', default: '"md"', description: "Button size." },
        { name: "tilt", type: 'number | "auto" | false', default: '"auto"', description: "Resting angle of the button sticker." },
      ],
    },
  ],
  a11y: [
    "role=alertdialog: clicking the overlay does not close it, so the choice is explicit.",
    "Focus lands on Cancel first, so Enter never destroys anything by accident.",
    "Escape cancels.",
  ],
  do: [
    "Name the consequence in the description.",
    "Repeat the verb on the confirm button: “Delete team”.",
  ],
  dont: [
    "Don't use it for reversible actions. Use a toast with Undo instead.",
    "Don't make Cancel pink. The destructive button is the only loud one.",
  ],
};
