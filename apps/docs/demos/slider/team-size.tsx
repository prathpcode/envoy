"use client";
import * as React from "react";
import { Slider } from "@pixel3d/ui";

export default function SliderTeamSize() {
  const [size, setSize] = React.useState([3]);
  return (
    <div className="flex w-full max-w-md flex-col gap-4">
      <p className="text-lg font-bold text-on-lid">Team of {size[0]}</p>
      <Slider value={size} onValueChange={setSize} min={1} max={5} step={1} aria-label="Team size" />
    </div>
  );
}
