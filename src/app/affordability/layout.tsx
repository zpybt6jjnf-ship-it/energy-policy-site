import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Electricity Affordability",
  description:
    "What does electricity cost, and how does that burden vary across states, sectors, and household budgets?",
  openGraph: {
    title: "Electricity Affordability | U.S. Energy Policy Data",
    description:
      "What does electricity cost, and how does that burden vary across states, sectors, and household budgets?",
    type: "article",
  },
};

export default function AffordabilityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
