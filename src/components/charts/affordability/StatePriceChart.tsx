"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
} from "recharts";
import type { StatePriceEntry } from "@/lib/data/types";
import { CHART_COLORS } from "@/lib/charts/colors";
import { formatCentsPerKwh } from "@/lib/charts/formatters";

interface StatePriceChartProps {
  data: StatePriceEntry[];
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: { payload: StatePriceEntry }[];
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;

  const entry = payload[0].payload;

  return (
    <div className="rounded-lg border border-white/10 bg-[#0f1729]/95 p-3 text-sm shadow-xl shadow-black/20 backdrop-blur-md">
      <p className="mb-1 font-semibold text-slate-200">{entry.state}</p>
      <p className="text-slate-200">Price: {formatCentsPerKwh(entry.price)}</p>
      <p className="text-slate-400">
        National avg: {formatCentsPerKwh(entry.nationalAverage)}
      </p>
    </div>
  );
}

export default function StatePriceChart({ data }: StatePriceChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex h-[500px] items-center justify-center text-sm text-gray-500">
        No state price data available.
      </div>
    );
  }

  const nationalAverage = data[0]?.nationalAverage ?? 0;

  return (
    <ResponsiveContainer width="100%" height={1200}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 20, right: 40, bottom: 20, left: 100 }}
      >
        <CartesianGrid
          strokeDasharray="3 3"
          stroke={CHART_COLORS.grid}
          horizontal={false}
        />
        <XAxis
          type="number"
          tick={{ fontSize: 11 }}
          tickLine={false}
          tickFormatter={(v: number) => formatCentsPerKwh(v)}
        />
        <YAxis
          type="category"
          dataKey="state"
          tick={{ fontSize: 11 }}
          tickLine={false}
          width={95}
        />
        <Tooltip content={<CustomTooltip />} />
        <ReferenceLine
          x={nationalAverage}
          stroke={CHART_COLORS.reference}
          strokeWidth={2}
          strokeDasharray="6 3"
          label={{
            value: `National avg: ${formatCentsPerKwh(nationalAverage)}`,
            position: "top",
            fill: CHART_COLORS.reference,
            fontSize: 12,
          }}
        />
        <Bar
          dataKey="price"
          fill={CHART_COLORS.primary}
          radius={[0, 2, 2, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
