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
import type { CumulativeLandPoint } from "@/lib/data/types";
import { ENERGY_COLORS } from "@/lib/charts/colors";
import { formatThousandAcres } from "@/lib/charts/formatters";

interface CumulativeLandChartProps {
  data: CumulativeLandPoint[];
}

const SOURCE_CONFIG = [
  { key: "coal", label: "Coal", color: ENERGY_COLORS.coal },
  { key: "naturalGas", label: "Natural Gas", color: ENERGY_COLORS.naturalGas },
  { key: "nuclear", label: "Nuclear", color: ENERGY_COLORS.nuclear },
  { key: "hydro", label: "Hydro", color: ENERGY_COLORS.hydro },
  { key: "wind", label: "Wind", color: ENERGY_COLORS.wind },
  { key: "solar", label: "Solar", color: ENERGY_COLORS.solar },
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
    <div className="rounded-lg border border-gray-200 bg-white px-4 py-3 shadow-md">
      <p className="mb-2 text-sm font-semibold text-gray-900">{label}</p>
      {payload.map((entry) => (
        <p
          key={entry.dataKey}
          className="text-sm"
          style={{ color: entry.color }}
        >
          {entry.name}: {formatThousandAcres(entry.value)}
        </p>
      ))}
      <p className="mt-2 border-t border-gray-200 pt-2 text-sm font-semibold text-gray-900">
        Total: {formatThousandAcres(total)}
      </p>
    </div>
  );
}

export default function CumulativeLandChart({
  data,
}: CumulativeLandChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex h-[500px] items-center justify-center text-sm text-gray-500">
        No cumulative land data available.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={500}>
      <AreaChart
        data={data}
        margin={{ top: 10, right: 20, left: 10, bottom: 10 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis
          dataKey="year"
          tick={{ fontSize: 12 }}
          tickLine={false}
        />
        <YAxis
          tickFormatter={(v: number) => formatThousandAcres(v)}
          tick={{ fontSize: 12 }}
          label={{
            value: "Land (thousand acres)",
            angle: -90,
            position: "insideLeft",
            style: { fontSize: 12, fill: "#6b7280" },
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
