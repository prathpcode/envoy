import type { ComponentDoc } from "@/lib/types";
import Deadline from "@/demos/countdown/deadline";
import Ended from "@/demos/countdown/ended";

export const doc: ComponentDoc = {
  slug: "countdown",
  name: "Countdown",
  category: "Hackathon kit",
  summary: "A big days, hours, minutes, seconds readout where each unit is a paper sticker that flips over when it ticks.",
  files: ["components/countdown.tsx", "styles/kit.css", "lib/utils.ts"],
  demos: [
    { id: "deadline", title: "Submissions close", Component: Deadline, height: 300 },
    { id: "ended", title: "When time runs out", Component: Ended, height: 340 },
  ],
  usage: `
import { Countdown } from "@/components/ui/countdown";

<Countdown to="2026-11-21T18:00:00Z" onComplete={lockSubmissions} />
`,
  props: [
    {
      component: "Countdown",
      rows: [
        { name: "to", type: "Date | number | string", description: "The deadline, as a Date, a timestamp in ms or an ISO string." },
        { name: "ended", type: "ReactNode", default: '"Time\'s up"', description: "What lands in place of the units once the deadline passes." },
        { name: "onComplete", type: "() => void", description: "Fires once when the clock reaches zero while it's on screen (not when it mounts already ended)." },
        { name: "hideDays", type: "boolean", default: "false", description: "Drop the days sticker for countdowns under a day." },
      ],
    },
  ],
  a11y: [
    "role=timer, with a visually hidden line that reads the time left to the minute.",
    "The flipping stickers are aria-hidden, so screen readers aren't spammed every second.",
    "The server renders placeholders, so there's no hydration flash of a wrong time.",
    "Flips become instant under prefers-reduced-motion.",
  ],
  do: ["Use one per page, for the deadline that matters.", "Say what ends in the heading above it."],
  dont: ["Don't put countdowns in table rows.", "Don't add a caption under each unit beyond its name."],
};
