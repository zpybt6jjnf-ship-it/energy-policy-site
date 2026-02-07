/**
 * Axis label and tooltip formatters for chart values.
 */

export function formatCurrency(value: number): string {
  if (value >= 1e9) return `$${(value / 1e9).toFixed(1)}B`;
  if (value >= 1e6) return `$${(value / 1e6).toFixed(1)}M`;
  if (value >= 1e3) return `$${(value / 1e3).toFixed(1)}K`;
  return `$${value.toFixed(2)}`;
}

export function formatCentsPerKwh(value: number): string {
  return `${value.toFixed(1)}¢/kWh`;
}

export function formatDollarsPerMmbtu(value: number): string {
  return `$${value.toFixed(2)}/MMBtu`;
}

export function formatDollarsPerMwh(value: number): string {
  return `$${value.toFixed(0)}/MWh`;
}

export function formatTwh(value: number): string {
  return `${value.toFixed(0)} TWh`;
}

export function formatGw(value: number): string {
  return `${value.toFixed(1)} GW`;
}

export function formatMmt(value: number): string {
  return `${value.toFixed(0)} MMT`;
}

export function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`;
}

export function formatMinutes(value: number): string {
  return `${value.toFixed(0)} min`;
}

export function formatCount(value: number): string {
  return value.toLocaleString();
}

export function formatLbsPerMwh(value: number): string {
  return `${value.toFixed(0)} lbs/MWh`;
}

export function formatTonsThousands(value: number): string {
  if (value >= 1e6) return `${(value / 1e6).toFixed(1)}M tons`;
  if (value >= 1e3) return `${(value / 1e3).toFixed(0)}K tons`;
  return `${value.toFixed(0)} tons`;
}

export function formatThousandAcres(value: number): string {
  if (value >= 1e3) return `${(value / 1e3).toFixed(1)}M acres`;
  return `${value.toFixed(0)}k acres`;
}

export function formatWPerSqm(value: number): string {
  return `${value.toFixed(1)} W/m²`;
}
