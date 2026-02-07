"use client";

import { useId } from "react";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  label: string;
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
}

export default function Select({ label, options, value, onChange }: SelectProps) {
  const id = useId();

  return (
    <div className="flex items-center gap-2">
      <label
        htmlFor={id}
        className="shrink-0 text-sm text-muted"
      >
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded border border-border bg-white px-2 py-1 text-sm text-foreground transition-colors hover:border-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
