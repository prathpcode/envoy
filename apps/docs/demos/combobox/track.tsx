"use client";
import * as React from "react";
import { CircuitBoard, Gamepad, Leaf, Robot, Teach } from "pixelarticons/react";
import { Combobox } from "@pixel3d/ui";

const tracks = [
  { value: "ai", label: "AI agents", icon: <Robot /> },
  { value: "hardware", label: "Hardware hacks", icon: <CircuitBoard /> },
  { value: "climate", label: "Climate tech", icon: <Leaf /> },
  { value: "games", label: "Games", icon: <Gamepad /> },
  { value: "edtech", label: "Learning tools", icon: <Teach />, keywords: ["education"] },
];

export default function ComboboxTrack() {
  const [track, setTrack] = React.useState("");
  return (
    <div className="w-full max-w-sm">
      <Combobox
        label="Your track"
        options={tracks}
        value={track}
        onValueChange={setTrack}
        placeholder="Pick your track"
        searchPlaceholder="Search tracks"
        emptyText="No track by that name."
      />
    </div>
  );
}
