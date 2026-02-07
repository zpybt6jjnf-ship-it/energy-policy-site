import Link from "next/link";
import { SITE_TITLE, CATEGORY_META, CATEGORY_ORDER } from "@/lib/constants";

const DATA_SOURCES = [
  { label: "EIA", href: "https://www.eia.gov" },
  { label: "EPA", href: "https://www.epa.gov" },
  { label: "NERC", href: "https://www.nerc.com" },
  { label: "DOE", href: "https://www.energy.gov" },
  { label: "BLS", href: "https://www.bls.gov" },
] as const;

export default function Footer() {
  const year = 2026;

  return (
    <footer className="mt-auto border-t border-border bg-card-bg no-print">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left column: Site name + description */}
          <div>
            <p className="font-[family-name:var(--font-display)] text-lg font-semibold text-foreground">{SITE_TITLE}</p>
            <p className="mt-2 text-sm text-muted">
              Nonpartisan, data-driven analysis of U.S. energy policy using
              government primary-source data. No advocacy, no agenda.
            </p>
          </div>

          {/* Middle column: Category links */}
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-foreground">
              Categories
            </p>
            <ul className="mt-2 space-y-0.5">
              {CATEGORY_ORDER.map((slug) => (
                <li key={slug}>
                  <Link
                    href={`/${slug}`}
                    className="text-sm text-muted hover:text-foreground transition-colors inline-block py-1.5"
                  >
                    {CATEGORY_META[slug].title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Right column: Resources */}
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-foreground">
              Resources
            </p>
            <ul className="mt-2 space-y-0.5">
              <li>
                <Link
                  href="/methodology"
                  className="text-sm text-muted hover:text-foreground transition-colors inline-block py-1.5"
                >
                  Methodology
                </Link>
              </li>
              {DATA_SOURCES.map((src) => (
                <li key={src.label}>
                  <a
                    href={src.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted hover:text-foreground transition-colors inline-block py-1.5"
                  >
                    {src.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom row */}
        <div className="mt-8 border-t border-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted">
          <p>&copy; {year} {SITE_TITLE}</p>
          <p>Data from U.S. government primary sources</p>
        </div>
      </div>
    </footer>
  );
}
