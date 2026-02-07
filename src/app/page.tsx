"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { CATEGORY_META } from "@/lib/constants";

function useCountUp(target: number, duration = 1200) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const startTime = performance.now();

          function animate(now: number) {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // ease-out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.round(eased * target));
            if (progress < 1) {
              requestAnimationFrame(animate);
            }
          }

          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [target, duration]);

  return { count, ref };
}

/** Extract the leading number from a metric value string like "1,340 MMT" or "24%" */
function parseNumericValue(value: string): number | null {
  const match = value.match(/^[\d,]+(\.\d+)?/);
  if (!match) return null;
  return parseFloat(match[0].replace(/,/g, ""));
}

/** Get the suffix after the number, e.g. " MMT" or "%" */
function getValueSuffix(value: string): string {
  const match = value.match(/^[\d,]+(\.\d+)?(.*)/);
  if (!match) return "";
  return match[2];
}

/** Format number with commas */
function formatNumber(n: number, hasDecimal: boolean): string {
  if (hasDecimal) return n.toLocaleString("en-US", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  return n.toLocaleString("en-US");
}

function AnimatedMetricValue({ value }: { value: string }) {
  const numericValue = parseNumericValue(value);
  const hasDecimal = value.includes(".");

  if (numericValue === null) {
    return <span>{value}</span>;
  }

  const suffix = getValueSuffix(value);
  const { count, ref } = useCountUp(
    hasDecimal ? Math.round(numericValue * 10) : Math.round(numericValue),
    1400
  );

  const displayValue = hasDecimal
    ? formatNumber(count / 10, true)
    : formatNumber(count, false);

  return (
    <span ref={ref}>
      {displayValue}
      {suffix}
    </span>
  );
}

const KEY_METRICS = [
  {
    label: "Power Sector CO2",
    value: "1,340 MMT",
    subtitle: "Down 42% from 2005 peak",
    category: "/environmental",
  },
  {
    label: "Avg. Retail Price",
    value: "13.1\u00A2/kWh",
    subtitle: "All sectors, 2024",
    category: "/affordability",
  },
  {
    label: "Renewable Share",
    value: "24%",
    subtitle: "Wind + solar generation, 2024",
    category: "/generation-mix",
  },
  {
    label: "Avg. Outage Duration",
    value: "550 min/yr",
    subtitle: "Including major event days",
    category: "/reliability",
  },
  {
    label: "Henry Hub Gas Price",
    value: "$2.28/MMBtu",
    subtitle: "Annual average, 2024",
    category: "/market-trends",
  },
  {
    label: "Wind Land Density",
    value: "1.9 W/m\u00B2",
    subtitle: "Median, total lease area",
    category: "/land-use",
  },
];

const CHART_COUNTS: Record<string, number> = {
  reliability: 3,
  affordability: 3,
  "generation-mix": 3,
  environmental: 3,
  "market-trends": 3,
  "land-use": 2,
};

/** Map category paths to CATEGORY_META keys */
function getCategoryColor(categoryPath: string): string {
  const slug = categoryPath.replace("/", "");
  const meta = CATEGORY_META[slug as keyof typeof CATEGORY_META];
  return meta?.color ?? "#0D7377";
}

export default function HomePage() {
  return (
    <div className="space-y-16 pb-8">
      {/* Hero Section */}
      <section className="-mx-6 -mt-8 px-6 py-16 sm:py-20 bg-gradient-to-br from-[#134E4A] to-[#1a1a2e] rounded-b-lg">
        <div className="max-w-3xl">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
            U.S. Energy Policy Data
          </h1>
          <p className="mt-5 text-lg text-white/70 leading-relaxed max-w-2xl">
            Nonpartisan, data-driven analysis of U.S. energy policy. Every chart
            uses government primary-source data from the EIA, EPA, NERC, DOE,
            and BLS. No advocacy data. No industry funding. No agenda.
          </p>
          <p className="mt-3 text-base text-white/60 leading-relaxed max-w-2xl">
            Seventeen interactive charts across six categories, each with
            transparent methodology, source citations, and neutral analytical
            context designed for policy professionals across the political
            spectrum.
          </p>
          <Link
            href="/generation-mix"
            className="inline-block mt-8 px-6 py-3 bg-[#0D7377] text-white font-semibold rounded-lg hover:bg-[#14919B] transition-colors"
          >
            Explore the data
          </Link>
        </div>
      </section>

      {/* Key Metrics */}
      <section>
        <h2 className="text-xl font-semibold text-foreground mb-6">
          Key Metrics at a Glance
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {KEY_METRICS.map((metric) => (
            <Link
              key={metric.label}
              href={metric.category}
              className="group block rounded-lg border border-border bg-card-bg p-6 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
              style={{ borderTopWidth: "3px", borderTopColor: getCategoryColor(metric.category) }}
            >
              <p className="text-xs font-medium uppercase tracking-wide text-muted">
                {metric.label}
              </p>
              <p className="mt-3 text-3xl font-bold text-foreground">
                <AnimatedMetricValue value={metric.value} />
              </p>
              <p className="mt-2 text-sm text-muted">{metric.subtitle}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Category Cards */}
      <section>
        <h2 className="text-xl font-semibold text-foreground mb-6">
          Explore by Category
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(
            Object.entries(CATEGORY_META) as [
              string,
              { title: string; description: string; color: string; icon: string },
            ][]
          ).map(([slug, meta]) => (
            <Link
              key={slug}
              href={`/${slug}`}
              className="group block rounded-lg border border-border bg-card-bg p-6 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
              style={{ borderLeftWidth: "4px", borderLeftColor: meta.color }}
            >
              <h3 className="text-lg font-semibold text-foreground group-hover:text-accent transition-colors">
                {meta.title}
              </h3>
              <p className="mt-2 text-sm text-muted leading-relaxed">
                {meta.description}
              </p>
              <p className="mt-3 text-sm font-medium text-accent">
                View {CHART_COUNTS[slug] ?? 3} charts &rarr;
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Data Principles */}
      <section className="max-w-3xl border-t border-border pt-12">
        <h2 className="text-xl font-semibold text-foreground mb-4">
          Our Data Principles
        </h2>
        <ul className="space-y-3 text-sm text-muted leading-relaxed">
          <li>
            <strong className="text-foreground">Government sources only.</strong>{" "}
            Every data point comes from EIA, EPA, NERC, DOE, or BLS. No
            industry, advocacy, or think-tank data.
          </li>
          <li>
            <strong className="text-foreground">Show data, not conclusions.</strong>{" "}
            We explain what the data shows, not what policy to adopt. Where
            reasonable people disagree, we present multiple interpretations.
          </li>
          <li>
            <strong className="text-foreground">Transparent methodology.</strong>{" "}
            Every chart documents its exact data source, transformations
            applied, and known data quality issues.
          </li>
          <li>
            <strong className="text-foreground">Neutral language.</strong>{" "}
            &ldquo;Generation sources&rdquo; not &ldquo;clean/dirty
            energy.&rdquo; &ldquo;Variable renewable&rdquo; not
            &ldquo;intermittent.&rdquo; We contextualize without attributing
            single causes.
          </li>
          <li>
            <strong className="text-foreground">Include trade-offs.</strong>{" "}
            Positive trends are presented alongside countervailing data. Energy
            policy involves real trade-offs, and honest analysis acknowledges
            them.
          </li>
        </ul>
      </section>
    </div>
  );
}
