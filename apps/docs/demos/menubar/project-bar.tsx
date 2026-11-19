"use client";
import * as React from "react";
import {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from "@pixel3d/ui";

export default function MenubarProjectBar() {
  const [timer, setTimer] = React.useState(true);
  const [board, setBoard] = React.useState(false);
  const [role, setRole] = React.useState("hacker");
  return (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger>Project</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>
            New submission <MenubarShortcut>⌘N</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            Open repo <MenubarShortcut>⌘O</MenubarShortcut>
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem disabled>Export pitch deck</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Team</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>Invite teammate</MenubarItem>
          <MenubarSub>
            <MenubarSubTrigger>My role</MenubarSubTrigger>
            <MenubarSubContent>
              <MenubarRadioGroup value={role} onValueChange={setRole}>
                <MenubarRadioItem value="hacker">Hacker</MenubarRadioItem>
                <MenubarRadioItem value="designer">Designer</MenubarRadioItem>
                <MenubarRadioItem value="pitcher">Pitcher</MenubarRadioItem>
              </MenubarRadioGroup>
            </MenubarSubContent>
          </MenubarSub>
          <MenubarSeparator />
          <MenubarItem variant="destructive">Leave team</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>View</MenubarTrigger>
        <MenubarContent>
          <MenubarCheckboxItem checked={timer} onCheckedChange={setTimer}>
            Countdown timer
          </MenubarCheckboxItem>
          <MenubarCheckboxItem checked={board} onCheckedChange={setBoard}>
            Live leaderboard
          </MenubarCheckboxItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
}
