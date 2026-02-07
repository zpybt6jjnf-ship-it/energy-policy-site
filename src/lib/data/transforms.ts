/**
 * Shared data transformation utilities.
 */

/** Adjust nominal prices to real (constant) dollars using CPI index */
export function adjustForInflation(
  nominalValue: number,
  yearCpi: number,
  baseCpi: number
): number {
  return (nominalValue * baseCpi) / yearCpi;
}

/** Convert annual generation in million kWh to TWh */
export function millionKwhToTwh(value: number): number {
  return value / 1e6;
}

/** Convert thousand tons to million metric tons */
export function thousandTonsToMmt(value: number): number {
  return value / 1000;
}

/** Calculate percentage share of a part from a total */
export function percentShare(part: number, total: number): number {
  if (total === 0) return 0;
  return (part / total) * 100;
}

/** Filter data to a year range */
export function filterByYearRange<T extends { year: number }>(
  data: T[],
  startYear: number,
  endYear: number
): T[] {
  return data.filter((d) => d.year >= startYear && d.year <= endYear);
}

/** Sort entries by a numeric field descending */
export function sortByFieldDesc<T>(data: T[], field: keyof T): T[] {
  return [...data].sort((a, b) => {
    const aVal = a[field] as number;
    const bVal = b[field] as number;
    return bVal - aVal;
  });
}
