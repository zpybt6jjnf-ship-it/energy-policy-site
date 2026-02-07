import type { ReactNode } from "react";
import type { DataSource } from "@/lib/data/types";
import SourceCitation from "./SourceCitation";
import ScrollReveal from "@/components/ui/ScrollReveal";
import KeyFinding from "@/components/charts/KeyFinding";

interface ChartContainerProps {
  id: string;
  title: string;
  source: DataSource;
  children: ReactNode;
  analysisContent?: ReactNode;
  methodologyContent?: ReactNode;
  chartAriaLabel: string;
  keyFinding?: { stat: string; description: string; color?: string };
}

export default function ChartContainer({
  id,
  title,
  source,
  children,
  analysisContent,
  methodologyContent,
  chartAriaLabel,
  keyFinding,
}: ChartContainerProps) {
  return (
    <section id={id} className="scroll-mt-20">
      <ScrollReveal>
        <div className="rounded-xl border border-border bg-card-bg p-6 sm:p-8 shadow-sm">
          {keyFinding && (
            <KeyFinding
              stat={keyFinding.stat}
              description={keyFinding.description}
              color={keyFinding.color}
            />
          )}

          <h2 className="mb-4 text-2xl font-semibold tracking-tight text-foreground">
            {title}
          </h2>

          <figure role="img" aria-label={chartAriaLabel}>
            <div className="w-full" style={{ minHeight: 350 }}>
              {children}
            </div>
          </figure>

          <SourceCitation source={source} />

          {analysisContent}

          {methodologyContent}
        </div>
      </ScrollReveal>
    </section>
  );
}
