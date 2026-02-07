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
import type { RetailPricePoint } from "@/lib/data/types";
import { SECTOR_COLORS, CHART_COLORS } from "@/lib/charts/colors";
import { formatCentsPerKwh } from "@/lib/charts/formatters";

interface RetailPriceChartProps {
  data: RetailPricePoint[];
  adjustForInflation: boolean;
}

const SECTOR_LABELS: Record<string, string> = {
  residential: "Residential",
  commercial: "Commercial",
  industrial: "Industrial",
  allSectors: "All Sectors",
};

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
    <div
      className="rounded-md border bg-white px-3 py-2 text-sm shadow-md"
      style={{ borderColor: CHART_COLORS.grid }}
    >
      <p className="mb-1 font-semibold">{label}</p>
      {payload.map((entry) => (
        <p key={entry.dataKey} style={{ color: entry.color }}>
          {entry.name}: {formatCentsPerKwh(entry.value)}
        </p>
      ))}
    </div>
  );
}

export default function RetailPriceChart({
  data,
  adjustForInflation,
}: RetailPriceChartProps) {
  if (!data || data.length === 0) {
    return (
      <p className="py-10 text-center text-sm text-muted">
        No retail price data available.
      </p>
    );
  }

  const fields = adjustForInflation
    ? {
        residential: "residentialReal" as const,
        commercial: "commercialReal" as const,
        industrial: "industrialReal" as const,
        allSectors: "allSectorsReal" as const,
      }
    : {
        residential: "residential" as const,
        commercial: "commercial" as const,
        industrial: "industrial" as const,
        allSectors: "allSectors" as const,
      };

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
          tickFormatter={(v: number) => formatCentsPerKwh(v)}
          label={{
            value: adjustForInflation
              ? "Real cents/kWh"
              : "Nominal cents/kWh",
            angle: -90,
            position: "insideLeft",
            offset: -5,
            style: { fontSize: 12, textAnchor: "middle" },
          }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
        <Line
          type="monotone"
          dataKey={fields.residential}
          name={SECTOR_LABELS.residential}
          stroke={SECTOR_COLORS.residential}
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4 }}
        />
        <Line
          type="monotone"
          dataKey={fields.commercial}
          name={SECTOR_LABELS.commercial}
          stroke={SECTOR_COLORS.commercial}
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4 }}
        />
        <Line
          type="monotone"
          dataKey={fields.industrial}
          name={SECTOR_LABELS.industrial}
          stroke={SECTOR_COLORS.industrial}
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4 }}
        />
        <Line
          type="monotone"
          dataKey={fields.allSectors}
          name={SECTOR_LABELS.allSectors}
          stroke={SECTOR_COLORS.allSectors}
          strokeWidth={2}
          strokeDasharray="6 3"
          dot={false}
          activeDot={{ r: 4 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
