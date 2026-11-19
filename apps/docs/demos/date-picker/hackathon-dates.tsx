"use client";
import * as React from "react";
import { DateRangePicker, type DateRange } from "@pixel3d/ui";

export default function DatePickerHackathonDates() {
  const [range, setRange] = React.useState<DateRange | undefined>({
    from: new Date(2026, 10, 21),
    to: new Date(2026, 10, 23),
  });
  return (
    <div className="w-full max-w-sm">
      <DateRangePicker
        label="Hackathon dates"
        value={range}
        onValueChange={setRange}
        calendarProps={{ disabled: { before: new Date(2026, 10, 1) } }}
      />
    </div>
  );
}
