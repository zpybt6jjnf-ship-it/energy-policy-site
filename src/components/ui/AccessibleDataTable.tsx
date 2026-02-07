"use client";

import { useId, useState } from "react";

interface AccessibleDataTableProps {
  caption: string;
  headers: string[];
  rows: (string | number)[][];
}

export default function AccessibleDataTable({
  caption,
  headers,
  rows,
}: AccessibleDataTableProps) {
  const [open, setOpen] = useState(false);
  const contentId = useId();

  return (
    <div className="mt-4 border-t border-white/[0.06] pt-3">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-controls={contentId}
        className="flex min-h-[44px] cursor-pointer select-none items-center gap-1.5 py-2 text-sm text-text-muted hover:text-slate-300 transition-colors"
      >
        <svg
          aria-hidden="true"
          className="h-3.5 w-3.5 shrink-0 transition-transform duration-300 ease-out"
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
        View data table
      </button>
      <div
        id={contentId}
        role="region"
        className="grid transition-[grid-template-rows] duration-300 ease-out"
        style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
      >
        <div className="overflow-hidden min-h-0">
          <div className="mt-3 overflow-x-auto rounded-lg border border-white/[0.06]">
            <table className="w-full text-sm">
              <caption className="sr-only">{caption}</caption>
              <thead>
                <tr className="border-b border-white/[0.08] bg-white/[0.02]">
                  {headers.map((h) => (
                    <th
                      key={h}
                      scope="col"
                      className="px-3 py-2.5 text-left text-xs font-medium text-text-muted uppercase tracking-wider"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, i) => (
                  <tr
                    key={i}
                    className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors"
                  >
                    {row.map((cell, j) => (
                      <td
                        key={j}
                        className="px-3 py-2 text-slate-300 tabular-nums whitespace-nowrap"
                      >
                        {typeof cell === "number"
                          ? j === 0
                            ? cell
                            : cell.toLocaleString()
                          : cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
