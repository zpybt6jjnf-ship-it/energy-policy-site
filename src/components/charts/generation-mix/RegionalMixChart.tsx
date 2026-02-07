"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { RegionalMixEntry } from "@/lib/data/types";
import { ENERGY_COLORS, CHART_COLORS } from "@/lib/charts/colors";
import { formatPercent } from "@/lib/charts/formatters";

interface RegionalMixChartProps {
  data: RegionalMixEntry[];
}

const SOURCE_CONFIG = [
  { key: "coal", label: "Coal", color: ENERGY_COLORS.coal },
  { key: "naturalGas", label: "Natural Gas", color: ENERGY_COLORS.naturalGas },
  { key: "nuclear", label: "Nuclear", color: ENERGY_COLORS.nuclear },
  { key: "hydro", label: "Hydro", color: ENERGY_COLORS.hydro },
  { key: "wind", label: "Wind", color: ENERGY_COLORS.wind },
  { key: "solar", label: "Solar", color: ENERGY_COLORS.solar },
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
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;

  return (
    <div className="rounded-lg border border-white/10 bg-[#0f1729]/95 p-3 shadow-xl shadow-black/20 backdrop-blur-md">
      <p className="mb-2 text-sm font-semibold text-slate-200">{label}</p>
      {payload.map((entry) => (
        <p
          key={entry.dataKey}
          className="text-sm"
          style={{ color: entry.color }}
        >
          {entry.name}: {formatPercent(entry.value)}
        </p>
      ))}
    </div>
  );
}

export default function RegionalMixChart({ data }: RegionalMixChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex h-[450px] items-center justify-center text-sm text-gray-500">
        No regional mix data available.
      </div>
    );
  }

  const chartHeight = Math.max(450, data.length * 50);

  return (
    <ResponsiveContainer width="100%" height={chartHeight}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 10, right: 20, left: 80, bottom: 10 }}
      >
        <CartesianGrid
          strokeDasharray="3 3"
          stroke={CHART_COLORS.grid}
          horizontal={false}
        />
        <XAxis
          type="number"
          domain={[0, 100]}
          tickFormatter={(v: number) => formatPercent(v)}
          tick={{ fontSize: 12 }}
        />
        <YAxis
          type="category"
          dataKey="region"
          tick={{ fontSize: 12 }}
          width={70}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend verticalAlign="top" height={36} />
        {SOURCE_CONFIG.map(({ key, label, color }) => (
          <Bar
            key={key}
            dataKey={key}
            name={label}
            stackId="stack"
            fill={color}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}
