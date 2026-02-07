"use client";

interface ChartDownloadProps {
  chartId: string;
  data: unknown[];
}

function flattenRow(row: unknown): Record<string, string> {
  const result: Record<string, string> = {};

  function walk(obj: unknown, prefix: string): void {
    if (obj === null || obj === undefined) {
      result[prefix] = "";
      return;
    }
    if (typeof obj !== "object") {
      result[prefix] = String(obj);
      return;
    }
    const record = obj as Record<string, unknown>;
    for (const key of Object.keys(record)) {
      const path = prefix ? `${prefix}.${key}` : key;
      walk(record[key], path);
    }
  }

  walk(row, "");
  return result;
}

function escapeCsvField(value: string): string {
  if (value.includes(",") || value.includes('"') || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

function convertToCsv(data: unknown[]): string {
  if (data.length === 0) return "";

  const flatRows = data.map((row) => flattenRow(row));
  const allKeys = Array.from(
    new Set(flatRows.flatMap((row) => Object.keys(row)))
  );

  const header = allKeys.map(escapeCsvField).join(",");
  const rows = flatRows.map((row) =>
    allKeys.map((key) => escapeCsvField(row[key] ?? "")).join(",")
  );

  return [header, ...rows].join("\n");
}

function downloadCsv(chartId: string, data: unknown[]): void {
  const csv = convertToCsv(data);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `${chartId}.csv`;
  link.style.display = "none";
  document.body.appendChild(link);
  link.click();

  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function handlePngExport(chartId: string): void {
  // Stub: PNG export requires a rendering library such as html2canvas.
  // Wire this up once the project adds html2canvas or a similar dependency.
  console.log(`PNG export requested for chart: ${chartId}`);
}

function handleSvgExport(chartId: string): void {
  // Stub: SVG export can be implemented by serializing the Recharts SVG node.
  // Wire this up once chart ref forwarding is in place.
  console.log(`SVG export requested for chart: ${chartId}`);
}

export default function ChartDownload({ chartId, data }: ChartDownloadProps) {
  return (
    <div className="mt-3 flex items-center gap-2 no-print">
      <span className="text-xs font-medium text-muted">Export:</span>
      <button
        type="button"
        onClick={() => handlePngExport(chartId)}
        className="rounded border border-border px-2 py-1 text-xs text-muted transition-colors hover:bg-card-bg hover:text-foreground"
      >
        PNG
      </button>
      <button
        type="button"
        onClick={() => handleSvgExport(chartId)}
        className="rounded border border-border px-2 py-1 text-xs text-muted transition-colors hover:bg-card-bg hover:text-foreground"
      >
        SVG
      </button>
      <button
        type="button"
        onClick={() => downloadCsv(chartId, data)}
        className="rounded border border-border px-2 py-1 text-xs text-muted transition-colors hover:bg-card-bg hover:text-foreground"
      >
        CSV
      </button>
    </div>
  );
}
