import type { ReactNode } from "react";

import { cn } from "../../lib/class-names";

export interface EmptyStateProps {
  readonly title: string;
  readonly description: string;
  readonly action?: ReactNode;
  readonly secondaryAction?: ReactNode;
  readonly className?: string;
}

export function EmptyState({
  action,
  className,
  description,
  secondaryAction,
  title,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex min-h-44 flex-col items-start justify-center rounded-md border border-dashed border-neutral-300 bg-neutral-50 px-4 py-5",
        className,
      )}
    >
      <p className="text-sm font-semibold text-neutral-950">{title}</p>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-600">{description}</p>
      {action || secondaryAction ? (
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {action}
          {secondaryAction}
        </div>
      ) : null}
    </div>
  );
}
