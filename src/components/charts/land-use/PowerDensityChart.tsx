"use client";

import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ErrorBar,
} from "recharts";
import type { PowerDensityEntry } from "@/lib/data/types";
import { CHART_COLORS } from "@/lib/charts/colors";
import { formatWPerSqm } from "@/lib/charts/formatters";

interface PowerDensityChartProps {
  data: PowerDensityEntry[];
}

interface TooltipPayloadEntry {
  color: string;
  name: string;
  value: number;
  dataKey: string;
  payload: PowerDensityEntry;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadEntry[];
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;

  const entry = payload[0];
  const d = entry.payload;

  return (
    <div className="rounded-lg border border-white/10 bg-[#0f1729]/95 p-3 shadow-xl shadow-black/20 backdrop-blur-md">
      <p className="mb-2 text-sm font-semibold text-slate-200">{label}</p>
      <p className="text-sm" style={{ color: CHART_COLORS.primary }}>
        Median: {formatWPerSqm(d.wattsPerSqMeter)}
      </p>
      <p className="text-sm text-slate-400">
        Range: {formatWPerSqm(d.rangeMin)} – {formatWPerSqm(d.rangeMax)}
      </p>
    </div>
  );
}

export default function PowerDensityChart({ data }: PowerDensityChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex h-[500px] items-center justify-center text-sm text-gray-500">
        No power density data available.
      </div>
    );
  }

  const sorted = useMemo(() => {
    const withErrors = data.map((d) => ({
      ...d,
      errorLow: d.wattsPerSqMeter - d.rangeMin,
      errorHigh: d.rangeMax - d.wattsPerSqMeter,
    }));
    return withErrors.sort((a, b) => b.wattsPerSqMeter - a.wattsPerSqMeter);
  }, [data]);

  const chartHeight = Math.max(400, sorted.length * 55);

  return (
    <ResponsiveContainer width="100%" height={chartHeight}>
      <BarChart
        data={sorted}
        layout="vertical"
        margin={{ top: 10, right: 40, left: 10, bottom: 10 }}
      >
        <CartesianGrid
          strokeDasharray="3 3"
          stroke={CHART_COLORS.grid}
          horizontal={false}
        />
        <YAxis
          type="category"
          dataKey="technology"
          tick={{ fontSize: 12 }}
          tickLine={false}
          width={140}
        />
        <XAxis
          type="number"
          tickFormatter={(v: number) => formatWPerSqm(v)}
          tick={{ fontSize: 12 }}
          domain={[0, "auto"]}
        />
        <Tooltip content={<CustomTooltip />} />
        <Bar
          dataKey="wattsPerSqMeter"
          name="Power Density"
          fill={CHART_COLORS.primary}
          radius={[0, 4, 4, 0]}
          maxBarSize={28}
        >
          <ErrorBar
            dataKey="errorHigh"
            direction="x"
            width={4}
            stroke={CHART_COLORS.neutral}
            strokeWidth={1.5}
          />
          <ErrorBar
            dataKey="errorLow"
            direction="x"
            width={4}
            stroke={CHART_COLORS.neutral}
            strokeWidth={1.5}
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
