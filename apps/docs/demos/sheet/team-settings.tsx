import { Gear } from "pixelarticons/react";
import {
  Button,
  Input,
  Label,
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  Switch,
} from "@pixel3d/ui";

export default function SheetTeamSettings() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="secondary">
          <Gear /> Team settings
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Team settings</SheetTitle>
          <SheetDescription>Changes save for everyone on the team.</SheetDescription>
        </SheetHeader>
        <div className="flex flex-col gap-5">
          <Input label="Team name" defaultValue="Null Pointers" />
          <Input label="Table" defaultValue="B-14" />
          <Label className="text-ink">
            <Switch defaultChecked /> Open to new members
          </Label>
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button>Save</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
