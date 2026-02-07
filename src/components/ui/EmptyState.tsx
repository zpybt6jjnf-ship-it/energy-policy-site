interface EmptyStateProps {
  message: string;
  height?: number;
}

export default function EmptyState({ message, height = 500 }: EmptyStateProps) {
  return (
    <div
      className="flex items-center justify-center text-sm text-text-muted"
      style={{ height }}
    >
      {message}
    </div>
  );
}
