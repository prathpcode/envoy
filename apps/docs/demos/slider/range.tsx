"use client";
import * as React from "react";
import { Slider } from "@pixel3d/ui";

const clock = (h: number) => `${String(h % 24).padStart(2, "0")}:00`;

export default function SliderRange() {
  const [hours, setHours] = React.useState([10, 22]);
  return (
    <div className="flex w-full max-w-md flex-col gap-4">
      <p className="text-lg font-bold text-on-lid tabular-nums">
        Awake from {clock(hours[0])} to {clock(hours[1])}
      </p>
      <Slider
        value={hours}
        onValueChange={setHours}
        min={6}
        max={30}
        minStepsBetweenThumbs={2}
        formatValue={clock}
        thumbLabels={["Start hacking", "Stop hacking"]}
      />
    </div>
  );
}
