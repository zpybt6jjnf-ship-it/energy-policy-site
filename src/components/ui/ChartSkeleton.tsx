export default function ChartSkeleton() {
  return (
    <div className="rounded-2xl bg-white/[0.03] border border-white/[0.08] p-6 sm:p-8">
      {/* Title placeholder */}
      <div className="shimmer mb-4 h-7 w-2/5 rounded-md bg-white/[0.06]" />

      {/* Chart area placeholder */}
      <div className="shimmer mb-6 h-[400px] w-full rounded-xl bg-white/[0.06]" />

      {/* Source citation placeholder */}
      <div className="shimmer mb-4 h-3 w-3/5 rounded bg-white/[0.06]" />

      {/* Analysis text block placeholders */}
      <div className="space-y-2">
        <div className="shimmer h-3 w-full rounded bg-white/[0.04]" />
        <div className="shimmer h-3 w-4/5 rounded bg-white/[0.04]" />
        <div className="shimmer h-3 w-3/4 rounded bg-white/[0.04]" />
      </div>
    </div>
  );
}
