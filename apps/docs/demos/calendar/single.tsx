"use client";
import * as React from "react";
import { Calendar } from "@pixel3d/ui";

export default function CalendarSingle() {
  const [day, setDay] = React.useState<Date | undefined>(new Date(2026, 10, 21));
  return <Calendar mode="single" selected={day} onSelect={setDay} defaultMonth={new Date(2026, 10, 1)} />;
}
