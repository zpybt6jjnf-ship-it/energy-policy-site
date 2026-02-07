"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { GenerationBySourcePoint } from "@/lib/data/types";
import { ENERGY_COLORS, CHART_COLORS } from "@/lib/charts/colors";
import { formatTwh } from "@/lib/charts/formatters";

interface GenerationBySourceChartProps {
  data: GenerationBySourcePoint[];
}

const SOURCE_CONFIG = [
  { key: "coal", label: "Coal", color: ENERGY_COLORS.coal },
  { key: "naturalGas", label: "Natural Gas", color: ENERGY_COLORS.naturalGas },
  { key: "nuclear", label: "Nuclear", color: ENERGY_COLORS.nuclear },
  { key: "hydro", label: "Hydro", color: ENERGY_COLORS.hydro },
  { key: "wind", label: "Wind", color: ENERGY_COLORS.wind },
  { key: "solar", label: "Solar", color: ENERGY_COLORS.solar },
  { key: "petroleum", label: "Petroleum", color: ENERGY_COLORS.petroleum },
  { key: "other", label: "Other", color: ENERGY_COLORS.other },
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

  const total = payload.reduce((sum, entry) => sum + entry.value, 0);

  return (
    <div className="rounded-lg border border-white/10 bg-[#0f1729]/95 p-3 shadow-xl shadow-black/20 backdrop-blur-md">
      <p className="mb-2 text-sm font-semibold text-slate-200">{label}</p>
      {payload.map((entry) => (
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

export default function GenerationBySourceChart({
  data,
}: GenerationBySourceChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex h-[500px] items-center justify-center text-sm text-gray-500">
        No generation-by-source data available.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={500}>
      <AreaChart
        data={data}
        margin={{ top: 10, right: 20, left: 10, bottom: 10 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} />
        <XAxis
          dataKey="year"
          tick={{ fontSize: 12 }}
          tickLine={false}
        />
        <YAxis
          tickFormatter={(v: number) => formatTwh(v)}
          tick={{ fontSize: 12 }}
          label={{
            value: "Generation (TWh)",
            angle: -90,
            position: "insideLeft",
            style: { fontSize: 12, fill: CHART_COLORS.neutral },
          }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend verticalAlign="top" height={36} />
        {SOURCE_CONFIG.map(({ key, label, color }) => (
          <Area
            key={key}
            type="monotone"
            dataKey={key}
            name={label}
            stackId="1"
            stroke={color}
            fill={color}
            fillOpacity={0.85}
          />
        ))}
      </AreaChart>
    </ResponsiveContainer>
  );
}
