import type { HTMLAttributes } from "react";
import { cn } from "../../lib/cn";

type BadgeVariant = "tech" | "tag" | "online" | "progress" | "featured";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const variantStyles: Record<BadgeVariant, string> = {
  tech: "border-primary/20 bg-[var(--accent-ghost)] text-primary-glow",
  tag: "border-border-mid bg-elevated text-text-secondary",
  online: "border-online/30 bg-[var(--status-ghost)] text-success",
  progress: "border-amber/30 bg-[var(--amber-ghost)] text-amber",
  featured: "border-ai/40 bg-[var(--ai-ghost)] text-ai",
};

export function Badge({ className, variant = "tag", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex h-6 items-center rounded-sm border px-2 font-mono text-[11px] font-medium uppercase tracking-normal",
        variantStyles[variant],
        className,
      )}
      {...props}
    />
  );
}

