import { UserPlus } from "pixelarticons/react";
import { Button, Input, Popover, PopoverContent, PopoverTrigger } from "@pixel3d/ui";

export default function PopoverInvite() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="secondary">
          <UserPlus /> Invite teammate
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <h4 className="text-xl font-extrabold leading-tight">Invite to Null Pointers</h4>
        <Input label="GitHub handle" placeholder="ada-codes" />
        <Button className="self-end" size="sm">
          Send invite
        </Button>
      </PopoverContent>
    </Popover>
  );
}
