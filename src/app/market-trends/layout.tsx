import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Market & Industry Trends",
  description:
    "What market forces shape the energy sector? Gas-electricity price linkages, technology costs, and demand growth drivers.",
  openGraph: {
    title: "Market & Industry Trends | U.S. Energy Policy Data",
    description:
      "What market forces shape the energy sector? Gas-electricity price linkages, technology costs, and demand growth drivers.",
    type: "article",
  },
};

export default function MarketTrendsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
