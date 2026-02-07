"use client";

import {
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { Co2EmissionsPoint } from "@/lib/data/types";
import { CHART_COLORS } from "@/lib/charts/colors";
import { formatMmt } from "@/lib/charts/formatters";

interface Co2EmissionsChartProps {
  data: Co2EmissionsPoint[];
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
  label?: number;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;

  const totalEntry = payload.find((e) => e.dataKey === "totalMmt");
  const perCapitaEntry = payload.find((e) => e.dataKey === "perCapitaTons");

  return (
    <div className="rounded-lg border border-white/10 bg-[#0f1729]/95 p-3 shadow-xl shadow-black/20 backdrop-blur-md">
      <p className="mb-2 text-sm font-semibold text-slate-200">{label}</p>
      {totalEntry && (
        <p className="text-sm" style={{ color: totalEntry.color }}>
          Total Emissions: {formatMmt(totalEntry.value)}
        </p>
      )}
      {perCapitaEntry && (
        <p className="text-sm" style={{ color: perCapitaEntry.color }}>
          Per Capita: {perCapitaEntry.value.toFixed(2)} tons
        </p>
      )}
    </div>
  );
}

export default function Co2EmissionsChart({ data }: Co2EmissionsChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex h-[500px] items-center justify-center text-sm text-gray-500">
        No CO2 emissions data available.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={500}>
      <ComposedChart
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
          yAxisId="totalMmt"
          orientation="left"
          tickFormatter={(v: number) => formatMmt(v)}
          tick={{ fontSize: 12 }}
          label={{
            value: "Total Emissions (MMT CO\u2082)",
            angle: -90,
            position: "insideLeft",
            style: { fontSize: 12, fill: CHART_COLORS.primary },
          }}
        />
        <YAxis
          yAxisId="perCapita"
          orientation="right"
          tickFormatter={(v: number) => `${v.toFixed(1)} t`}
          tick={{ fontSize: 12 }}
          label={{
            value: "Per Capita (tons)",
            angle: 90,
            position: "insideRight",
            style: { fontSize: 12, fill: CHART_COLORS.secondary },
          }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend verticalAlign="top" height={36} />
        <Area
          yAxisId="totalMmt"
          type="monotone"
          dataKey="totalMmt"
          name="Total Emissions (MMT)"
          stroke={CHART_COLORS.primary}
          fill={CHART_COLORS.primary}
          fillOpacity={0.3}
          strokeWidth={2}
        />
        <Line
          yAxisId="perCapita"
          type="monotone"
          dataKey="perCapitaTons"
          name="Per Capita (tons)"
          stroke={CHART_COLORS.secondary}
          strokeWidth={2}
          dot={{ r: 3, fill: CHART_COLORS.secondary }}
          activeDot={{ r: 5 }}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
