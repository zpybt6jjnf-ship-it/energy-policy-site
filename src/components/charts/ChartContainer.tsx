"use client";

import type { ReactNode } from "react";
import type { DataSource } from "@/lib/data/types";
import { motion, useReducedMotion } from "motion/react";
import SourceCitation from "./SourceCitation";
import KeyFinding from "@/components/charts/KeyFinding";
import AccessibleDataTable from "@/components/ui/AccessibleDataTable";
import ChartErrorBoundary from "@/components/ui/ChartErrorBoundary";

interface DataTableProps {
  caption: string;
  headers: string[];
  rows: (string | number)[][];
}

interface ChartContainerProps {
  id: string;
  title: string;
  source: DataSource;
  children: ReactNode;
  analysisContent?: ReactNode;
  methodologyContent?: ReactNode;
  chartAriaLabel: string;
  /** Detailed description for screen readers */
  description?: string;
  keyFinding?: { stat: string; description: string; color?: string };
  /** Data table for accessibility — collapsible table behind the chart */
  dataTable?: DataTableProps;
  /** Stagger index for sibling chart containers (0-based) */
  staggerIndex?: number;
}

export default function ChartContainer({
  id,
  title,
  source,
  children,
  analysisContent,
  methodologyContent,
  chartAriaLabel,
  description,
  keyFinding,
  dataTable,
  staggerIndex = 0,
}: ChartContainerProps) {
  const descId = `chart-desc-${id}`;
  const prefersReduced = useReducedMotion();

  // Stagger delay: each sibling waits an additional 80ms
  const staggerDelay = staggerIndex * 0.08;

  return (
    <section id={id} className="scroll-mt-24">
      <motion.div
        initial={prefersReduced ? false : { opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={
          prefersReduced
            ? { duration: 0 }
            : {
                type: "spring",
                damping: 25,
                stiffness: 120,
                delay: staggerDelay,
              }
        }
      >
        <div className="rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] p-6 sm:p-8 shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
          {keyFinding && (
            <KeyFinding
              stat={keyFinding.stat}
              description={keyFinding.description}
              color={keyFinding.color}
            />
          )}

          <h2 className="font-[family-name:var(--font-display)] mb-4 text-2xl font-semibold tracking-tight text-foreground">
            {title}
          </h2>

          <figure
            role="img"
            aria-label={chartAriaLabel}
            aria-describedby={description ? descId : undefined}
          >
            {description && (
              <p id={descId} className="sr-only">
                {description}
              </p>
            )}
            <motion.div
              className="w-full"
              style={{ minHeight: 350 }}
              initial={prefersReduced ? false : { opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={
                prefersReduced
                  ? { duration: 0 }
                  : {
                      duration: 0.5,
                      ease: "easeOut",
                      delay: staggerDelay + 0.15,
                    }
              }
            >
              <ChartErrorBoundary>
                {children}
              </ChartErrorBoundary>
            </motion.div>
          </figure>

          <SourceCitation source={source} />

          {dataTable && (
            <AccessibleDataTable
              caption={dataTable.caption}
              headers={dataTable.headers}
              rows={dataTable.rows}
            />
          )}

          {analysisContent}

          {methodologyContent}
        </div>
      </motion.div>
    </section>
  );
}
