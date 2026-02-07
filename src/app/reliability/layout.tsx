import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Grid Reliability",
  description:
    "How reliably does the U.S. electric grid deliver power? Tracking outage duration, reserve margins, and major disturbance events.",
  openGraph: {
    title: "Grid Reliability | U.S. Energy Policy Data",
    description:
      "How reliably does the U.S. electric grid deliver power? Tracking outage duration, reserve margins, and major disturbance events.",
    type: "article",
  },
};

export default function ReliabilityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
