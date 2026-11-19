"use client";
import * as React from "react";
import { DatePicker } from "@pixel3d/ui";

export default function DatePickerDeadline() {
  const [date, setDate] = React.useState<Date | undefined>();
  return (
    <div className="w-full max-w-sm">
      <DatePicker
        label="Submission deadline"
        value={date}
        onValueChange={setDate}
        calendarProps={{ defaultMonth: new Date(2026, 10, 1) }}
      />
    </div>
  );
}
