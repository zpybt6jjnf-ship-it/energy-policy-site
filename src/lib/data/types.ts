/**
 * Core data types for all chart data.
 * Every processed JSON file wraps its payload in DataEnvelope<T>.
 */

export interface DataSource {
  agency: string;
  dataset: string;
  url: string;
  accessDate: string;
  vintage?: string;
}

export interface DataEnvelope<T> {
  id: string;
  title: string;
  source: DataSource;
  units: Record<string, string>;
  caveats?: string[];
  lastUpdated: string;
  data: T;
}

// ── Reliability ──

export interface SaidiSaifiPoint {
  year: number;
  saidiWithMed: number;
  saidiWithoutMed: number;
  saifiWithMed: number;
  saifiWithoutMed: number;
}

export interface ReserveMarginRegion {
  region: string;
  currentMargin: number;
  forecastMargins: { year: number; margin: number }[];
  referenceLevel: number;
}

export interface DisturbanceEvent {
  year: number;
  weather: number;
  equipment: number;
  cyber: number;
  physical: number;
  fuelSupply: number;
  other: number;
}

// ── Affordability ──

export interface RetailPricePoint {
  year: number;
  month?: number;
  residential: number;
  commercial: number;
  industrial: number;
  allSectors: number;
  residentialReal?: number;
  commercialReal?: number;
  industrialReal?: number;
  allSectorsReal?: number;
}

export interface StatePriceEntry {
  state: string;
  stateCode: string;
  price: number;
  nationalAverage: number;
}

export interface HouseholdSpendingPoint {
  year: number;
  electricityShare: number;
  cpiElectricity: number;
  cpiAllItems: number;
}

// ── Generation Mix ──

export interface GenerationBySourcePoint {
  year: number;
  coal: number;
  naturalGas: number;
  nuclear: number;
  wind: number;
  solar: number;
  hydro: number;
  petroleum: number;
  other: number;
}

export interface CapacityChangeEntry {
  year: number;
  additions: {
    coal: number;
    naturalGas: number;
    nuclear: number;
    wind: number;
    solar: number;
    other: number;
  };
  retirements: {
    coal: number;
    naturalGas: number;
    nuclear: number;
    wind: number;
    solar: number;
    other: number;
  };
}

export interface RegionalMixEntry {
  region: string;
  coal: number;
  naturalGas: number;
  nuclear: number;
  wind: number;
  solar: number;
  hydro: number;
  other: number;
}

// ── Environmental ──

export interface Co2EmissionsPoint {
  year: number;
  totalMmt: number;
  perCapitaTons: number;
}

export interface EmissionsIntensityEntry {
  region: string;
  regionCode: string;
  intensity: number;
  priorIntensity?: number;
}

export interface CriteriaPollutantPoint {
  year: number;
  so2ThousandTons: number;
  noxThousandTons: number;
}

// ── Land Use ──

export interface CumulativeLandPoint {
  year: number;
  solar: number;
  wind: number;
  nuclear: number;
  naturalGas: number;
  coal: number;
  hydro: number;
}

export interface PowerDensityEntry {
  technology: string;
  wattsPerSqMeter: number;
  rangeMin: number;
  rangeMax: number;
}

// ── Market Trends ──

export interface GasElectricityCorrelationPoint {
  year: number;
  month?: number;
  henryHub: number;
  retailElectricity: number;
}

export interface LcoeEntry {
  technology: string;
  vintage2015?: number;
  vintage2020?: number;
  vintageCurrent: number;
  unit: string;
}

export interface DemandGrowthPoint {
  year: number;
  historical?: boolean;
  baselineDemand: number;
  dataCenters?: number;
  evs?: number;
  electrification?: number;
  onshoring?: number;
}
