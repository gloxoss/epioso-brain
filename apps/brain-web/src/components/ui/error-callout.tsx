import type { ReactNode } from "react";

import { cn } from "../../lib/class-names";

export interface ErrorCalloutProps {
  readonly title: string;
  readonly message: string;
  readonly action?: ReactNode;
  readonly className?: string;
}

export function ErrorCallout({ action, className, message, title }: ErrorCalloutProps) {
  return (
    <div
      className={cn(
        "rounded-md border border-rose-200 bg-rose-50 px-4 py-3 text-rose-950",
        className,
      )}
      role="alert"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-semibold">{title}</p>
          <p className="mt-1 text-sm leading-6 text-rose-800">{message}</p>
        </div>
        {action}
      </div>
    </div>
  );
}
