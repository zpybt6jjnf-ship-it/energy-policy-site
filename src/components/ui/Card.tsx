import type { ReactNode } from "react";

interface CardProps {
  title: string;
  value: string;
  subtitle?: string;
  children?: ReactNode;
}

export default function Card({ title, value, subtitle, children }: CardProps) {
  return (
    <div className="rounded-lg border border-border bg-white p-5">
      <p className="text-xs font-medium uppercase tracking-wide text-muted">
        {title}
      </p>
      <p className="mt-1 text-2xl font-bold tracking-tight text-foreground">
        {value}
      </p>
      {subtitle && (
        <p className="mt-1 text-sm text-muted">
          {subtitle}
        </p>
      )}
      {children && <div className="mt-3">{children}</div>}
    </div>
  );
}
