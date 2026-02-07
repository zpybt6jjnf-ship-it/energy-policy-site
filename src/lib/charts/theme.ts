import { CHART_COLORS } from "./colors";

export const CHART_THEME = {
  fontFamily: "'Inter', 'Inter Variable', system-ui, -apple-system, sans-serif",
  fontSize: {
    title: 16,
    axis: 12,
    tick: 11,
    tooltip: 13,
    legend: 12,
  },
  colors: CHART_COLORS,
  spacing: {
    chartHeight: 500,
    chartHeightMobile: 350,
    margin: { top: 20, right: 30, bottom: 60, left: 60 },
    marginMobile: { top: 10, right: 10, bottom: 50, left: 50 },
  },
  grid: {
    strokeDasharray: "3 3",
    stroke: CHART_COLORS.grid,
    strokeOpacity: 0.5,
  },
  tooltip: {
    backgroundColor: CHART_COLORS.tooltipBg,
    borderColor: CHART_COLORS.tooltipBorder,
    borderRadius: 12,
    padding: 12,
    boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
  },
} as const;
