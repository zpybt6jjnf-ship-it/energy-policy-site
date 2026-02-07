"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { SITE_TITLE, NAV_CATEGORIES } from "@/lib/constants";

export default function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  function isActive(href: string): boolean {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-sm no-print">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="text-lg font-bold tracking-tight text-foreground"
        >
          {SITE_TITLE}
        </Link>

        {/* Desktop navigation */}
        <nav className="hidden md:block" aria-label="Main navigation">
          <ul className="flex items-center gap-1">
            {NAV_CATEGORIES.map(({ label, href }) => (
              <li key={href}>
                <Link
                  href={href}
                  className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                    isActive(href)
                      ? "bg-accent-light text-accent"
                      : "text-muted hover:bg-accent-light/50 hover:text-foreground"
                  }`}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Mobile menu button */}
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-md p-2 text-muted hover:bg-accent-light hover:text-foreground md:hidden"
          onClick={() => setMobileOpen((prev) => !prev)}
          aria-expanded={mobileOpen}
          aria-controls="mobile-menu"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
        >
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            aria-hidden="true"
          >
            {mobileOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      <nav
        id="mobile-menu"
        className={`overflow-hidden border-t border-border transition-all duration-300 ease-in-out md:hidden ${
          mobileOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0 border-t-0"
        }`}
        aria-label="Mobile navigation"
        aria-hidden={!mobileOpen}
      >
        <ul className="mx-auto max-w-7xl space-y-1 px-4 pb-4 pt-2 sm:px-6">
          {NAV_CATEGORIES.map(({ label, href }) => (
            <li key={href}>
              <Link
                href={href}
                onClick={() => setMobileOpen(false)}
                className={`block rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  isActive(href)
                    ? "bg-accent-light text-accent"
                    : "text-muted hover:bg-accent-light/50 hover:text-foreground"
                }`}
                tabIndex={mobileOpen ? 0 : -1}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
