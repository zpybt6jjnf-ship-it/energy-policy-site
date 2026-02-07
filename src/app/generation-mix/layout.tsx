import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Generation Mix",
  description:
    "How is U.S. electricity generated? Tracking the evolving share of coal, gas, nuclear, wind, solar, and other sources.",
  openGraph: {
    title: "Generation Mix | U.S. Energy Policy Data",
    description:
      "How is U.S. electricity generated? Tracking the evolving share of coal, gas, nuclear, wind, solar, and other sources.",
    type: "article",
  },
};

export default function GenerationMixLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
