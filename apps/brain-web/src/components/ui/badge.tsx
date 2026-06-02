import type { HTMLAttributes } from "react";

import { cn } from "../../lib/class-names";

export type BadgeVariant = "neutral" | "success" | "warning" | "danger" | "info" | "private";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  readonly variant?: BadgeVariant;
}

const variantClasses: Record<BadgeVariant, string> = {
  neutral: "border-neutral-800 bg-brand-black-soft text-neutral-300",
  success: "border-emerald-950 bg-emerald-950/30 text-emerald-400",
  warning: "border-amber-950 bg-amber-950/30 text-amber-400",
  danger: "border-rose-950 bg-rose-950/30 text-rose-400",
  info: "border-sky-950 bg-sky-950/30 text-sky-400",
  private: "border-brand-orange/30 bg-brand-orange/10 text-brand-orange",
};

export function Badge({ children, className, variant = "neutral", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex h-6 items-center rounded-md border px-2 text-xs font-medium leading-none",
        variantClasses[variant],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
