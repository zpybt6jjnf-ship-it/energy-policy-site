"use client";

import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4">
      <div className="flex max-w-lg flex-col items-center gap-6 rounded-2xl bg-white/[0.03] border border-white/10 p-10 text-center backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
        {/* Warning icon */}
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-energy-rose/10">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-7 w-7 text-energy-rose"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
            />
          </svg>
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-text-primary">
            Something went wrong
          </h2>
          <p className="text-sm leading-relaxed text-slate-300">
            An error occurred while loading this page. You can try again or
            return to the homepage.
          </p>
        </div>

        {/* Error detail for debugging */}
        {error.message && (
          <p className="w-full rounded-lg bg-white/[0.03] px-4 py-2.5 text-xs text-text-muted/60 font-mono break-words">
            {error.message}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={reset}
            className="rounded-lg bg-energy-green/10 px-5 py-2.5 text-sm font-medium text-energy-green transition-colors hover:bg-energy-green/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-energy-green"
          >
            Try again
          </button>
          <Link
            href="/"
            className="rounded-lg border border-white/10 px-5 py-2.5 text-sm font-medium text-slate-300 transition-colors hover:bg-white/[0.05] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-energy-green"
          >
            Back to homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
