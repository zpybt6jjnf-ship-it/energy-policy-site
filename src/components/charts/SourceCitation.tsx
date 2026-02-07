import type { DataSource } from "@/lib/data/types";

interface SourceCitationProps {
  source: DataSource;
}

export default function SourceCitation({ source }: SourceCitationProps) {
  const vintage = source.vintage ? ` (${source.vintage})` : "";

  return (
    <p className="mt-3 text-xs leading-relaxed text-muted">
      Source:{" "}
      <a
        href={source.url}
        target="_blank"
        rel="noopener noreferrer"
        className="underline underline-offset-2 hover:text-foreground"
      >
        {source.agency}, {source.dataset}
      </a>
      {vintage}. Accessed: {source.accessDate}.
    </p>
  );
}
