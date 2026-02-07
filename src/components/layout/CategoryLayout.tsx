"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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
  const categoryColor =
    slug in CATEGORY_META
      ? (CATEGORY_META as Record<string, { color?: string }>)[slug]?.color
      : undefined;

  return (
    <article>
      <header className="mb-8 border-b border-border pb-6">
        <div className="flex items-center gap-3">
          {categoryColor && (
            <span
              className="inline-block h-8 w-1.5 rounded-full"
              style={{ backgroundColor: categoryColor }}
              aria-hidden="true"
            />
          )}
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            {title}
          </h1>
        </div>
        <p className="mt-2 text-lg text-muted">{description}</p>

        {chartLinks && chartLinks.length > 0 && (
          <nav
            aria-label="Charts on this page"
            className="mt-4 flex flex-wrap gap-2"
          >
            {chartLinks.map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                className="rounded-full border border-border bg-white px-3 py-1 text-sm font-medium text-muted transition-colors hover:border-accent hover:text-accent"
              >
                {link.label}
              </a>
            ))}
          </nav>
        )}
      </header>

      <section>{children}</section>

      {/* Prev / Next category navigation */}
      {(prevSlug || nextSlug) && (
        <nav
          aria-label="Category navigation"
          className="mt-16 flex items-center justify-between border-t border-border pt-8"
        >
          {prevSlug ? (
            <Link
              href={`/${prevSlug}`}
              className="group flex items-center gap-2 text-sm font-medium text-muted transition-colors hover:text-accent"
            >
              <span
                aria-hidden="true"
                className="transition-transform group-hover:-translate-x-1"
              >
                &larr;
              </span>
              {
                (CATEGORY_META as Record<string, { title: string }>)[prevSlug]
                  .title
              }
            </Link>
          ) : (
            <span />
          )}
          {nextSlug ? (
            <Link
              href={`/${nextSlug}`}
              className="group flex items-center gap-2 text-sm font-medium text-muted transition-colors hover:text-accent"
            >
              {
                (CATEGORY_META as Record<string, { title: string }>)[nextSlug]
                  .title
              }
              <span
                aria-hidden="true"
                className="transition-transform group-hover:translate-x-1"
              >
                &rarr;
              </span>
            </Link>
          ) : (
            <span />
          )}
        </nav>
      )}
    </article>
  );
}
