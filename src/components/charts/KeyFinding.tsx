interface KeyFindingProps {
  stat: string;
  description: string;
  color?: string;
}

export default function KeyFinding({ stat, description, color = "#0D7377" }: KeyFindingProps) {
  return (
    <div className="mb-6 flex items-baseline gap-3">
      <span
        className="text-3xl font-bold tracking-tight sm:text-4xl"
        style={{ color }}
      >
        {stat}
      </span>
      <span className="text-base text-muted">
        {description}
      </span>
    </div>
  );
}
