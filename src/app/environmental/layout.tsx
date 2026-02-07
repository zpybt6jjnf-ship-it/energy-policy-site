import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Environmental Impact",
  description:
    "What are the environmental consequences of electricity generation? Tracking CO2 emissions, emissions intensity, and criteria pollutants.",
  openGraph: {
    title: "Environmental Impact | U.S. Energy Policy Data",
    description:
      "What are the environmental consequences of electricity generation? Tracking CO2 emissions, emissions intensity, and criteria pollutants.",
    type: "article",
  },
};

export default function EnvironmentalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
