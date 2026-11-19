"use client";
import * as React from "react";
import { Calendar, Chart, CircuitBoard, Leaf, Brush, Robot, Upload } from "pixelarticons/react";
import {
  Button,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@pixel3d/ui";

const tracks = [
  { icon: Robot, name: "AI agents" },
  { icon: CircuitBoard, name: "Hardware hacks" },
  { icon: Leaf, name: "Climate tech" },
  { icon: Brush, name: "Best design" },
];

export default function CommandPalette() {
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <Button variant="secondary" onClick={() => setOpen(true)}>
        Jump to a track <CommandShortcut className="ml-1">⌘K</CommandShortcut>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput label="Jump to" placeholder="Track, team or page" />
        <CommandList>
          <CommandEmpty>No track by that name.</CommandEmpty>
          <CommandGroup heading="Tracks">
            {tracks.map(({ icon: Icon, name }) => (
              <CommandItem key={name} onSelect={() => setOpen(false)}>
                <Icon /> {name}
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Pages">
            <CommandItem onSelect={() => setOpen(false)}>
              <Calendar /> Schedule <CommandShortcut>⌘S</CommandShortcut>
            </CommandItem>
            <CommandItem onSelect={() => setOpen(false)}>
              <Chart /> Leaderboard <CommandShortcut>⌘L</CommandShortcut>
            </CommandItem>
            <CommandItem onSelect={() => setOpen(false)}>
              <Upload /> Submit project
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
