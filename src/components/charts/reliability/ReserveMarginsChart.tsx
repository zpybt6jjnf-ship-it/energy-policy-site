"use client";

import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
  Legend,
} from "recharts";
import type { ReserveMarginRegion } from "@/lib/data/types";
import { CHART_COLORS } from "@/lib/charts/colors";
import { formatPercent } from "@/lib/charts/formatters";

interface ReserveMarginsChartProps {
  data: ReserveMarginRegion[];
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

  const entry = payload[0];

  return (
    <div className="rounded-lg border border-white/10 bg-[#0f1729]/95 p-3 shadow-xl shadow-black/20 backdrop-blur-md">
      <p className="mb-2 text-sm font-semibold text-slate-200">{label}</p>
      <p className="text-sm" style={{ color: entry.color }}>
        Current Reserve Margin: {formatPercent(entry.value)}
      </p>
    </div>
  );
}

export default function ReserveMarginsChart({
  data,
}: ReserveMarginsChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex h-[500px] items-center justify-center text-sm text-gray-500">
        No reserve margin data available.
      </div>
    );
  }

  const sorted = useMemo(
    () => [...data].sort((a, b) => a.currentMargin - b.currentMargin),
    [data],
  );

  const averageReferenceLevel = useMemo(() => {
    const total = sorted.reduce((sum, r) => sum + r.referenceLevel, 0);
    return total / sorted.length;
  }, [sorted]);

  const chartData = useMemo(
    () =>
      sorted.map((region) => ({
        region: region.region,
        currentMargin: region.currentMargin,
        referenceLevel: region.referenceLevel,
      })),
    [sorted],
  );

  return (
    <ResponsiveContainer width="100%" height={500}>
      <BarChart
        data={chartData}
        margin={{ top: 10, right: 20, left: 10, bottom: 40 }}
      >
        <CartesianGrid
          strokeDasharray="3 3"
          stroke={CHART_COLORS.grid}
          vertical={false}
        />
        <XAxis
          dataKey="region"
          tick={{ fontSize: 11 }}
          tickLine={false}
          angle={-30}
          textAnchor="end"
          interval={0}
          height={60}
        />
        <YAxis
          tickFormatter={(v: number) => formatPercent(v)}
          tick={{ fontSize: 12 }}
          domain={[0, "auto"]}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend verticalAlign="top" height={36} />
        <ReferenceLine
          y={averageReferenceLevel}
          stroke={CHART_COLORS.reference}
          strokeDasharray="6 4"
          strokeWidth={2}
          label={{
            value: `Reference Level (${formatPercent(averageReferenceLevel)})`,
            position: "insideTopRight",
            style: { fontSize: 11, fill: CHART_COLORS.reference },
          }}
        />
        <Bar
          dataKey="currentMargin"
          name="Current Reserve Margin"
          fill={CHART_COLORS.primary}
          radius={[4, 4, 0, 0]}
          maxBarSize={60}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
