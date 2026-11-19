"use client";
import * as React from "react";
import { Calendar, type DateRange } from "@pixel3d/ui";

export default function CalendarRange() {
  const [range, setRange] = React.useState<DateRange | undefined>({
    from: new Date(2026, 10, 21),
    to: new Date(2026, 10, 23),
  });
  return (
    <Calendar
      mode="range"
      numberOfMonths={2}
      selected={range}
      onSelect={setRange}
      defaultMonth={new Date(2026, 10, 1)}
    />
  );
}
