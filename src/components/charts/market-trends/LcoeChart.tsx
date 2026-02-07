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
  Cell,
} from "recharts";
import type { LcoeEntry } from "@/lib/data/types";
import { CHART_COLORS } from "@/lib/charts/colors";
import { formatDollarsPerMwh } from "@/lib/charts/formatters";

interface LcoeChartProps {
  data: LcoeEntry[];
}

const VINTAGE_CONFIG = [
  { key: "vintage2015", label: "2015", color: CHART_COLORS.neutral },
  { key: "vintage2020", label: "2020", color: CHART_COLORS.secondary },
  { key: "vintageCurrent", label: "Current", color: CHART_COLORS.primary },
] as const;

interface TooltipPayloadEntry {
  color: string;
  name: string;
  value: number;
  dataKey: string;
  payload: LcoeEntry;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadEntry[];
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;

  const entry = payload[0]?.payload;
  if (!entry) return null;

  return (
    <div className="rounded-lg border border-white/10 bg-[#0f1729]/95 p-3 shadow-xl shadow-black/20 backdrop-blur-md">
      <p className="mb-2 text-sm font-semibold text-slate-200">{label}</p>
      {entry.vintage2015 != null && (
        <p className="text-sm" style={{ color: CHART_COLORS.neutral }}>
          2015: {formatDollarsPerMwh(entry.vintage2015)}
        </p>
      )}
      {entry.vintage2020 != null && (
        <p className="text-sm" style={{ color: CHART_COLORS.secondary }}>
          2020: {formatDollarsPerMwh(entry.vintage2020)}
        </p>
      )}
      <p className="text-sm" style={{ color: CHART_COLORS.primary }}>
        Current: {formatDollarsPerMwh(entry.vintageCurrent)}
      </p>
    </div>
  );
}

export default function LcoeChart({ data }: LcoeChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex h-[500px] items-center justify-center text-sm text-gray-500">
        No LCOE data available.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={500}>
      <BarChart
        data={data}
        margin={{ top: 20, right: 20, bottom: 60, left: 20 }}
      >
        <CartesianGrid
          strokeDasharray="3 3"
          stroke={CHART_COLORS.grid}
          vertical={false}
        />
        <XAxis
          dataKey="technology"
          tick={{ fontSize: 11 }}
          tickLine={false}
          angle={-35}
          textAnchor="end"
          height={70}
        />
        <YAxis
          tick={{ fontSize: 12 }}
          tickLine={false}
          tickFormatter={(v: number) => formatDollarsPerMwh(v)}
          label={{
            value: "LCOE ($/MWh)",
            angle: -90,
            position: "insideLeft",
            offset: -5,
            style: { fontSize: 12, textAnchor: "middle", fill: CHART_COLORS.neutral },
          }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend
          verticalAlign="top"
          height={36}
          wrapperStyle={{ fontSize: 12 }}
        />

        {VINTAGE_CONFIG.map(({ key, label, color }) => (
          <Bar
            key={key}
            dataKey={key}
            name={label}
            fill={color}
            radius={[2, 2, 0, 0]}
          >
            {data.map((entry, index) => {
              const value = entry[key as keyof LcoeEntry];
              return (
                <Cell
                  key={`cell-${index}`}
                  fill={value == null ? "transparent" : color}
                  stroke={value == null ? "none" : undefined}
                />
              );
            })}
          </Bar>
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}
