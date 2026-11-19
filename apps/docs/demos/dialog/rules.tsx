import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@pixel3d/ui";

export default function DialogRules() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary">Read the rules</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Three rules</DialogTitle>
          <DialogDescription>Short version. The judges are strict about the first one.</DialogDescription>
        </DialogHeader>
        <ol className="flex list-decimal flex-col gap-3 pl-6 text-[17px] leading-relaxed">
          <li>Write every line of code during the 36 hours.</li>
          <li>Teams of up to four. Solo is fine.</li>
          <li>Demo something that runs, not slides.</li>
        </ol>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="success">Got it</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
