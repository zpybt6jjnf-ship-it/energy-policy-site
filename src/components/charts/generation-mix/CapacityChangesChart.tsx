"use client";

import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
} from "recharts";
import type { CapacityChangeEntry } from "@/lib/data/types";
import { ENERGY_COLORS, CHART_COLORS } from "@/lib/charts/colors";
import { formatGw } from "@/lib/charts/formatters";

interface CapacityChangesChartProps {
  data: CapacityChangeEntry[];
}

const FUEL_TYPES = [
  { key: "coal", label: "Coal", color: ENERGY_COLORS.coal },
  { key: "naturalGas", label: "Natural Gas", color: ENERGY_COLORS.naturalGas },
  { key: "nuclear", label: "Nuclear", color: ENERGY_COLORS.nuclear },
  { key: "wind", label: "Wind", color: ENERGY_COLORS.wind },
  { key: "solar", label: "Solar", color: ENERGY_COLORS.solar },
  { key: "other", label: "Other", color: ENERGY_COLORS.other },
] as const;

type FuelKey = "coal" | "naturalGas" | "nuclear" | "wind" | "solar" | "other";

interface TransformedRow {
  year: number;
  additionsCoal: number;
  additionsNaturalGas: number;
  additionsNuclear: number;
  additionsWind: number;
  additionsSolar: number;
  additionsOther: number;
  retirementsCoal: number;
  retirementsNaturalGas: number;
  retirementsNuclear: number;
  retirementsWind: number;
  retirementsSolar: number;
  retirementsOther: number;
}

function transformData(data: CapacityChangeEntry[]): TransformedRow[] {
  return data.map((entry) => ({
    year: entry.year,
    additionsCoal: entry.additions.coal,
    additionsNaturalGas: entry.additions.naturalGas,
    additionsNuclear: entry.additions.nuclear,
    additionsWind: entry.additions.wind,
    additionsSolar: entry.additions.solar,
    additionsOther: entry.additions.other,
    retirementsCoal: -entry.retirements.coal,
    retirementsNaturalGas: -entry.retirements.naturalGas,
    retirementsNuclear: -entry.retirements.nuclear,
    retirementsWind: -entry.retirements.wind,
    retirementsSolar: -entry.retirements.solar,
    retirementsOther: -entry.retirements.other,
  }));
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
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

  const additions = payload.filter(
    (entry) => entry.dataKey.startsWith("additions") && entry.value !== 0
  );
  const retirements = payload.filter(
    (entry) => entry.dataKey.startsWith("retirements") && entry.value !== 0
  );

  const totalAdditions = additions.reduce((sum, e) => sum + e.value, 0);
  const totalRetirements = retirements.reduce((sum, e) => sum + e.value, 0);

  return (
    <div className="rounded-lg border border-gray-200 bg-white px-4 py-3 shadow-md">
      <p className="mb-2 text-sm font-semibold text-gray-900">{label}</p>

      {additions.length > 0 && (
        <>
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
            Additions
          </p>
          {additions.map((entry) => (
            <p
              key={entry.dataKey}
              className="text-sm"
              style={{ color: entry.color }}
            >
              {entry.name}: {formatGw(entry.value)}
            </p>
          ))}
          <p className="text-sm font-semibold text-gray-700">
            Subtotal: {formatGw(totalAdditions)}
          </p>
        </>
      )}

      {retirements.length > 0 && (
        <>
          <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
            Retirements
          </p>
          {retirements.map((entry) => (
            <p
              key={entry.dataKey}
              className="text-sm"
              style={{ color: entry.color }}
            >
              {entry.name}: {formatGw(Math.abs(entry.value))}
            </p>
          ))}
          <p className="text-sm font-semibold text-gray-700">
            Subtotal: {formatGw(Math.abs(totalRetirements))}
          </p>
        </>
      )}

      <p className="mt-2 border-t border-gray-200 pt-2 text-sm font-semibold text-gray-900">
        Net: {formatGw(totalAdditions + totalRetirements)}
      </p>
    </div>
  );
}

export default function CapacityChangesChart({
  data,
}: CapacityChangesChartProps) {
  const transformedData = useMemo(() => transformData(data ?? []), [data]);

  if (!data || data.length === 0) {
    return (
      <div className="flex h-[500px] items-center justify-center text-sm text-gray-500">
        No capacity changes data available.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={500}>
      <BarChart
        data={transformedData}
        margin={{ top: 10, right: 20, left: 10, bottom: 10 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} />
        <XAxis
          dataKey="year"
          tick={{ fontSize: 12 }}
          tickLine={false}
        />
        <YAxis
          tickFormatter={(v: number) => formatGw(v)}
          tick={{ fontSize: 12 }}
          label={{
            value: "Capacity (GW)",
            angle: -90,
            position: "insideLeft",
            style: { fontSize: 12, fill: CHART_COLORS.neutral },
          }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend verticalAlign="top" height={36} />
        <ReferenceLine y={0} stroke={CHART_COLORS.reference} strokeWidth={1} />

        {FUEL_TYPES.map(({ key, label, color }) => (
          <Bar
            key={`additions-${key}`}
            dataKey={`additions${capitalize(key)}` as keyof TransformedRow}
            name={`${label} (added)`}
            stackId="additions"
            fill={color}
          />
        ))}

        {FUEL_TYPES.map(({ key, label, color }) => (
          <Bar
            key={`retirements-${key}`}
            dataKey={`retirements${capitalize(key)}` as keyof TransformedRow}
            name={`${label} (retired)`}
            stackId="retirements"
            fill={color}
            fillOpacity={0.5}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}
