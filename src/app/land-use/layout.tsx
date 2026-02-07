import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Land Use Impacts",
  description:
    "How much land does energy infrastructure require? Comparing the spatial footprint of generation technologies and tracking cumulative land commitments over time.",
  openGraph: {
    title: "Land Use Impacts | U.S. Energy Policy Data",
    description:
      "How much land does energy infrastructure require? Comparing the spatial footprint of generation technologies and tracking cumulative land commitments over time.",
    type: "article",
  },
};

export default function LandUseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
