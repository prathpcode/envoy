import { ChevronDown, Gear, Logout, RoadSign, UserPlus } from "pixelarticons/react";
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@pixel3d/ui";

export default function DropdownMenuTeam() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary">
          Null Pointers <ChevronDown />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64" align="start">
        <DropdownMenuLabel>Team</DropdownMenuLabel>
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <UserPlus /> Invite teammate <DropdownMenuShortcut>⌘I</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Gear /> Settings <DropdownMenuShortcut>⌘,</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <RoadSign /> Switch track
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuItem>AI agents</DropdownMenuItem>
              <DropdownMenuItem>Hardware hacks</DropdownMenuItem>
              <DropdownMenuItem>Climate tech</DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive">
          <Logout /> Leave team
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
