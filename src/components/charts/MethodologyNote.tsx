"use client";

import type { ReactNode } from "react";

interface MethodologyNoteProps {
  children: ReactNode;
}

export default function MethodologyNote({ children }: MethodologyNoteProps) {
  return (
    <details className="mt-6 rounded-md border border-border bg-card-bg">
      <summary className="cursor-pointer select-none px-4 py-3 text-sm font-medium text-muted hover:text-foreground">
        Methodology &amp; Data Notes
      </summary>
      <div className="border-t border-border px-4 py-3 text-xs leading-relaxed text-muted">
        <div className="space-y-2">
          {children}
        </div>
      </div>
    </details>
  );
}
