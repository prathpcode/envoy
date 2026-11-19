"use client";
import {
  CartesianGrid,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartLine,
  ChartTooltip,
  ChartTooltipContent,
  LineChart,
  XAxis,
  YAxis,
  type ChartConfig,
} from "@pixel3d/ui";

const data = [
  { hour: "18:00", nullPointers: 4, offByOne: 2 },
  { hour: "20:00", nullPointers: 11, offByOne: 9 },
  { hour: "22:00", nullPointers: 18, offByOne: 14 },
  { hour: "00:00", nullPointers: 9, offByOne: 21 },
  { hour: "02:00", nullPointers: 3, offByOne: 12 },
  { hour: "04:00", nullPointers: 0, offByOne: 6 },
  { hour: "06:00", nullPointers: 8, offByOne: 3 },
  { hour: "08:00", nullPointers: 22, offByOne: 15 },
];

// no colours given: series take the inks in order (pink, then sky)
const config = {
  nullPointers: { label: "Null Pointers" },
  offByOne: { label: "Off By One" },
} satisfies ChartConfig;

export default function ChartLineDemo() {
  return (
    <div className="sticker sticker-lg face-paper w-full max-w-2xl p-6">
      <ChartContainer config={config} className="aspect-auto h-80">
        <LineChart data={data} margin={{ top: 12, right: 12, left: -12, bottom: 0 }}>
          <CartesianGrid vertical={false} />
          <XAxis dataKey="hour" tickLine={false} axisLine={false} tickMargin={10} />
          <YAxis tickLine={false} axisLine={false} width={40} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <ChartLegend content={<ChartLegendContent />} />
          <ChartLine dataKey="nullPointers" stroke="var(--color-nullPointers)" />
          <ChartLine dataKey="offByOne" stroke="var(--color-offByOne)" />
        </LineChart>
      </ChartContainer>
    </div>
  );
}
