/**
 * Static JSON import functions for chart data.
 * Each function loads processed data from the data/processed/ directory.
 */

import type {
  DataEnvelope,
  SaidiSaifiPoint,
  ReserveMarginRegion,
  DisturbanceEvent,
  RetailPricePoint,
  StatePriceEntry,
  HouseholdSpendingPoint,
  GenerationBySourcePoint,
  CapacityChangeEntry,
  RegionalMixEntry,
  Co2EmissionsPoint,
  EmissionsIntensityEntry,
  CriteriaPollutantPoint,
  GasElectricityCorrelationPoint,
  LcoeEntry,
  DemandGrowthPoint,
} from "./types";

// ── Reliability ──

export async function loadSaidiSaifi(): Promise<DataEnvelope<SaidiSaifiPoint[]>> {
  const data = await import("../../../data/processed/reliability/saidi-saifi.json");
  return data.default as DataEnvelope<SaidiSaifiPoint[]>;
}

export async function loadReserveMargins(): Promise<DataEnvelope<ReserveMarginRegion[]>> {
  const data = await import("../../../data/processed/reliability/reserve-margins.json");
  return data.default as DataEnvelope<ReserveMarginRegion[]>;
}

export async function loadDisturbanceEvents(): Promise<DataEnvelope<DisturbanceEvent[]>> {
  const data = await import("../../../data/processed/reliability/disturbance-events.json");
  return data.default as DataEnvelope<DisturbanceEvent[]>;
}

// ── Affordability ──

export async function loadRetailPrices(): Promise<DataEnvelope<RetailPricePoint[]>> {
  const data = await import("../../../data/processed/affordability/retail-prices.json");
  return data.default as DataEnvelope<RetailPricePoint[]>;
}

export async function loadStatePrices(): Promise<DataEnvelope<StatePriceEntry[]>> {
  const data = await import("../../../data/processed/affordability/state-prices.json");
  return data.default as DataEnvelope<StatePriceEntry[]>;
}

export async function loadHouseholdSpending(): Promise<DataEnvelope<HouseholdSpendingPoint[]>> {
  const data = await import("../../../data/processed/affordability/household-spending.json");
  return data.default as DataEnvelope<HouseholdSpendingPoint[]>;
}

// ── Generation Mix ──

export async function loadGenerationBySource(): Promise<DataEnvelope<GenerationBySourcePoint[]>> {
  const data = await import("../../../data/processed/generation-mix/generation-by-source.json");
  return data.default as DataEnvelope<GenerationBySourcePoint[]>;
}

export async function loadCapacityChanges(): Promise<DataEnvelope<CapacityChangeEntry[]>> {
  const data = await import("../../../data/processed/generation-mix/capacity-changes.json");
  return data.default as DataEnvelope<CapacityChangeEntry[]>;
}

export async function loadRegionalMix(): Promise<DataEnvelope<RegionalMixEntry[]>> {
  const data = await import("../../../data/processed/generation-mix/regional-mix.json");
  return data.default as DataEnvelope<RegionalMixEntry[]>;
}

// ── Environmental ──

export async function loadCo2Emissions(): Promise<DataEnvelope<Co2EmissionsPoint[]>> {
  const data = await import("../../../data/processed/environmental/co2-emissions.json");
  return data.default as DataEnvelope<Co2EmissionsPoint[]>;
}

export async function loadEmissionsIntensity(): Promise<DataEnvelope<EmissionsIntensityEntry[]>> {
  const data = await import("../../../data/processed/environmental/emissions-intensity.json");
  return data.default as DataEnvelope<EmissionsIntensityEntry[]>;
}

export async function loadCriteriaPollutants(): Promise<DataEnvelope<CriteriaPollutantPoint[]>> {
  const data = await import("../../../data/processed/environmental/criteria-pollutants.json");
  return data.default as DataEnvelope<CriteriaPollutantPoint[]>;
}

// ── Market Trends ──

export async function loadGasElectricityCorrelation(): Promise<DataEnvelope<GasElectricityCorrelationPoint[]>> {
  const data = await import("../../../data/processed/market-trends/gas-electricity-correlation.json");
  return data.default as DataEnvelope<GasElectricityCorrelationPoint[]>;
}

export async function loadLcoe(): Promise<DataEnvelope<LcoeEntry[]>> {
  const data = await import("../../../data/processed/market-trends/lcoe.json");
  return data.default as DataEnvelope<LcoeEntry[]>;
}

export async function loadDemandGrowth(): Promise<DataEnvelope<DemandGrowthPoint[]>> {
  const data = await import("../../../data/processed/market-trends/demand-growth.json");
  return data.default as DataEnvelope<DemandGrowthPoint[]>;
}
