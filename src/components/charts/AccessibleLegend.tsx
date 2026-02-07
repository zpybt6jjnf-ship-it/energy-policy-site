"use client";

interface LegendItem {
  name: string;
  color: string;
  active: boolean;
}

interface AccessibleLegendProps {
  items: LegendItem[];
  onToggle: (name: string) => void;
}

export default function AccessibleLegend({
  items,
  onToggle,
}: AccessibleLegendProps) {
  return (
    <div
      role="group"
      aria-label="Chart legend — toggle data series"
      className="flex flex-wrap gap-2 py-3"
    >
      {items.map((item) => (
        <button
          key={item.name}
          onClick={() => onToggle(item.name)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              onToggle(item.name);
            }
          }}
          aria-pressed={item.active}
          className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium transition-all
            focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-energy-green
            ${
              item.active
                ? "bg-white/[0.06] text-slate-200 border border-white/10"
                : "bg-white/[0.02] text-text-muted/50 border border-white/[0.04] line-through"
            }`}
        >
          <span
            className="h-2.5 w-2.5 rounded-full shrink-0 transition-opacity"
            style={{
              backgroundColor: item.color,
              opacity: item.active ? 1 : 0.3,
            }}
          />
          {item.name}
        </button>
      ))}
    </div>
  );
}
