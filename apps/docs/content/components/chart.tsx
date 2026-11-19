import type { ComponentDoc } from "@/lib/types";
import Bar from "@/demos/chart/bar";
import Line from "@/demos/chart/line";

export const doc: ComponentDoc = {
  slug: "chart",
  name: "Chart",
  category: "Data display",
  summary: "Recharts in pixels: square bars, stepped lines, square markers and a paper-sticker tooltip.",
  files: ["components/chart.tsx", "styles/data.css", "lib/utils.ts"],
  dependencies: ["recharts"],
  demos: [
    { id: "bar", title: "Commits per hour", Component: Bar, height: 400 },
    { id: "line", title: "Two teams, stepped", Component: Line, height: 460 },
  ],
  usage: `
import { BarChart, XAxis } from "recharts";
import {
  ChartContainer, ChartTooltip, ChartTooltipContent, ChartBar, type ChartConfig,
} from "@/components/ui/chart";

const config = { commits: { label: "Commits" } } satisfies ChartConfig;

<ChartContainer config={config} className="aspect-auto h-72">
  <BarChart data={data}>
    <XAxis dataKey="hour" />
    <ChartTooltip content={<ChartTooltipContent />} />
    <ChartBar dataKey="commits" fill="var(--color-commits)" />
  </BarChart>
</ChartContainer>
`,
  props: [
    {
      component: "ChartContainer",
      rows: [
        { name: "config", type: "Record<string, { label?, icon?, color? }>", description: "One entry per series. Each colour becomes var(--color-<key>); missing colours take pink, sky, lime, butter, tomato in order." },
      ],
    },
    {
      component: "ChartTooltipContent",
      rows: [
        { name: "indicator", type: '"square" | "line" | "dashed"', default: '"square"', description: "Swatch shape next to each value." },
        { name: "hideLabel", type: "boolean", default: "false", description: "Drop the heading row." },
        { name: "nameKey / labelKey", type: "string", description: "Which payload field names the rows and the heading." },
      ],
    },
    {
      component: "ChartLine / ChartBar",
      rows: [
        { name: "…Line / Bar props", type: "Recharts props", description: 'Pixel defaults: type="step", 4px stroke and square ChartDot markers; bars get square ends.' },
      ],
    },
  ],
  a11y: [
    "Recharts' accessibility layer is on: arrow keys move the tooltip between points.",
    "Give the chart a heading or aria-label nearby; the SVG alone has no name.",
    "Inks are paired with labels in the legend and tooltip, never colour alone.",
  ],
  do: ["Put the chart on a paper sticker so axis ink reads in both themes.", "Use stepped lines: the data moves in pixels."],
  dont: ["Don't add rounded bar radius.", "Don't plot more than five series: there are five inks."],
};
