"use client";

import { useMemo } from "react";
import {
  ComposedChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
} from "recharts";
import type { DemandGrowthPoint } from "@/lib/data/types";
import { CHART_COLORS } from "@/lib/charts/colors";
import { formatTwh } from "@/lib/charts/formatters";

interface DemandGrowthChartProps {
  data: DemandGrowthPoint[];
}

const DRIVER_CONFIG = [
  { key: "baselineDemand", label: "Baseline Demand", color: CHART_COLORS.neutral },
  { key: "dataCenters", label: "Data Centers", color: "#332288" },
  { key: "evs", label: "EVs", color: "#88CCEE" },
  { key: "electrification", label: "Electrification", color: "#44AA99" },
  { key: "onshoring", label: "Onshoring", color: "#DDCC77" },
] as const;

interface TooltipPayloadEntry {
  color: string;
  name: string;
  value: number;
  dataKey: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadEntry[];
  label?: number;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;

  const nonZeroEntries = payload.filter((e) => e.value > 0);
  const total = nonZeroEntries.reduce((sum, entry) => sum + entry.value, 0);

  return (
    <div className="rounded-lg border border-white/10 bg-[#0f1729]/95 p-3 shadow-xl shadow-black/20 backdrop-blur-md">
      <p className="mb-2 text-sm font-semibold text-slate-200">{label}</p>
      {nonZeroEntries.map((entry) => (
        <p
          key={entry.dataKey}
          className="text-sm"
          style={{ color: entry.color }}
        >
          {entry.name}: {formatTwh(entry.value)}
        </p>
      ))}
      <p className="mt-2 border-t border-white/10 pt-2 text-sm font-semibold text-slate-200">
        Total: {formatTwh(total)}
      </p>
    </div>
  );
}

export default function DemandGrowthChart({ data }: DemandGrowthChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex h-[500px] items-center justify-center text-sm text-gray-500">
        No demand growth data available.
      </div>
    );
  }

  const projectionStartYear = useMemo(() => {
    for (let i = 0; i < data.length; i++) {
      if (!data[i].historical) return data[i].year;
    }
    return undefined;
  }, [data]);

  const chartData = useMemo(
    () =>
      data.map((point) => ({
        year: point.year,
        baselineDemand: point.baselineDemand,
        dataCenters: point.historical ? 0 : (point.dataCenters ?? 0),
        evs: point.historical ? 0 : (point.evs ?? 0),
        electrification: point.historical ? 0 : (point.electrification ?? 0),
        onshoring: point.historical ? 0 : (point.onshoring ?? 0),
      })),
    [data],
  );

  return (
    <ResponsiveContainer width="100%" height={500}>
      <ComposedChart
        data={chartData}
        margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
      >
        <CartesianGrid
          strokeDasharray="3 3"
          stroke={CHART_COLORS.grid}
        />
        <XAxis
          dataKey="year"
          tick={{ fontSize: 12 }}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 12 }}
          tickLine={false}
          tickFormatter={(v: number) => formatTwh(v)}
          label={{
            value: "Demand (TWh)",
            angle: -90,
            position: "insideLeft",
            offset: -5,
            style: { fontSize: 12, textAnchor: "middle", fill: CHART_COLORS.neutral },
          }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: 12 }} />

        {projectionStartYear != null && (
          <ReferenceLine
            x={projectionStartYear}
            stroke={CHART_COLORS.reference}
            strokeDasharray="6 4"
            strokeWidth={1.5}
            label={{
              value: "Projected",
              position: "top",
              fill: CHART_COLORS.reference,
              fontSize: 11,
            }}
          />
        )}

        {DRIVER_CONFIG.map(({ key, label, color }) => (
          <Area
            key={key}
            type="monotone"
            dataKey={key}
            name={label}
            stackId="demand"
            stroke={color}
            fill={color}
            fillOpacity={key === "baselineDemand" ? 0.35 : 0.75}
          />
        ))}
      </ComposedChart>
    </ResponsiveContainer>
  );
}
