"use client";
import * as React from "react";
import { ChevronsVertical } from "pixelarticons/react";
import { Button, Collapsible, CollapsibleContent, CollapsibleTrigger } from "@pixel3d/ui";

const more = ["Priya, design", "Tomás, backend", "Ade, hardware"];

export default function CollapsibleRoster() {
  const [open, setOpen] = React.useState(false);
  return (
    <Collapsible open={open} onOpenChange={setOpen} className="flex w-full max-w-sm flex-col gap-4">
      <div className="flex items-center justify-between gap-4">
        <h4 className="text-xl font-extrabold">Team Voxel Pets</h4>
        <CollapsibleTrigger asChild>
          <Button variant="secondary" size="icon" aria-label={open ? "Hide teammates" : "Show teammates"}>
            <ChevronsVertical />
          </Button>
        </CollapsibleTrigger>
      </div>
      <div className="sticker face-paper px-5 py-3 text-lg font-semibold">Mia, frontend</div>
      <CollapsibleContent className="flex flex-col gap-4">
        {more.map((m) => (
          <div key={m} className="sticker face-paper px-5 py-3 text-lg font-semibold">
            {m}
          </div>
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
}
