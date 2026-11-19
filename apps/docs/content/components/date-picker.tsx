import type { ComponentDoc } from "@/lib/types";
import Deadline from "@/demos/date-picker/deadline";
import HackathonDates from "@/demos/date-picker/hackathon-dates";

export const doc: ComponentDoc = {
  slug: "date-picker",
  name: "Date Picker",
  category: "Forms",
  summary: "A name-tag field that opens a Calendar sticker, for one day or a range.",
  files: ["components/date-picker.tsx", "lib/utils.ts"],
  dependencies: ["react-day-picker", "radix-ui", "pixelarticons"],
  registryDependencies: ["calendar", "popover", "input"],
  demos: [
    { id: "deadline", title: "One day", Component: Deadline, height: 220 },
    { id: "hackathon-dates", title: "Date range", Component: HackathonDates, height: 220 },
  ],
  usage: `
import { DatePicker, DateRangePicker } from "@/components/ui/date-picker";

<DatePicker label="Submission deadline" value={date} onValueChange={setDate} />
<DateRangePicker label="Hackathon dates" value={range} onValueChange={setRange} />
`,
  props: [
    {
      component: "DatePicker",
      rows: [
        { name: "value", type: "Date | undefined", description: "Controlled date." },
        { name: "defaultValue", type: "Date", description: "Uncontrolled starting date." },
        { name: "onValueChange", type: "(date: Date | undefined) => void", description: "Called when a day is picked. The popover closes." },
        { name: "label", type: "ReactNode", description: "Band text on the name tag." },
        { name: "placeholder", type: "string", default: '"Pick a date"', description: "Shown until a date is picked." },
        { name: "formatDate", type: "(date: Date) => string", default: "Nov 21, 2026", description: "How the picked date reads in the field." },
        { name: "calendarProps", type: "CalendarProps", description: "Passed to the Calendar: disabled days, defaultMonth, locale." },
        { name: "disabled", type: "boolean", default: "false", description: "Blank and inert." },
      ],
    },
    {
      component: "DateRangePicker",
      rows: [
        { name: "value", type: "DateRange | undefined", description: "Controlled { from, to } range." },
        { name: "onValueChange", type: "(range: DateRange | undefined) => void", description: "Called on every click. The popover stays open." },
        { name: "numberOfMonths", type: "number", default: "2", description: "Months side by side." },
      ],
    },
  ],
  a11y: [
    "The trigger is a button whose name reads the label and the current date.",
    "Opening moves focus into the calendar grid, and Escape returns it to the field.",
  ],
  do: ["Start the calendar on the month that matters with calendarProps.defaultMonth."],
  dont: ["Don't add helper text under the field; the label says what date it wants."],
};
