/**
 * Okabe-Ito derived colorblind-safe palette for energy sources.
 * Each color is distinguishable under protanopia, deuteranopia, and tritanopia.
 */
export const ENERGY_COLORS = {
  coal: "#332288",
  naturalGas: "#88CCEE",
  nuclear: "#44AA99",
  wind: "#117733",
  solar: "#DDCC77",
  hydro: "#0077BB",
  petroleum: "#CC6677",
  other: "#AA4499",
  biomass: "#882255",
  geothermal: "#999933",
} as const;

export const CHART_COLORS = {
  primary: "#34D399",
  secondary: "#22D3EE",
  tertiary: "#FBBF24",
  positive: "#34D399",
  negative: "#FB7185",
  neutral: "#94A3B8",
  grid: "#334155",
  reference: "#64748B",
  background: "#111827",
  tooltipBg: "#1E293B",
  tooltipBorder: "#334155",
} as const;

/** Ordered palette for generic multi-series charts */
export const SERIES_PALETTE = [
  "#332288",
  "#88CCEE",
  "#44AA99",
  "#117733",
  "#DDCC77",
  "#0077BB",
  "#CC6677",
  "#AA4499",
] as const;

/** Sector colors for affordability charts */
export const SECTOR_COLORS = {
  residential: "#332288",
  commercial: "#88CCEE",
  industrial: "#44AA99",
  transportation: "#CC6677",
  allSectors: "#34D399",
} as const;

/** Cause colors for disturbance events */
export const CAUSE_COLORS = {
  weather: "#88CCEE",
  equipment: "#332288",
  cyber: "#CC6677",
  physical: "#AA4499",
  fuelSupply: "#DDCC77",
  other: "#999933",
} as const;
