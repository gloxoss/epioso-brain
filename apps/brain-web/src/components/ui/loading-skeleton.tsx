import { cn } from "../../lib/class-names";

export interface LoadingSkeletonProps {
  readonly rows?: number;
  readonly title?: string;
  readonly className?: string;
}

export function LoadingSkeleton({
  className,
  rows = 4,
  title = "Loading content",
}: LoadingSkeletonProps) {
  const skeletonRows = Array.from({ length: rows }, (_, index) => index);

  return (
    <div
      className={cn("space-y-3 rounded-md border border-neutral-200 bg-white p-4", className)}
      role="status"
      aria-label={title}
    >
      <span className="sr-only">{title}</span>
      <div className="h-4 w-36 rounded bg-neutral-200 motion-safe:animate-pulse" />
      {skeletonRows.map((row) => (
        <div
          className="grid grid-cols-[minmax(6rem,1fr)_minmax(4rem,0.6fr)_minmax(5rem,0.8fr)] gap-3"
          key={row}
        >
          <div className="h-3 rounded bg-neutral-200 motion-safe:animate-pulse" />
          <div className="h-3 rounded bg-neutral-200 motion-safe:animate-pulse" />
          <div className="h-3 rounded bg-neutral-200 motion-safe:animate-pulse" />
        </div>
      ))}
    </div>
  );
}
