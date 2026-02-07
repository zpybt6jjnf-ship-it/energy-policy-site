"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { CATEGORY_META } from "@/lib/constants";

// ---------------------------------------------------------------------------
// Hooks & helpers (kept from original)
// ---------------------------------------------------------------------------

function useCountUp(target: number, duration = 1200) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion) {
      setCount(target);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const startTime = performance.now();

          function animate(now: number) {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.round(eased * target));
            if (progress < 1) {
              requestAnimationFrame(animate);
            }
          }

          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.3 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [target, duration]);

  return { count, ref };
}

function parseNumericValue(value: string): number | null {
  const match = value.match(/^[\d,]+(\.\d+)?/);
  if (!match) return null;
  return parseFloat(match[0].replace(/,/g, ""));
}

function getValueSuffix(value: string): string {
  const match = value.match(/^[\d,]+(\.\d+)?(.*)/);
  if (!match) return "";
  return match[2];
}

function formatNumber(n: number, hasDecimal: boolean): string {
  if (hasDecimal)
    return n.toLocaleString("en-US", {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    });
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
    1400,
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

// ---------------------------------------------------------------------------
// Scroll-reveal hook
// ---------------------------------------------------------------------------

function useScrollReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, visible };
}

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

type Trend = "up" | "down" | "neutral";

interface KeyMetric {
  label: string;
  value: string;
  subtitle: string;
  category: string;
  trend: Trend;
  /** Mini sparkline-style data to draw a tiny SVG trend line */
  spark: number[];
}

const KEY_METRICS: KeyMetric[] = [
  {
    label: "Power Sector CO2",
    value: "1,340 MMT",
    subtitle: "Down 42% from 2005 peak",
    category: "/environmental",
    trend: "down",
    spark: [95, 92, 88, 82, 78, 72, 68, 60],
  },
  {
    label: "Avg. Retail Price",
    value: "13.1\u00A2/kWh",
    subtitle: "All sectors, 2024",
    category: "/affordability",
    trend: "up",
    spark: [40, 42, 45, 50, 55, 60, 62, 68],
  },
  {
    label: "Renewable Share",
    value: "24%",
    subtitle: "Wind + solar generation, 2024",
    category: "/generation-mix",
    trend: "up",
    spark: [15, 20, 28, 35, 42, 52, 60, 72],
  },
  {
    label: "Avg. Outage Duration",
    value: "550 min/yr",
    subtitle: "Including major event days",
    category: "/reliability",
    trend: "up",
    spark: [35, 38, 45, 50, 48, 55, 62, 70],
  },
  {
    label: "Henry Hub Gas Price",
    value: "$2.28/MMBtu",
    subtitle: "Annual average, 2024",
    category: "/market-trends",
    trend: "down",
    spark: [80, 72, 65, 50, 40, 35, 30, 28],
  },
  {
    label: "Wind Land Density",
    value: "1.9 W/m\u00B2",
    subtitle: "Median, total lease area",
    category: "/land-use",
    trend: "neutral",
    spark: [48, 50, 49, 51, 50, 50, 49, 50],
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

// ---------------------------------------------------------------------------
// Trend helpers
// ---------------------------------------------------------------------------

/**
 * Whether a trend direction is "good" or "bad" depends on the metric.
 *   - CO2 going down is good. Gas price going down is good.
 *   - Price going up is bad. Outage duration going up is bad.
 *   - Renewable share going up is good.
 *   - Neutral is always neutral.
 */
function getTrendSentiment(
  trend: Trend,
  label: string,
): "positive" | "negative" | "neutral" {
  if (trend === "neutral") return "neutral";

  const lowerIsGood = ["power sector co2", "henry hub gas price"];
  const upperIsGood = ["renewable share"];

  const lbl = label.toLowerCase();

  if (lowerIsGood.some((k) => lbl.includes(k))) {
    return trend === "down" ? "positive" : "negative";
  }
  if (upperIsGood.some((k) => lbl.includes(k))) {
    return trend === "up" ? "positive" : "negative";
  }

  // Default: up is bad (price going up, outage going up)
  return trend === "down" ? "positive" : "negative";
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function TrendBadge({ trend, label }: { trend: Trend; label: string }) {
  const sentiment = getTrendSentiment(trend, label);

  if (trend === "neutral") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-white/5 px-2.5 py-1 text-xs font-medium text-text-muted">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path
            d="M2 6h8"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
        Stable
      </span>
    );
  }

  const isUp = trend === "up";
  const isPositive = sentiment === "positive";
  const color = isPositive ? "text-energy-green" : "text-energy-rose";
  const bg = isPositive
    ? "bg-energy-green/10"
    : "bg-energy-rose/10";

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${color} ${bg}`}
    >
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
        {isUp ? (
          <path
            d="M6 2v8M6 2l3 3M6 2L3 5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ) : (
          <path
            d="M6 10V2M6 10l3-3M6 10l-3-3"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}
      </svg>
      {isUp ? "Rising" : "Falling"}
    </span>
  );
}

function Sparkline({
  data,
  trend,
  label,
}: {
  data: number[];
  trend: Trend;
  label: string;
}) {
  const sentiment = getTrendSentiment(trend, label);
  const color =
    sentiment === "positive"
      ? "#34D399"
      : sentiment === "negative"
        ? "#FB7185"
        : "#94A3B8";

  const width = 80;
  const height = 28;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;

  const points = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = height - ((v - min) / range) * (height - 4) - 2;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className="overflow-visible"
    >
      <defs>
        <linearGradient
          id={`spark-grad-${label.replace(/\s/g, "")}`}
          x1="0"
          y1="0"
          x2="0"
          y2="1"
        >
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* Area fill */}
      <polygon
        points={`0,${height} ${points} ${width},${height}`}
        fill={`url(#spark-grad-${label.replace(/\s/g, "")})`}
      />
      {/* Line */}
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* End dot */}
      {data.length > 0 && (
        <circle
          cx={width}
          cy={
            height -
            ((data[data.length - 1] - min) / range) * (height - 4) -
            2
          }
          r="2"
          fill={color}
        />
      )}
    </svg>
  );
}

function MetricIcon({ category }: { category: string }) {
  const slug = category.replace("/", "");
  const iconMap: Record<string, React.ReactNode> = {
    environmental: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 008 20a4 4 0 004-4 4 4 0 014-4c.99 0 1.93.29 2.73.78" />
        <path d="M17 2.5A12.52 12.52 0 0021.5 8c.24.91.48 2 .5 3a12 12 0 01-4 0c-1-.21-2.06-.68-3-1.5S13.18 7.39 13 6" />
      </svg>
    ),
    affordability: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <line x1="12" y1="1" x2="12" y2="23" />
        <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
      </svg>
    ),
    "generation-mix": (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    ),
    reliability: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    "market-trends": (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
    "land-use": (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
        <line x1="8" y1="2" x2="8" y2="18" />
        <line x1="16" y1="6" x2="16" y2="22" />
      </svg>
    ),
  };

  return (
    <span className="text-text-muted">
      {iconMap[slug] ?? iconMap["environmental"]}
    </span>
  );
}

function CategoryIcon({ icon }: { icon: string }) {
  const icons: Record<string, React.ReactNode> = {
    shield: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    dollar: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <line x1="12" y1="1" x2="12" y2="23" />
        <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
      </svg>
    ),
    bolt: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    ),
    leaf: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 008 20a4 4 0 004-4 4 4 0 014-4c.99 0 1.93.29 2.73.78" />
        <path d="M17 2.5A12.52 12.52 0 0021.5 8c.24.91.48 2 .5 3a12 12 0 01-4 0c-1-.21-2.06-.68-3-1.5S13.18 7.39 13 6" />
      </svg>
    ),
    chart: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
    map: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
        <line x1="8" y1="2" x2="8" y2="18" />
        <line x1="16" y1="6" x2="16" y2="22" />
      </svg>
    ),
  };

  return <>{icons[icon] ?? icons["chart"]}</>;
}

// ---------------------------------------------------------------------------
// Data principles
// ---------------------------------------------------------------------------

const DATA_PRINCIPLES = [
  {
    title: "Government sources only",
    desc: "Every data point comes from EIA, EPA, NERC, DOE, or BLS. No industry, advocacy, or think-tank data.",
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    ),
  },
  {
    title: "Show data, not conclusions",
    desc: "We explain what the data shows, not what policy to adopt. Where reasonable people disagree, we present multiple interpretations.",
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="16" x2="12" y2="12" />
        <line x1="12" y1="8" x2="12.01" y2="8" />
      </svg>
    ),
  },
  {
    title: "Transparent methodology",
    desc: "Every chart documents its exact data source, transformations applied, and known data quality issues.",
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    ),
  },
  {
    title: "Neutral language",
    desc: "\u201CGeneration sources\u201D not \u201Cclean/dirty energy.\u201D \u201CVariable renewable\u201D not \u201Cintermittent.\u201D We contextualize without attributing single causes.",
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 3a6 6 0 00-6 6v4l-2 2h16l-2-2V9a6 6 0 00-6-6z" />
        <path d="M9 17v1a3 3 0 006 0v-1" />
      </svg>
    ),
  },
  {
    title: "Include trade-offs",
    desc: "Positive trends are presented alongside countervailing data. Energy policy involves real trade-offs, and honest analysis acknowledges them.",
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
        <polyline points="17 6 23 6 23 12" />
      </svg>
    ),
  },
];

// ---------------------------------------------------------------------------
// Page component
// ---------------------------------------------------------------------------

export default function HomePage() {
  const kpiSection = useScrollReveal<HTMLDivElement>();
  const catSection = useScrollReveal<HTMLDivElement>();
  const principlesSection = useScrollReveal<HTMLDivElement>();

  return (
    <div className="space-y-0">
      {/* ================================================================= */}
      {/* Hero Section - Full-bleed dark gradient                           */}
      {/* ================================================================= */}
      <section
        className="-mx-4 -mt-8 sm:-mx-6 lg:-mx-8 relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, #0B1120 0%, #0B1120 40%, #0A1F2E 70%, #0B2027 100%)",
        }}
      >
        {/* Subtle decorative elements */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "radial-gradient(ellipse 80% 50% at 70% 40%, rgba(52, 211, 153, 0.08), transparent), radial-gradient(ellipse 60% 40% at 30% 70%, rgba(34, 211, 238, 0.05), transparent)",
          }}
        />
        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8 lg:py-32">
          <div className="max-w-3xl">
            {/* Eyebrow */}
            <p className="mb-4 flex items-center gap-2 text-sm font-medium tracking-wide text-energy-green uppercase">
              <span className="inline-block h-px w-8 bg-energy-green/60" />
              Nonpartisan energy data
            </p>

            <h1 className="font-[family-name:var(--font-display)] text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-[48px] lg:leading-[1.15]">
              U.S. Energy Policy,{" "}
              <span className="text-energy-green">Driven by Data</span>
            </h1>

            <p className="mt-6 text-lg leading-relaxed text-slate-300 max-w-2xl">
              Seventeen interactive charts across six categories, built
              exclusively on government primary-source data from the EIA, EPA,
              NERC, DOE, and BLS. No advocacy. No industry funding. No agenda.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/generation-mix"
                className="inline-flex items-center gap-2 rounded-xl bg-energy-green px-8 py-4 text-base font-semibold text-midnight transition-all hover:brightness-110 hover:shadow-[0_0_24px_rgba(52,211,153,0.3)]"
              >
                Explore the data
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 8h10M9 4l4 4-4 4" />
                </svg>
              </Link>
              <Link
                href="/methodology"
                className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-8 py-4 text-base font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/10 hover:border-white/25"
              >
                Our methodology
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* Key Metrics - Glassmorphism KPI cards with sparklines              */}
      {/* ================================================================= */}
      <section className="pt-20 pb-4">
        <div
          ref={kpiSection.ref}
          className={`transition-all duration-700 ${kpiSection.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <div className="mb-10 flex items-end justify-between">
            <div>
              <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold text-text-primary">
                Key Metrics at a Glance
              </h2>
              <p className="mt-2 text-sm text-text-muted">
                High-level indicators across the U.S. energy landscape
              </p>
            </div>
          </div>

          {/* Bento grid for KPI cards: 12-col layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-6">
            {KEY_METRICS.map((metric, i) => {
              // First two cards span 4 cols, next two span 4, last two span 4
              // This gives a nice 3-across on large screens
              const colSpan = "lg:col-span-4";

              return (
                <Link
                  key={metric.label}
                  href={metric.category}
                  className={`card-hover group relative block rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.3)] transition-all duration-300 hover:bg-white/[0.06] hover:border-white/20 ${colSpan}`}
                  style={{
                    transitionDelay: kpiSection.visible ? `${i * 80}ms` : "0ms",
                  }}
                >
                  {/* Top row: icon + trend badge */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5">
                      <MetricIcon category={metric.category} />
                    </div>
                    <TrendBadge trend={metric.trend} label={metric.label} />
                  </div>

                  {/* Number */}
                  <p className="text-3xl font-bold font-mono text-text-primary tracking-tight">
                    <AnimatedMetricValue value={metric.value} />
                  </p>

                  {/* Label */}
                  <p className="mt-1 text-sm font-medium text-text-muted">
                    {metric.label}
                  </p>

                  {/* Sparkline + subtitle row */}
                  <div className="mt-4 flex items-end justify-between gap-3">
                    <p className="text-xs text-text-muted/70 leading-snug flex-1">
                      {metric.subtitle}
                    </p>
                    <Sparkline
                      data={metric.spark}
                      trend={metric.trend}
                      label={metric.label}
                    />
                  </div>

                  {/* Hover glow */}
                  <div
                    className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    style={{
                      background: `radial-gradient(400px circle at 50% 50%, ${getCategoryColor(metric.category)}10, transparent 60%)`,
                    }}
                  />
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* Category Cards - Bento grid with glassmorphism                    */}
      {/* ================================================================= */}
      <section className="pt-16 pb-4">
        <div
          ref={catSection.ref}
          className={`transition-all duration-700 ${catSection.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <div className="mb-10">
            <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold text-text-primary">
              Explore by Category
            </h2>
            <p className="mt-2 text-sm text-text-muted">
              Six categories of energy data, each with interactive charts and
              source citations
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {(
              Object.entries(CATEGORY_META) as [
                string,
                {
                  title: string;
                  description: string;
                  color: string;
                  icon: string;
                },
              ][]
            ).map(([slug, meta], i) => (
              <Link
                key={slug}
                href={`/${slug}`}
                className="card-hover group relative flex gap-5 rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.3)] transition-all duration-300 hover:bg-white/[0.06] hover:border-white/20 overflow-hidden"
                style={{
                  transitionDelay: catSection.visible ? `${i * 60}ms` : "0ms",
                }}
              >
                {/* Glowing left border accent */}
                <div
                  className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl"
                  style={{ backgroundColor: meta.color }}
                />
                <div
                  className="absolute left-0 top-1/4 bottom-1/4 w-8 opacity-20 blur-xl"
                  style={{ backgroundColor: meta.color }}
                />

                {/* Icon */}
                <div
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-colors duration-300"
                  style={{
                    backgroundColor: `${meta.color}15`,
                    color: meta.color,
                  }}
                >
                  <CategoryIcon icon={meta.icon} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-text-primary group-hover:text-energy-green transition-colors duration-200">
                    {meta.title}
                  </h3>
                  <p className="mt-1.5 text-sm text-text-muted leading-relaxed line-clamp-2">
                    {meta.description}
                  </p>
                  <div className="mt-4 flex items-center gap-2">
                    <span
                      className="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium"
                      style={{
                        backgroundColor: `${meta.color}15`,
                        color: meta.color,
                      }}
                    >
                      {CHART_COUNTS[slug] ?? 3} charts
                    </span>
                    <span className="text-sm font-medium text-text-muted group-hover:text-energy-green transition-colors duration-200 flex items-center gap-1">
                      Explore
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 14 14"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="transition-transform duration-200 group-hover:translate-x-0.5"
                      >
                        <path d="M2 7h10M8 3l4 4-4 4" />
                      </svg>
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* Data Principles - Glassmorphism card                              */}
      {/* ================================================================= */}
      <section className="pt-16 pb-4">
        <div
          ref={principlesSection.ref}
          className={`transition-all duration-700 ${principlesSection.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.3)] p-8 sm:p-10">
            {/* Header */}
            <div className="mb-8">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-energy-green/10 text-energy-green">
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  <polyline points="9 12 11 14 15 10" />
                </svg>
              </div>
              <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold text-text-primary">
                Our Data Principles
              </h2>
              <p className="mt-2 text-sm text-text-muted">
                The standards that guide every chart and analysis on this site
              </p>
            </div>

            {/* Principles grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {DATA_PRINCIPLES.map((p, i) => (
                <div
                  key={p.title}
                  className="flex gap-4"
                  style={{
                    transitionDelay: principlesSection.visible
                      ? `${i * 60}ms`
                      : "0ms",
                  }}
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/5 text-energy-green">
                    {p.icon}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-text-primary">
                      {p.title}
                    </h3>
                    <p className="mt-1 text-sm text-text-muted leading-relaxed">
                      {p.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Helper used by KPI cards for hover glow
// ---------------------------------------------------------------------------

function getCategoryColor(categoryPath: string): string {
  const slug = categoryPath.replace("/", "");
  const meta = CATEGORY_META[slug as keyof typeof CATEGORY_META];
  return meta?.color ?? "#0D7377";
}
