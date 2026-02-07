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
  Legend,
} from "recharts";
import type { EmissionsIntensityEntry } from "@/lib/data/types";
import { CHART_COLORS } from "@/lib/charts/colors";
import { formatLbsPerMwh } from "@/lib/charts/formatters";

interface EmissionsIntensityChartProps {
  data: EmissionsIntensityEntry[];
}

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

  const currentEntry = payload.find((e) => e.dataKey === "intensity");
  const priorEntry = payload.find((e) => e.dataKey === "priorIntensity");

  return (
    <div className="rounded-lg border border-gray-200 bg-white px-4 py-3 shadow-md">
      <p className="mb-2 text-sm font-semibold text-gray-900">{label}</p>
      {currentEntry && (
        <p className="text-sm" style={{ color: CHART_COLORS.primary }}>
          Current Intensity: {formatLbsPerMwh(currentEntry.value)}
        </p>
      )}
      {priorEntry && priorEntry.value != null && (
        <p className="text-sm" style={{ color: CHART_COLORS.neutral }}>
          Prior Intensity: {formatLbsPerMwh(priorEntry.value)}
        </p>
      )}
    </div>
  );
}

export default function EmissionsIntensityChart({
  data,
}: EmissionsIntensityChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex h-[800px] items-center justify-center text-sm text-gray-500">
        No emissions intensity data available.
      </div>
    );
  }

  const sorted = useMemo(
    () => [...data].sort((a, b) => b.intensity - a.intensity),
    [data],
  );

  const hasPriorData = useMemo(
    () => sorted.some((d) => d.priorIntensity != null),
    [sorted],
  );

  const chartHeight = Math.max(800, sorted.length * 40);

  return (
    <ResponsiveContainer width="100%" height={chartHeight}>
      <BarChart
        data={sorted}
        layout="vertical"
        margin={{ top: 10, right: 30, left: 10, bottom: 10 }}
      >
        <CartesianGrid
          strokeDasharray="3 3"
          stroke={CHART_COLORS.grid}
          horizontal={false}
        />
        <YAxis
          type="category"
          dataKey="region"
          tick={{ fontSize: 12 }}
          tickLine={false}
          width={140}
        />
        <XAxis
          type="number"
          tickFormatter={(v: number) => formatLbsPerMwh(v)}
          tick={{ fontSize: 12 }}
          domain={[0, "auto"]}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend verticalAlign="top" height={36} />
        {hasPriorData && (
          <Bar
            dataKey="priorIntensity"
            name="Prior Intensity"
            fill={CHART_COLORS.neutral}
            fillOpacity={0.35}
            radius={[0, 4, 4, 0]}
            maxBarSize={24}
          />
        )}
        <Bar
          dataKey="intensity"
          name="Current Intensity"
          fill={CHART_COLORS.primary}
          radius={[0, 4, 4, 0]}
          maxBarSize={24}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
