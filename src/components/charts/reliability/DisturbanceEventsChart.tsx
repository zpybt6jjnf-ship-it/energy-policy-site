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
import type { DisturbanceEvent } from "@/lib/data/types";
import { CAUSE_COLORS, CHART_COLORS } from "@/lib/charts/colors";
import { formatCount } from "@/lib/charts/formatters";

interface DisturbanceEventsChartProps {
  data: DisturbanceEvent[];
}

const CAUSE_LABELS: Record<keyof typeof CAUSE_COLORS, string> = {
  weather: "Weather",
  equipment: "Equipment Failure",
  cyber: "Cyber Attack",
  physical: "Physical Attack",
  fuelSupply: "Fuel Supply",
  other: "Other",
};

type CauseKey = keyof typeof CAUSE_COLORS;

const CAUSE_KEYS: CauseKey[] = [
  "weather",
  "equipment",
  "cyber",
  "physical",
  "fuelSupply",
  "other",
];

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
          {entry.name}: {formatCount(entry.value)}
        </p>
      ))}
      <p className="mt-1 border-t border-white/10 pt-1 text-sm font-semibold text-slate-200">
        Total: {formatCount(total)}
      </p>
    </div>
  );
}

export default function DisturbanceEventsChart({
  data,
}: DisturbanceEventsChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex h-[500px] items-center justify-center text-sm text-gray-500">
        No disturbance event data available.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={500}>
      <BarChart
        data={data}
        margin={{ top: 10, right: 20, left: 10, bottom: 10 }}
      >
        <CartesianGrid
          strokeDasharray="3 3"
          stroke={CHART_COLORS.grid}
          vertical={false}
        />
        <XAxis
          dataKey="year"
          tick={{ fontSize: 12 }}
          tickLine={false}
        />
        <YAxis
          tickFormatter={(v: number) => formatCount(v)}
          tick={{ fontSize: 12 }}
          label={{
            value: "Number of Events",
            angle: -90,
            position: "insideLeft",
            style: { fontSize: 12, fill: CHART_COLORS.neutral },
          }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend verticalAlign="top" height={36} />
        {CAUSE_KEYS.map((key) => (
          <Bar
            key={key}
            dataKey={key}
            name={CAUSE_LABELS[key]}
            stackId="causes"
            fill={CAUSE_COLORS[key]}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}
