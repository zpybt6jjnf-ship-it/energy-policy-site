"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { HouseholdSpendingPoint } from "@/lib/data/types";
import { CHART_COLORS } from "@/lib/charts/colors";
import { formatPercent } from "@/lib/charts/formatters";

interface HouseholdSpendingChartProps {
  data: HouseholdSpendingPoint[];
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: { payload: HouseholdSpendingPoint }[];
  label?: number;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;

  const point = payload[0].payload;

  return (
    <div className="rounded-lg border border-white/10 bg-[#0f1729]/95 p-3 text-sm shadow-xl shadow-black/20 backdrop-blur-md">
      <p className="mb-1 font-semibold text-slate-200">{label}</p>
      <p style={{ color: CHART_COLORS.primary }}>
        Electricity share: {formatPercent(point.electricityShare)}
      </p>
      <p className="mt-1 text-slate-400">
        CPI Electricity: {point.cpiElectricity.toFixed(1)}
      </p>
      <p className="text-slate-400">
        CPI All Items: {point.cpiAllItems.toFixed(1)}
      </p>
    </div>
  );
}

export default function HouseholdSpendingChart({
  data,
}: HouseholdSpendingChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex h-[500px] items-center justify-center text-sm text-gray-500">
        No household spending data available.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={500}>
      <LineChart
        data={data}
        margin={{ top: 20, right: 30, bottom: 20, left: 20 }}
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
          tickFormatter={(v: number) => formatPercent(v)}
          label={{
            value: "Share of household spending (%)",
            angle: -90,
            position: "insideLeft",
            offset: -5,
            style: { fontSize: 12, textAnchor: "middle" },
          }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Line
          type="monotone"
          dataKey="electricityShare"
          name="Electricity share of spending"
          stroke={CHART_COLORS.primary}
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 5 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
