"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { CriteriaPollutantPoint } from "@/lib/data/types";
import { CHART_COLORS } from "@/lib/charts/colors";
import { formatTonsThousands } from "@/lib/charts/formatters";

interface CriteriaPollutantsChartProps {
  data: CriteriaPollutantPoint[];
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

  const so2Entry = payload.find((e) => e.dataKey === "so2ThousandTons");
  const noxEntry = payload.find((e) => e.dataKey === "noxThousandTons");

  return (
    <div className="rounded-lg border border-gray-200 bg-white px-4 py-3 shadow-md">
      <p className="mb-2 text-sm font-semibold text-gray-900">{label}</p>
      {so2Entry && (
        <p className="text-sm" style={{ color: so2Entry.color }}>
          SO{"\u2082"}: {formatTonsThousands(so2Entry.value)}
        </p>
      )}
      {noxEntry && (
        <p className="text-sm" style={{ color: noxEntry.color }}>
          NO{"\u2093"}: {formatTonsThousands(noxEntry.value)}
        </p>
      )}
    </div>
  );
}

export default function CriteriaPollutantsChart({
  data,
}: CriteriaPollutantsChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex h-[500px] items-center justify-center text-sm text-gray-500">
        No criteria pollutant data available.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={500}>
      <LineChart
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
          tickFormatter={(v: number) => formatTonsThousands(v)}
          tick={{ fontSize: 12 }}
          label={{
            value: "Thousand Tons",
            angle: -90,
            position: "insideLeft",
            style: { fontSize: 12, fill: CHART_COLORS.neutral },
          }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend verticalAlign="top" height={36} />
        <Line
          type="monotone"
          dataKey="so2ThousandTons"
          name="SO\u2082 Emissions"
          stroke={CHART_COLORS.primary}
          strokeWidth={2}
          dot={{ r: 3, fill: CHART_COLORS.primary }}
          activeDot={{ r: 5 }}
        />
        <Line
          type="monotone"
          dataKey="noxThousandTons"
          name="NO\u2093 Emissions"
          stroke={CHART_COLORS.secondary}
          strokeWidth={2}
          dot={{ r: 3, fill: CHART_COLORS.secondary }}
          activeDot={{ r: 5 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
