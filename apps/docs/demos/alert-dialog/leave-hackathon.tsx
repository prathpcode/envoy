import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  Button,
} from "@pixel3d/ui";

export default function AlertDialogLeave() {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="secondary">Withdraw submission</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Pull Pixel Pets from judging?</AlertDialogTitle>
          <AlertDialogDescription>You can resubmit until the deadline at 09:00.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Stay in</AlertDialogCancel>
          <AlertDialogAction>Withdraw</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
