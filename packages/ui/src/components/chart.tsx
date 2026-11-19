"use client";
import * as React from "react";
import * as RechartsPrimitive from "recharts";
import { cn } from "../lib/utils";

/**
 * Chart — the shadcn chart pattern over Recharts 3, in pixels.
 * ChartContainer takes a config (label + colour per series) and exposes each colour as
 * `var(--color-<key>)`. Series without a colour take the inks in order:
 * pink, sky, lime, butter, tomato. Axis text is currentColor at 14px; grids are dashed
 * pixel rules. ChartBar / ChartLine carry the pixel defaults (square ends, stepped
 * lines, square dot markers). The tooltip is a paper sticker.
 *
 *   <ChartContainer config={{ commits: { label: "Commits" } }} className="h-64 w-full">
 *     <BarChart data={data}>
 *       <XAxis dataKey="hour" />
 *       <ChartTooltip content={<ChartTooltipContent />} />
 *       <ChartBar dataKey="commits" fill="var(--color-commits)" />
 *     </BarChart>
 *   </ChartContainer>
 */

/*
 * The Recharts chart shells and axes, re-exported so apps that only depend on
 * @pixel3d/ui can build charts. Everything else lives on the `Recharts` namespace.
 * (Copied into a shadcn app, import these straight from "recharts".)
 */
export { BarChart, LineChart, AreaChart, ComposedChart, XAxis, YAxis, CartesianGrid } from "recharts";
export * as Recharts from "recharts";

/** The ink order series fall back to. */
export const CHART_INKS = ["#ff3d8b", "#36b8ff", "#b6f23a", "#ffd23f", "#ff5a36"] as const;

export type ChartConfig = Record<
  string,
  {
    label?: React.ReactNode;
    icon?: React.ComponentType;
    color?: string;
  }
>;

type ChartContextProps = { config: ChartConfig };
const ChartContext = React.createContext<ChartContextProps | null>(null);

export function useChart() {
  const context = React.useContext(ChartContext);
  if (!context) throw new Error("useChart must be used within a <ChartContainer />");
  return context;
}

/** Fills missing colours with the inks in order. */
function resolveConfig(config: ChartConfig): ChartConfig {
  let i = 0;
  const out: ChartConfig = {};
  for (const [key, item] of Object.entries(config)) {
    out[key] = { ...item, color: item.color ?? CHART_INKS[i % CHART_INKS.length] };
    i++;
  }
  return out;
}

export interface ChartContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  config: ChartConfig;
  children: React.ComponentProps<typeof RechartsPrimitive.ResponsiveContainer>["children"];
}

export const ChartContainer = React.forwardRef<HTMLDivElement, ChartContainerProps>(
  ({ id, className, children, config, ...props }, ref) => {
    const uniqueId = React.useId();
    const chartId = `chart-${(id ?? uniqueId).replace(/[^a-zA-Z0-9_-]/g, "")}`;
    const resolved = React.useMemo(() => resolveConfig(config), [config]);
    return (
      <ChartContext.Provider value={{ config: resolved }}>
        <div
          ref={ref}
          data-slot="chart"
          data-chart={chartId}
          className={cn("chart-pixel flex aspect-video w-full justify-center text-sm", className)}
          {...props}
        >
          <ChartStyle id={chartId} config={resolved} />
          <RechartsPrimitive.ResponsiveContainer initialDimension={{ width: 640, height: 320 }}>
            {children}
          </RechartsPrimitive.ResponsiveContainer>
        </div>
      </ChartContext.Provider>
    );
  }
);
ChartContainer.displayName = "ChartContainer";

export function ChartStyle({ id, config }: { id: string; config: ChartConfig }) {
  const vars = Object.entries(config)
    .filter(([, c]) => c.color)
    .map(([key, c]) => `  --color-${key.replace(/[^a-zA-Z0-9_-]/g, "")}: ${c.color};`)
    .join("\n");
  if (!vars) return null;
  return <style dangerouslySetInnerHTML={{ __html: `[data-chart=${id}] {\n${vars}\n}` }} />;
}

/* ── pixel series ─────────────────────────────────────────── */

type DotLike = { cx?: number | string; cy?: number | string; stroke?: string; fill?: unknown; index?: number };

/** A square pixel marker (use as a Line's `dot`): the series ink with a white kiss-cut. */
export function ChartDot({ cx, cy, stroke, index, size = 10, color }: DotLike & { size?: number; color?: string }) {
  if (cx == null || cy == null) return null;
  const x = Math.round(Number(cx) - size / 2);
  const y = Math.round(Number(cy) - size / 2);
  return (
    <rect
      key={`dot-${index ?? `${x}-${y}`}`}
      x={x}
      y={y}
      width={size}
      height={size}
      fill={color ?? stroke ?? "currentColor"}
      stroke="#ffffff"
      strokeWidth={2}
      shapeRendering="crispEdges"
    />
  );
}

/** The bigger square marker shown on hover (a Line's `activeDot`). Recharts hands it the ink as `fill`. */
export function ChartActiveDot(props: DotLike) {
  const ink = typeof props.fill === "string" && props.fill.toLowerCase() !== "#fff" ? props.fill : props.stroke;
  return <ChartDot {...props} color={ink} size={16} />;
}

export type ChartLineProps = React.ComponentProps<typeof RechartsPrimitive.Line>;

/** A Recharts Line with pixel defaults: stepped, 4px, square markers. */
export function ChartLine(props: ChartLineProps) {
  return (
    <RechartsPrimitive.Line
      type="step"
      strokeWidth={4}
      dot={ChartDot}
      activeDot={ChartActiveDot}
      animationEasing="linear"
      {...props}
    />
  );
}

export type ChartBarProps = React.ComponentProps<typeof RechartsPrimitive.Bar>;

/** A Recharts Bar with pixel defaults: square ends, no smooth radius. */
export function ChartBar(props: ChartBarProps) {
  return <RechartsPrimitive.Bar radius={0} maxBarSize={48} animationEasing="linear" {...props} />;
}

/* ── tooltip ──────────────────────────────────────────────── */

export const ChartTooltip = RechartsPrimitive.Tooltip;

type TooltipEntry = RechartsPrimitive.TooltipPayloadEntry;

export interface ChartTooltipContentProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "color"> {
  active?: boolean;
  payload?: ReadonlyArray<TooltipEntry>;
  label?: React.ReactNode;
  labelFormatter?: (label: React.ReactNode, payload: ReadonlyArray<TooltipEntry>) => React.ReactNode;
  formatter?: (value: unknown, name: unknown, item: TooltipEntry, index: number) => React.ReactNode;
  labelClassName?: string;
  /** Swatch shape: a pixel square, a 4px bar, or a dashed bar. */
  indicator?: "square" | "line" | "dashed";
  hideLabel?: boolean;
  hideIndicator?: boolean;
  /** Override the swatch colour for every row. */
  color?: string;
  nameKey?: string;
  labelKey?: string;
}

export const ChartTooltipContent = React.forwardRef<HTMLDivElement, ChartTooltipContentProps>(
  (
    {
      active,
      payload,
      className,
      indicator = "square",
      hideLabel = false,
      hideIndicator = false,
      label,
      labelFormatter,
      labelClassName,
      formatter,
      color,
      nameKey,
      labelKey,
      // recharts passes these through to custom content; keep them off the DOM
      ...rest
    },
    ref
  ) => {
    const { config } = useChart();
    const domProps = pickDomProps(rest);

    const tooltipLabel = React.useMemo(() => {
      if (hideLabel || !payload?.length) return null;
      const [item] = payload;
      const key = `${labelKey ?? item?.dataKey ?? item?.name ?? "value"}`;
      const itemConfig = getPayloadConfigFromPayload(config, item, key);
      const value = !labelKey && typeof label === "string" ? (config[label]?.label ?? label) : itemConfig?.label;
      if (labelFormatter) {
        return <div className={cn("text-base font-extrabold", labelClassName)}>{labelFormatter(value ?? label, payload)}</div>;
      }
      const shown = value ?? label;
      if (shown == null || shown === "") return null;
      return <div className={cn("text-base font-extrabold", labelClassName)}>{shown}</div>;
    }, [label, labelFormatter, payload, hideLabel, labelClassName, config, labelKey]);

    if (!active || !payload?.length) return null;

    return (
      <div
        ref={ref}
        data-slot="chart-tooltip"
        className={cn("sticker face-paper flex min-w-40 flex-col gap-2 px-4 py-3 text-sm", className)}
        {...domProps}
      >
        {tooltipLabel}
        <div className="flex flex-col gap-1.5">
          {payload
            .filter((item) => item.type !== "none")
            .map((item, index) => {
              const key = `${nameKey ?? item.name ?? item.dataKey ?? "value"}`;
              const itemConfig = getPayloadConfigFromPayload(config, item, key);
              const swatch = color ?? (item.payload as { fill?: string } | undefined)?.fill ?? item.color;
              return (
                <div key={`${item.dataKey ?? index}`} className="flex items-center gap-2.5">
                  {formatter && item.value !== undefined && item.name ? (
                    formatter(item.value, item.name, item, index)
                  ) : (
                    <>
                      {itemConfig?.icon ? (
                        <itemConfig.icon />
                      ) : (
                        !hideIndicator && (
                          <span
                            aria-hidden
                            className={cn(
                              "shrink-0",
                              indicator === "square" && "size-3",
                              indicator === "line" && "h-1 w-4",
                              indicator === "dashed" && "h-1 w-4 [background-image:linear-gradient(90deg,var(--sw)_50%,transparent_50%)] [background-size:8px_4px]"
                            )}
                            style={{
                              ["--sw" as string]: swatch,
                              backgroundColor: indicator === "dashed" ? undefined : swatch,
                              boxShadow: "0 0 0 2px rgb(20 20 20 / 0.12)",
                            }}
                          />
                        )
                      )}
                      <span className="flex-1 font-medium text-ink-soft">{itemConfig?.label ?? item.name}</span>
                      {item.value != null && (
                        <span className="font-extrabold tabular-nums text-ink">
                          {typeof item.value === "number" ? item.value.toLocaleString() : String(item.value)}
                        </span>
                      )}
                    </>
                  )}
                </div>
              );
            })}
        </div>
      </div>
    );
  }
);
ChartTooltipContent.displayName = "ChartTooltipContent";

/* ── legend ───────────────────────────────────────────────── */

export const ChartLegend = RechartsPrimitive.Legend;

export interface ChartLegendContentProps extends React.HTMLAttributes<HTMLDivElement> {
  payload?: ReadonlyArray<RechartsPrimitive.LegendPayload>;
  verticalAlign?: "top" | "bottom" | "middle";
  hideIcon?: boolean;
  nameKey?: string;
}

export const ChartLegendContent = React.forwardRef<HTMLDivElement, ChartLegendContentProps>(
  ({ className, hideIcon = false, payload, verticalAlign = "bottom", nameKey, ...rest }, ref) => {
    const { config } = useChart();
    if (!payload?.length) return null;
    return (
      <div
        ref={ref}
        data-slot="chart-legend"
        className={cn(
          "flex flex-wrap items-center justify-center gap-5",
          verticalAlign === "top" ? "pb-4" : "pt-4",
          className
        )}
        {...pickDomProps(rest)}
      >
        {payload
          .filter((item) => item.type !== "none")
          .map((item) => {
            const key = `${nameKey ?? item.dataKey ?? "value"}`;
            const itemConfig = getPayloadConfigFromPayload(config, item, key);
            return (
              <div key={String(item.value ?? key)} className="flex items-center gap-2 text-sm font-bold">
                {itemConfig?.icon && !hideIcon ? (
                  <itemConfig.icon />
                ) : (
                  <span
                    aria-hidden
                    className="size-3 shrink-0"
                    style={{ backgroundColor: item.color, boxShadow: "0 0 0 2px rgb(255 255 255 / 0.9)" }}
                  />
                )}
                {itemConfig?.label ?? item.value}
              </div>
            );
          })}
      </div>
    );
  }
);
ChartLegendContent.displayName = "ChartLegendContent";

/* ── helpers ──────────────────────────────────────────────── */

const DOM_SAFE = new Set(["id", "style", "role", "title", "tabIndex"]);
/** Recharts clones custom content with many non-DOM props; only forward the safe ones. */
function pickDomProps(rest: Record<string, unknown>) {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(rest)) {
    if (DOM_SAFE.has(k) || k.startsWith("aria-") || k.startsWith("data-")) out[k] = v;
  }
  return out as React.HTMLAttributes<HTMLDivElement>;
}

function getPayloadConfigFromPayload(config: ChartConfig, payload: unknown, key: string) {
  if (typeof payload !== "object" || payload === null) return undefined;
  const inner =
    "payload" in payload && typeof (payload as { payload?: unknown }).payload === "object"
      ? ((payload as { payload?: Record<string, unknown> }).payload ?? undefined)
      : undefined;
  let configKey: string = key;
  const p = payload as Record<string, unknown>;
  if (key in p && typeof p[key] === "string") configKey = p[key] as string;
  else if (inner && key in inner && typeof inner[key] === "string") configKey = inner[key] as string;
  return configKey in config ? config[configKey] : config[key];
}
