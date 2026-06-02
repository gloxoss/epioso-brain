import type { ReactNode } from "react";

import { cn } from "../../lib/class-names";

export interface PageHeaderProps {
  readonly title: string;
  readonly description: string;
  readonly eyebrow?: string;
  readonly actions?: ReactNode;
  readonly className?: string;
}

export function PageHeader({ actions, className, description, eyebrow, title }: PageHeaderProps) {
  return (
    <header
      className={cn(
        "flex flex-col gap-3 border-b border-neutral-200 pb-4 md:flex-row md:items-end md:justify-between",
        className,
      )}
    >
      <div className="min-w-0">
        {eyebrow ? (
          <p className="mb-1 text-xs font-semibold uppercase text-emerald-700">{eyebrow}</p>
        ) : null}
        <h1 className="text-2xl font-semibold tracking-normal text-neutral-950">{title}</h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-neutral-600">{description}</p>
      </div>
      {actions ? <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div> : null}
    </header>
  );
}
