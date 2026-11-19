"use client";
import {
  BarChart,
  CartesianGrid,
  ChartBar,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  XAxis,
  YAxis,
  type ChartConfig,
} from "@pixel3d/ui";

const data = [
  { hour: "18:00", commits: 12 },
  { hour: "20:00", commits: 31 },
  { hour: "22:00", commits: 46 },
  { hour: "00:00", commits: 38 },
  { hour: "02:00", commits: 17 },
  { hour: "04:00", commits: 9 },
  { hour: "06:00", commits: 24 },
  { hour: "08:00", commits: 52 },
];

const config = {
  commits: { label: "Commits" },
} satisfies ChartConfig;

export default function ChartBarDemo() {
  return (
    <div className="sticker sticker-lg face-paper w-full max-w-2xl p-6">
      <ChartContainer config={config} className="aspect-auto h-72">
        <BarChart data={data} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
          <CartesianGrid vertical={false} />
          <XAxis dataKey="hour" tickLine={false} axisLine={false} tickMargin={10} />
          <YAxis tickLine={false} axisLine={false} width={40} />
          <ChartTooltip cursor content={<ChartTooltipContent />} />
          <ChartBar dataKey="commits" fill="var(--color-commits)" />
        </BarChart>
      </ChartContainer>
    </div>
  );
}
