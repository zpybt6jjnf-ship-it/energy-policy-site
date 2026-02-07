"use client";

import {
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { SaidiSaifiPoint } from "@/lib/data/types";
import { CHART_COLORS } from "@/lib/charts/colors";
import { formatMinutes } from "@/lib/charts/formatters";

interface SaidiSaifiChartProps {
  data: SaidiSaifiPoint[];
  showMajorEventDays: boolean;
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

  return (
    <div className="rounded-lg border border-white/10 bg-[#0f1729]/95 p-3 shadow-xl shadow-black/20 backdrop-blur-md">
      <p className="mb-2 text-sm font-semibold text-slate-200">{label}</p>
      {payload.map((entry) => {
        const isSaidi = entry.dataKey.startsWith("saidi");
        const formatted = isSaidi
          ? formatMinutes(entry.value)
          : `${entry.value.toFixed(2)} interruptions`;
        return (
          <p
            key={entry.dataKey}
            className="text-sm"
            style={{ color: entry.color }}
          >
            {entry.name}: {formatted}
          </p>
        );
      })}
    </div>
  );
}

export default function SaidiSaifiChart({
  data,
  showMajorEventDays,
}: SaidiSaifiChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex h-[500px] items-center justify-center text-sm text-gray-500">
        No SAIDI/SAIFI data available.
      </div>
    );
  }

  const saidiKey = showMajorEventDays ? "saidiWithMed" : "saidiWithoutMed";
  const saifiKey = showMajorEventDays ? "saifiWithMed" : "saifiWithoutMed";

  const saidiLabel = showMajorEventDays
    ? "SAIDI (with major events)"
    : "SAIDI (excl. major events)";
  const saifiLabel = showMajorEventDays
    ? "SAIFI (with major events)"
    : "SAIFI (excl. major events)";

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
          yAxisId="saidi"
          orientation="left"
          tickFormatter={(v: number) => formatMinutes(v)}
          tick={{ fontSize: 12 }}
          label={{
            value: "SAIDI (minutes)",
            angle: -90,
            position: "insideLeft",
            style: { fontSize: 12, fill: CHART_COLORS.primary },
          }}
        />
        <YAxis
          yAxisId="saifi"
          orientation="right"
          tickFormatter={(v: number) => v.toFixed(1)}
          tick={{ fontSize: 12 }}
          label={{
            value: "SAIFI (interruptions)",
            angle: 90,
            position: "insideRight",
            style: { fontSize: 12, fill: CHART_COLORS.secondary },
          }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend verticalAlign="top" height={36} />
        <Line
          yAxisId="saidi"
          type="monotone"
          dataKey={saidiKey}
          name={saidiLabel}
          stroke={CHART_COLORS.primary}
          strokeWidth={2}
          dot={{ r: 3, fill: CHART_COLORS.primary }}
          activeDot={{ r: 5 }}
        />
        <Line
          yAxisId="saifi"
          type="monotone"
          dataKey={saifiKey}
          name={saifiLabel}
          stroke={CHART_COLORS.secondary}
          strokeWidth={2}
          dot={{ r: 3, fill: CHART_COLORS.secondary }}
          activeDot={{ r: 5 }}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
