/**
 * ARIA label generators for chart accessibility.
 */

export function generateChartAriaLabel(
  chartTitle: string,
  dataDescription: string,
  timeRange?: string
): string {
  const parts = [`Chart: ${chartTitle}.`, dataDescription];
  if (timeRange) {
    parts.push(`Time range: ${timeRange}.`);
  }
  return parts.join(" ");
}

export function generateDataSummary(
  chartTitle: string,
  highlights: string[]
): string {
  return `${chartTitle}. Key findings: ${highlights.join(". ")}.`;
}

export function generateAxisLabel(
  axisName: string,
  unit: string
): string {
  return `${axisName} (${unit})`;
}
