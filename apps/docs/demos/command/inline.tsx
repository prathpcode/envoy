import { CircuitBoard, Leaf, Brush, Robot } from "pixelarticons/react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@pixel3d/ui";

export default function CommandInline() {
  return (
    <div className="w-full max-w-md">
      <Command>
        <CommandInput placeholder="Search tracks" aria-label="Search tracks" />
        <CommandList>
          <CommandEmpty>No track by that name.</CommandEmpty>
          <CommandGroup heading="Tracks">
            <CommandItem>
              <Robot /> AI agents
            </CommandItem>
            <CommandItem>
              <CircuitBoard /> Hardware hacks
            </CommandItem>
            <CommandItem>
              <Leaf /> Climate tech
            </CommandItem>
            <CommandItem disabled>
              <Brush /> Best design (full)
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </div>
  );
}
