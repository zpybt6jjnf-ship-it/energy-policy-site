import ChartSkeleton from "@/components/ui/ChartSkeleton";

export default function Loading() {
  return (
    <div className="space-y-16 py-8">
      <ChartSkeleton />
      <ChartSkeleton />
      <ChartSkeleton />
    </div>
  );
}
