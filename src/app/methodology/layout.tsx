import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Methodology & Data Sources",
  description:
    "Transparency documentation for U.S. Energy Policy Data: data sourcing standards, editorial principles, and the specific government datasets behind every chart.",
  openGraph: {
    title: "Methodology & Data Sources | U.S. Energy Policy Data",
    description:
      "Transparency documentation for U.S. Energy Policy Data: data sourcing standards, editorial principles, and the specific government datasets behind every chart.",
    type: "article",
  },
};

export default function MethodologyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
