"use client";

import { useId, useState, type ReactNode } from "react";

interface MethodologyNoteProps {
  children: ReactNode;
}

export default function MethodologyNote({ children }: MethodologyNoteProps) {
  const [open, setOpen] = useState(false);
  const contentId = useId();

  return (
    <div className="mt-6 rounded-md border border-border bg-card-bg">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-controls={contentId}
        className="flex w-full min-h-[44px] cursor-pointer select-none items-center gap-2 px-4 py-3 text-sm font-medium text-muted hover:text-foreground transition-colors"
      >
        <svg
          aria-hidden="true"
          className="h-4 w-4 shrink-0 transition-transform duration-300 ease-out"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.168l3.71-3.938a.75.75 0 1 1 1.08 1.04l-4.25 4.5a.75.75 0 0 1-1.08 0l-4.25-4.5a.75.75 0 0 1 .02-1.06z"
            clipRule="evenodd"
          />
        </svg>
        Methodology &amp; Data Notes
      </button>
      <div
        id={contentId}
        role="region"
        className="grid transition-[grid-template-rows] duration-300 ease-out"
        style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
      >
        <div className="overflow-hidden min-h-0">
          <div className="border-t border-border px-4 py-3 text-xs leading-relaxed text-muted">
            <div className="space-y-2">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
