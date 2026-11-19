"use client";
import * as React from "react";
import { Label, Switch } from "@pixel3d/ui";

export default function SwitchControlled() {
  const [open, setOpen] = React.useState(true);
  return (
    <div className="flex flex-col items-center gap-6">
      <Label>
        <Switch checked={open} onCheckedChange={setOpen} />
        Submissions open
      </Label>
      <p className="text-lg font-bold text-on-lid">{open ? "Teams can submit until 18:00." : "Submissions are closed."}</p>
    </div>
  );
}
