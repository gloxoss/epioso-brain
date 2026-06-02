import type { ButtonHTMLAttributes, ReactNode } from "react";

import { cn } from "../../lib/class-names";

export type ButtonVariant = "primary" | "secondary" | "subtle" | "danger";
export type ButtonSize = "sm" | "md" | "icon";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  readonly variant?: ButtonVariant;
  readonly size?: ButtonSize;
  readonly isLoading?: boolean;
  readonly loadingLabel?: string;
  readonly leadingIcon?: ReactNode;
  readonly trailingIcon?: ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "border-brand-orange bg-brand-orange text-black hover:bg-brand-orange-hover hover:border-brand-orange-hover focus-visible:outline-brand-orange",
  secondary:
    "border-neutral-800 bg-brand-black-soft text-white hover:border-neutral-700 hover:bg-brand-graphite focus-visible:outline-neutral-700",
  subtle:
    "border-transparent bg-transparent text-neutral-400 hover:bg-brand-black-soft hover:text-white focus-visible:outline-neutral-700",
  danger: "border-rose-700 bg-rose-700 text-white hover:bg-rose-800 focus-visible:outline-rose-700",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-xs",
  md: "h-9 px-3.5 text-sm",
  icon: "h-9 w-9 px-0 text-sm",
};

export function Button({
  children,
  className,
  disabled,
  isLoading = false,
  leadingIcon,
  loadingLabel = "Working",
  size = "md",
  trailingIcon,
  type = "button",
  variant = "primary",
  ...props
}: ButtonProps) {
  const isDisabled = disabled || isLoading;

  return (
    <button
      className={cn(
        "inline-flex shrink-0 items-center justify-center gap-2 rounded-md border font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-55",
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      disabled={isDisabled}
      type={type}
      aria-busy={isLoading || undefined}
      {...props}
    >
      {isLoading ? (
        <span
          aria-hidden="true"
          className="size-3 rounded-full border border-current border-r-transparent motion-safe:animate-spin"
        />
      ) : (
        leadingIcon
      )}
      <span>{isLoading ? loadingLabel : children}</span>
      {isLoading ? null : trailingIcon}
    </button>
  );
}
