"use client";

import { useRef, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "motion/react";
import { CATEGORY_META, CATEGORY_ORDER } from "@/lib/constants";

interface ChartLink {
  id: string;
  label: string;
}

interface CategoryLayoutProps {
  title: string;
  description: string;
  children: React.ReactNode;
  chartLinks?: ChartLink[];
}

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  shield: (
    <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
    </svg>
  ),
  dollar: (
    <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
  ),
  bolt: (
    <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" />
    </svg>
  ),
  leaf: (
    <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21c-4-4-8-7.5-8-12a8 8 0 0 1 16 0c0 4.5-4 8-8 12Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 13V7m-3 3h6" />
    </svg>
  ),
  chart: (
    <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
    </svg>
  ),
  map: (
    <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498 4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 0 0-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0Z" />
    </svg>
  ),
};

export default function CategoryLayout({
  title,
  description,
  children,
  chartLinks,
}: CategoryLayoutProps) {
  const pathname = usePathname();
  const slug = pathname.replace("/", "") as (typeof CATEGORY_ORDER)[number];
  const currentIndex = CATEGORY_ORDER.indexOf(slug);
  const prevSlug = currentIndex > 0 ? CATEGORY_ORDER[currentIndex - 1] : null;
  const nextSlug =
    currentIndex < CATEGORY_ORDER.length - 1
      ? CATEGORY_ORDER[currentIndex + 1]
      : null;

  const meta = slug in CATEGORY_META
    ? (CATEGORY_META as Record<string, { color?: string; icon?: string; title: string; description: string }>)[slug]
    : undefined;
  const categoryColor = meta?.color;
  const categoryIcon = meta?.icon;

  const prefersReduced = useReducedMotion();

  // Parallax: track scroll on the header element
  const headerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: headerRef,
    offset: ["start start", "end start"],
  });

  // Glow elements move at ~30% of scroll speed (subtle parallax)
  // When scrollYProgress goes 0->1, glows shift 0->25px downward (slower than content)
  const glowY = useTransform(scrollYProgress, [0, 1], [0, 25]);
  // Slight opacity fade as header scrolls out of view
  const glowOpacity = useTransform(scrollYProgress, [0, 0.8, 1], [1, 1, 0.6]);

  // Smooth scroll handler for chart pill navigation
  const handlePillClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
      e.preventDefault();
      const el = document.getElementById(targetId);
      if (!el) return;
      el.scrollIntoView({ behavior: prefersReduced ? "auto" : "smooth" });
    },
    [prefersReduced],
  );

  return (
    <article>
      {/* Breadcrumb navigation */}
      <nav aria-label="Breadcrumb" className="mb-4">
        <ol className="flex items-center gap-1.5 text-sm text-slate-400">
          <li>
            <Link
              href="/"
              className="text-slate-300 transition-colors hover:text-emerald-400"
            >
              Home
            </Link>
          </li>
          <li aria-hidden="true" className="text-slate-500">
            ›
          </li>
          <li className="text-slate-500">
            {title}
          </li>
        </ol>
      </nav>

      {/* Glassmorphism category header */}
      <header
        ref={headerRef}
        className="relative mb-10 overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.03] p-8 backdrop-blur-xl"
      >
        {/* Gradient glow accent from category color — with parallax */}
        {categoryColor && (
          <motion.div
            className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full opacity-20 blur-3xl"
            style={{
              backgroundColor: categoryColor,
              y: prefersReduced ? 0 : glowY,
              opacity: prefersReduced ? 0.2 : glowOpacity,
            }}
            aria-hidden="true"
          />
        )}
        {categoryColor && (
          <motion.div
            className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full opacity-10 blur-3xl"
            style={{
              backgroundColor: categoryColor,
              y: prefersReduced ? 0 : glowY,
            }}
            aria-hidden="true"
          />
        )}

        <div className="relative z-10 flex items-start gap-5">
          {/* Icon circle with category color */}
          {categoryIcon && categoryColor && (
            <motion.div
              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-white/10"
              style={{
                backgroundColor: `${categoryColor}20`,
                color: categoryColor,
              }}
              initial={prefersReduced ? false : { opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={
                prefersReduced
                  ? { duration: 0 }
                  : { type: "spring", damping: 20, stiffness: 200, delay: 0.1 }
              }
              aria-hidden="true"
            >
              {CATEGORY_ICONS[categoryIcon]}
            </motion.div>
          )}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-3">
              {categoryColor && (
                <motion.span
                  className="inline-block h-8 w-1 rounded-full"
                  style={{ backgroundColor: categoryColor }}
                  initial={prefersReduced ? false : { scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={
                    prefersReduced
                      ? { duration: 0 }
                      : { type: "spring", damping: 20, stiffness: 200, delay: 0.05 }
                  }
                  aria-hidden="true"
                />
              )}
              <motion.h1
                className="font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight text-text-primary"
                initial={prefersReduced ? false : { opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={
                  prefersReduced
                    ? { duration: 0 }
                    : { type: "spring", damping: 25, stiffness: 120, delay: 0.05 }
                }
              >
                {title}
              </motion.h1>
            </div>
            <motion.p
              className="mt-3 max-w-3xl text-lg leading-relaxed text-text-muted"
              initial={prefersReduced ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={
                prefersReduced
                  ? { duration: 0 }
                  : { type: "spring", damping: 25, stiffness: 120, delay: 0.12 }
              }
            >
              {description}
            </motion.p>
          </div>
        </div>

        {/* Chart pill links with smooth scroll */}
        {chartLinks && chartLinks.length > 0 && (
          <motion.nav
            aria-label="Charts on this page"
            className="relative z-10 mt-6 flex flex-wrap gap-2"
            initial={prefersReduced ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={
              prefersReduced
                ? { duration: 0 }
                : { type: "spring", damping: 25, stiffness: 120, delay: 0.2 }
            }
          >
            {chartLinks.map((link, i) => (
              <motion.a
                key={link.id}
                href={`#${link.id}`}
                onClick={(e) => handlePillClick(e, link.id)}
                className="rounded-full border border-white/10 bg-white/5 px-4 py-2.5 text-sm min-h-[44px] items-center inline-flex font-medium text-text-muted backdrop-blur-sm transition-all duration-200 hover:border-white/20 hover:bg-white/10 hover:text-text-primary"
                initial={prefersReduced ? false : { opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={
                  prefersReduced
                    ? { duration: 0 }
                    : {
                        type: "spring",
                        damping: 20,
                        stiffness: 200,
                        delay: 0.25 + i * 0.04,
                      }
                }
              >
                {link.label}
              </motion.a>
            ))}
          </motion.nav>
        )}
      </header>

      {/* Chart content */}
      <section>{children}</section>

      {/* Prev / Next category navigation */}
      {(prevSlug || nextSlug) && (
        <nav
          aria-label="Category navigation"
          className="mt-16 grid grid-cols-2 gap-4 border-t border-border-subtle pt-8"
        >
          {prevSlug ? (
            <Link
              href={`/${prevSlug}`}
              className="group relative overflow-hidden rounded-xl border border-white/[0.06] bg-white/[0.03] p-5 min-h-[44px] backdrop-blur-xl transition-all duration-200 hover:border-white/10 hover:bg-white/[0.06]"
            >
              {/* Accent glow */}
              {(CATEGORY_META as Record<string, { color?: string }>)[prevSlug]?.color && (
                <div
                  className="pointer-events-none absolute -left-8 top-1/2 h-16 w-16 -translate-y-1/2 rounded-full opacity-20 blur-2xl transition-opacity group-hover:opacity-40"
                  style={{
                    backgroundColor: (CATEGORY_META as Record<string, { color: string }>)[prevSlug].color,
                  }}
                  aria-hidden="true"
                />
              )}
              <div className="relative z-10">
                <span className="text-xs font-medium uppercase tracking-wider text-text-muted">
                  Previous
                </span>
                <div className="mt-1 flex items-center gap-2">
                  <span
                    aria-hidden="true"
                    className="text-lg text-text-muted transition-transform group-hover:-translate-x-1"
                  >
                    &larr;
                  </span>
                  <span className="font-semibold text-text-primary">
                    {(CATEGORY_META as Record<string, { title: string }>)[prevSlug].title}
                  </span>
                </div>
              </div>
            </Link>
          ) : (
            <div />
          )}
          {nextSlug ? (
            <Link
              href={`/${nextSlug}`}
              className="group relative overflow-hidden rounded-xl border border-white/[0.06] bg-white/[0.03] p-5 min-h-[44px] text-right backdrop-blur-xl transition-all duration-200 hover:border-white/10 hover:bg-white/[0.06]"
            >
              {/* Accent glow */}
              {(CATEGORY_META as Record<string, { color?: string }>)[nextSlug]?.color && (
                <div
                  className="pointer-events-none absolute -right-8 top-1/2 h-16 w-16 -translate-y-1/2 rounded-full opacity-20 blur-2xl transition-opacity group-hover:opacity-40"
                  style={{
                    backgroundColor: (CATEGORY_META as Record<string, { color: string }>)[nextSlug].color,
                  }}
                  aria-hidden="true"
                />
              )}
              <div className="relative z-10">
                <span className="text-xs font-medium uppercase tracking-wider text-text-muted">
                  Next
                </span>
                <div className="mt-1 flex items-center justify-end gap-2">
                  <span className="font-semibold text-text-primary">
                    {(CATEGORY_META as Record<string, { title: string }>)[nextSlug].title}
                  </span>
                  <span
                    aria-hidden="true"
                    className="text-lg text-text-muted transition-transform group-hover:translate-x-1"
                  >
                    &rarr;
                  </span>
                </div>
              </div>
            </Link>
          ) : (
            <div />
          )}
        </nav>
      )}
    </article>
  );
}
