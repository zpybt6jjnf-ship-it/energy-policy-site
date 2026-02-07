"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { SITE_TITLE, NAV_CATEGORIES } from "@/lib/constants";
import BottleneckLabsLogo from "@/components/ui/BottleneckLabsLogo";

/* -------------------------------------------------------------------------- */
/*  SVG Icons for the mobile bottom tab bar (24x24)                           */
/* -------------------------------------------------------------------------- */

function IconHome({ active }: { active: boolean }) {
  return (
    <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke={active ? "currentColor" : "currentColor"} strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" />
      <path d="M9 21V12h6v9" />
    </svg>
  );
}

function IconShield({ active }: { active: boolean }) {
  return (
    <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 2l7 4v5c0 5.25-3.5 9.74-7 11-3.5-1.26-7-5.75-7-11V6l7-4z" />
      {active && <path d="M9 12l2 2 4-4" />}
    </svg>
  );
}

function IconDollar({ active }: { active: boolean }) {
  return (
    <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx={12} cy={12} r={9} />
      <path d="M12 7v10M9 9.5c0-1 1.2-1.5 3-1.5s3 .5 3 1.75S13.8 11.5 12 12s-3 .75-3 2 1.2 2 3 2 3-.5 3-1.5" />
    </svg>
  );
}

function IconChartBar({ active }: { active: boolean }) {
  return (
    <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x={3} y={12} width={4} height={9} rx={0.5} fill={active ? "currentColor" : "none"} />
      <rect x={10} y={6} width={4} height={15} rx={0.5} fill={active ? "currentColor" : "none"} />
      <rect x={17} y={3} width={4} height={18} rx={0.5} fill={active ? "currentColor" : "none"} />
    </svg>
  );
}

function IconLeaf({ active }: { active: boolean }) {
  return (
    <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M6 21c3-3 4-8 4-12C10 5 16 3 20 3c0 4-1 10-5 14s-9 4-9 4z" fill={active ? "currentColor" : "none"} fillOpacity={active ? 0.2 : 0} />
      <path d="M6 21c3-3 4-8 4-12C10 5 16 3 20 3c0 4-1 10-5 14s-9 4-9 4z" />
      <path d="M14 10a6 6 0 00-8 8" />
    </svg>
  );
}

function IconTrendingUp({ active }: { active: boolean }) {
  return (
    <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
      <polyline points="16 7 22 7 22 13" />
      {active && <circle cx={13.5} cy={15.5} r={2} fill="currentColor" />}
    </svg>
  );
}

function IconMapPin({ active }: { active: boolean }) {
  return (
    <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill={active ? "currentColor" : "none"} fillOpacity={active ? 0.2 : 0} />
      <circle cx={12} cy={9} r={2.5} />
    </svg>
  );
}

function IconMore() {
  return (
    <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx={12} cy={12} r={1.25} fill="currentColor" />
      <circle cx={5} cy={12} r={1.25} fill="currentColor" />
      <circle cx={19} cy={12} r={1.25} fill="currentColor" />
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/*  Map categories to their icons                                             */
/* -------------------------------------------------------------------------- */

const BOTTOM_TAB_ITEMS: { label: string; shortLabel: string; href: string; icon: React.FC<{ active: boolean }> }[] = [
  { label: "Home",            shortLabel: "Home",    href: "/",                icon: IconHome },
  { label: "Reliability",     shortLabel: "Reliable", href: "/reliability",    icon: IconShield },
  { label: "Affordability",   shortLabel: "Afford",  href: "/affordability",   icon: IconDollar },
  { label: "Generation Mix",  shortLabel: "GenMix",  href: "/generation-mix",  icon: IconChartBar },
  { label: "Environmental",   shortLabel: "Environ", href: "/environmental",   icon: IconLeaf },
  { label: "Market Trends",   shortLabel: "Market",  href: "/market-trends",   icon: IconTrendingUp },
  { label: "Land Use",        shortLabel: "Land",    href: "/land-use",        icon: IconMapPin },
];

/* -------------------------------------------------------------------------- */
/*  Header Component                                                          */
/* -------------------------------------------------------------------------- */

export default function Header() {
  const pathname = usePathname();
  const [moreOpen, setMoreOpen] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  function isActive(href: string): boolean {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  }

  return (
    <>
      {/* ================================================================== */}
      {/*  DESKTOP + MOBILE TOP BAR (glassmorphism sticky nav)               */}
      {/* ================================================================== */}
      <header
        className="sticky top-0 z-50 no-print"
        style={{
          background: "rgba(11, 17, 32, 0.8)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          borderBottom: "1px solid var(--color-border-subtle)",
          height: 64,
        }}
      >
        <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo + Site title */}
          <Link
            href="/"
            className="flex shrink-0 items-center gap-2.5 text-lg font-bold tracking-tight text-text-primary"
          >
            <BottleneckLabsLogo size={36} />
            <span className="hidden sm:inline">{SITE_TITLE}</span>
            <span className="sm:hidden text-base">Energy Data</span>
          </Link>

          {/* Desktop pill navigation */}
          <nav className="hidden md:block" aria-label="Main navigation">
            <ul className="flex items-center gap-1">
              {NAV_CATEGORIES.map(({ label, href }) => {
                const active = isActive(href);
                return (
                  <li key={href} className="relative">
                    <Link
                      href={href}
                      className={`relative z-10 rounded-full px-3.5 py-1.5 text-sm transition-colors ${
                        active
                          ? "font-semibold text-energy-green"
                          : "font-medium text-text-muted hover:text-text-primary"
                      }`}
                    >
                      {label}
                    </Link>
                    {active && (
                      <motion.div
                        layoutId="nav-pill"
                        className="absolute inset-0 rounded-full bg-energy-green/10"
                        transition={
                          prefersReducedMotion
                            ? { duration: 0 }
                            : { type: "spring", bounce: 0.2, duration: 0.4 }
                        }
                      />
                    )}
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Empty spacer on mobile so the title stays left-aligned */}
          <div className="w-6 md:hidden" aria-hidden="true" />
        </div>
      </header>

      {/* ================================================================== */}
      {/*  MOBILE BOTTOM TAB BAR                                             */}
      {/* ================================================================== */}
      <nav
        className="mobile-bottom-bar fixed bottom-0 left-0 right-0 z-50 md:hidden no-print"
        style={{
          background: "rgba(11, 17, 32, 0.95)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          borderTop: "1px solid var(--color-border-subtle)",
          paddingBottom: "env(safe-area-inset-bottom, 0px)",
        }}
        aria-label="Mobile navigation"
      >
        <ul className="mobile-bottom-bar-list flex h-14 items-center justify-around px-1">
          {BOTTOM_TAB_ITEMS.map(({ shortLabel, href, icon: Icon }) => {
            const active = isActive(href);
            return (
              <li key={href} className="flex-1">
                <Link
                  href={href}
                  className={`flex min-h-[44px] flex-col items-center justify-center gap-0.5 transition-colors ${
                    active ? "text-energy-green" : "text-text-muted"
                  }`}
                >
                  <Icon active={active} />
                  <span
                    className={`mobile-tab-label text-[10px] leading-tight ${
                      active ? "font-semibold" : "font-normal"
                    }`}
                  >
                    {shortLabel}
                  </span>
                </Link>
              </li>
            );
          })}

          {/* "More" button for Methodology */}
          <li className="flex-1 relative">
            <button
              type="button"
              onClick={() => setMoreOpen((prev) => !prev)}
              className={`flex min-h-[44px] w-full flex-col items-center justify-center gap-0.5 transition-colors ${
                isActive("/methodology") ? "text-energy-green" : "text-text-muted"
              }`}
              aria-expanded={moreOpen}
              aria-haspopup="true"
              aria-label="More links"
            >
              <IconMore />
              <span className="mobile-tab-label text-[10px] leading-tight font-normal">More</span>
            </button>

            {/* Popover for Methodology link */}
            {moreOpen && (
              <>
                {/* Backdrop to close the popover */}
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setMoreOpen(false)}
                  aria-hidden="true"
                />
                <div
                  className="absolute bottom-full right-0 z-50 mb-2 min-w-[160px] rounded-lg border border-border-subtle p-1 shadow-xl"
                  style={{
                    background: "rgba(17, 24, 39, 0.98)",
                    backdropFilter: "blur(12px)",
                    WebkitBackdropFilter: "blur(12px)",
                  }}
                >
                  <Link
                    href="/methodology"
                    onClick={() => setMoreOpen(false)}
                    className={`flex min-h-[44px] items-center gap-2 rounded-md px-3 py-2.5 text-sm transition-colors ${
                      isActive("/methodology")
                        ? "bg-energy-green/10 font-semibold text-energy-green"
                        : "font-medium text-text-muted hover:bg-surface-raised hover:text-text-primary"
                    }`}
                  >
                    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <circle cx={12} cy={12} r={10} />
                      <path d="M12 16v-4M12 8h.01" />
                    </svg>
                    Methodology
                  </Link>
                </div>
              </>
            )}
          </li>
        </ul>
      </nav>

      {/* Bottom spacer on mobile so page content doesn't hide behind the tab bar */}
      <div
        className="mobile-bottom-spacer md:hidden no-print"
        style={{ height: "calc(56px + env(safe-area-inset-bottom, 0px))" }}
        aria-hidden="true"
      />
    </>
  );
}
