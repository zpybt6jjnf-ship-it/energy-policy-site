export const SITE_TITLE = "U.S. Energy Policy Data";
export const SITE_DESCRIPTION =
  "Nonpartisan, data-driven analysis of U.S. energy policy using government primary-source data.";

export const NAV_CATEGORIES = [
  { label: "Home", href: "/" },
  { label: "Reliability", href: "/reliability" },
  { label: "Affordability", href: "/affordability" },
  { label: "Generation Mix", href: "/generation-mix" },
  { label: "Environmental", href: "/environmental" },
  { label: "Market Trends", href: "/market-trends" },
  { label: "Land Use", href: "/land-use" },
  { label: "Methodology", href: "/methodology" },
] as const;

export const CATEGORY_META = {
  reliability: {
    title: "Grid Reliability",
    description:
      "How reliably does the U.S. electric grid deliver power? Tracking outage duration, reserve margins, and major disturbance events.",
    color: "#0D7377",
    icon: "shield",
  },
  affordability: {
    title: "Electricity Affordability",
    description:
      "What does electricity cost, and how does that burden vary across states, sectors, and household budgets?",
    color: "#D97706",
    icon: "dollar",
  },
  "generation-mix": {
    title: "Generation Mix",
    description:
      "How is U.S. electricity generated? Tracking the evolving share of coal, gas, nuclear, wind, solar, and other sources.",
    color: "#7C3AED",
    icon: "bolt",
  },
  environmental: {
    title: "Environmental Impact",
    description:
      "What are the environmental consequences of electricity generation? Tracking CO2 emissions, emissions intensity, and criteria pollutants.",
    color: "#059669",
    icon: "leaf",
  },
  "market-trends": {
    title: "Market & Industry Trends",
    description:
      "What market forces shape the energy sector? Gas-electricity price linkages, technology costs, and demand growth drivers.",
    color: "#2563EB",
    icon: "chart",
  },
  "land-use": {
    title: "Land Use Impacts",
    description:
      "How much land does energy infrastructure require? Comparing the spatial footprint of generation technologies and tracking cumulative land commitments over time.",
    color: "#92400E",
    icon: "map",
  },
} as const;

/** Ordered array of category slugs for prev/next navigation */
export const CATEGORY_ORDER = [
  "reliability",
  "affordability",
  "generation-mix",
  "environmental",
  "market-trends",
  "land-use",
] as const;

export type CategorySlug = keyof typeof CATEGORY_META;

export const EIA_API_BASE = "https://api.eia.gov/v2";
export const DATA_REFRESH_INTERVAL = 86400; // 24 hours in seconds
