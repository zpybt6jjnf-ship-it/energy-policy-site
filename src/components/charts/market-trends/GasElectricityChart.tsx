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
import type { GasElectricityCorrelationPoint } from "@/lib/data/types";
import { CHART_COLORS } from "@/lib/charts/colors";
import {
  formatDollarsPerMmbtu,
  formatCentsPerKwh,
} from "@/lib/charts/formatters";

interface GasElectricityChartProps {
  data: GasElectricityCorrelationPoint[];
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

  const henryHubEntry = payload.find((e) => e.dataKey === "henryHub");
  const electricityEntry = payload.find(
    (e) => e.dataKey === "retailElectricity",
  );

  return (
    <div className="rounded-lg border border-white/10 bg-[#0f1729]/95 p-3 shadow-xl shadow-black/20 backdrop-blur-md">
      <p className="mb-2 text-sm font-semibold text-slate-200">{label}</p>
      {henryHubEntry && (
        <p className="text-sm" style={{ color: henryHubEntry.color }}>
          {henryHubEntry.name}: {formatDollarsPerMmbtu(henryHubEntry.value)}
        </p>
      )}
      {electricityEntry && (
        <p className="text-sm" style={{ color: electricityEntry.color }}>
          {electricityEntry.name}:{" "}
          {formatCentsPerKwh(electricityEntry.value)}
        </p>
      )}
    </div>
  );
}

export default function GasElectricityChart({
  data,
}: GasElectricityChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex h-[500px] items-center justify-center text-sm text-gray-500">
        No gas-electricity correlation data available.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={500}>
      <ComposedChart
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
          yAxisId="left"
          tick={{ fontSize: 12 }}
          tickLine={false}
          tickFormatter={(v: number) => formatDollarsPerMmbtu(v)}
          label={{
            value: "Henry Hub ($/MMBtu)",
            angle: -90,
            position: "insideLeft",
            offset: -5,
            style: { fontSize: 12, textAnchor: "middle", fill: CHART_COLORS.primary },
          }}
        />
        <YAxis
          yAxisId="right"
          orientation="right"
          tick={{ fontSize: 12 }}
          tickLine={false}
          tickFormatter={(v: number) => formatCentsPerKwh(v)}
          label={{
            value: "Retail Electricity (¢/kWh)",
            angle: 90,
            position: "insideRight",
            offset: -5,
            style: { fontSize: 12, textAnchor: "middle", fill: CHART_COLORS.secondary },
          }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />

        <Line
          yAxisId="left"
          type="monotone"
          dataKey="henryHub"
          name="Henry Hub Price"
          stroke={CHART_COLORS.primary}
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4 }}
        />
        <Line
          yAxisId="right"
          type="monotone"
          dataKey="retailElectricity"
          name="Retail Electricity Price"
          stroke={CHART_COLORS.secondary}
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4 }}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
