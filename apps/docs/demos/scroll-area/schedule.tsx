import * as React from "react";
import { ScrollArea, Separator } from "@pixel3d/ui";

const slots = [
  ["Fri 6pm", "Kickoff"],
  ["Fri 7pm", "Team forming"],
  ["Fri 9pm", "API workshop"],
  ["Sat 12am", "Midnight pizza"],
  ["Sat 10am", "Mentor hours"],
  ["Sat 3pm", "Hardware lab opens"],
  ["Sat 8pm", "Karaoke break"],
  ["Sun 11am", "Code freeze"],
  ["Sun 2pm", "Demos"],
  ["Sun 5pm", "Prizes"],
];

export default function ScrollAreaSchedule() {
  return (
    <div className="sticker sticker-lg face-paper w-full max-w-sm p-2">
      <ScrollArea className="h-72">
        <div className="flex flex-col gap-3 py-3 pl-4 pr-6">
          {slots.map(([time, what], i) => (
            <React.Fragment key={time}>
              {i > 0 && <Separator />}
              <div className="flex items-baseline justify-between gap-4 text-lg">
                <span className="font-extrabold">{what}</span>
                <span className="text-base font-medium tabular-nums text-ink-soft">{time}</span>
              </div>
            </React.Fragment>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
