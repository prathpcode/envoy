import type { ComponentDoc } from "@/lib/types";
import Single from "@/demos/calendar/single";
import Range from "@/demos/calendar/range";

export const doc: ComponentDoc = {
  slug: "calendar",
  name: "Calendar",
  category: "Forms",
  summary: "A grid of small square stickers. The day you pick becomes a lime sticker that lands, and today has a pink underline.",
  files: ["components/calendar.tsx", "lib/utils.ts"],
  dependencies: ["react-day-picker", "pixelarticons"],
  demos: [
    { id: "single", title: "Pick a day", Component: Single, height: 480 },
    { id: "range", title: "Pick a range", Component: Range, height: 480 },
  ],
  usage: `
import { Calendar } from "@/components/ui/calendar";

const [day, setDay] = React.useState<Date | undefined>();
<Calendar mode="single" selected={day} onSelect={setDay} />
`,
  props: [
    {
      component: "Calendar",
      rows: [
        { name: "frame", type: "boolean", default: "true", description: "Draw the calendar on its own paper sticker. Pass false inside a Popover or Card." },
        { name: "mode", type: '"single" | "multiple" | "range"', description: "Selection mode (react-day-picker)." },
        { name: "showOutsideDays", type: "boolean", default: "true", description: "Show the trailing days of the previous and next months." },
        { name: "numberOfMonths", type: "number", default: "1", description: "Months side by side. They stack on small screens." },
      ],
    },
  ],
  a11y: [
    "react-day-picker grid: arrow keys move by day and week, and PageUp/PageDown move by month.",
    "Each day button has a full date label, and the selection is announced.",
    "Previous and next are labelled buttons with pixel chevrons.",
  ],
  do: ["Disable days that can't be picked rather than erroring after the fact."],
  dont: ["Don't use a calendar for a birthday. Typing the date is faster."],
};
