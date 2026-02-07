import type { ReactNode } from "react";

interface AnalysisBlockProps {
  children: ReactNode;
}

export default function AnalysisBlock({ children }: AnalysisBlockProps) {
  return (
    <div className="mt-6 max-w-prose border-l-4 border-accent pl-5 text-base leading-relaxed text-foreground/85">
      <div className="space-y-3">
        {children}
      </div>
    </div>
  );
}
