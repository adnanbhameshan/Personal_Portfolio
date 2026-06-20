import { cn } from "../../lib/cn";

export type ButtonVariant = "primary" | "ghost" | "outline" | "ai";
export type ButtonSize = "sm" | "md" | "lg" | "icon";

const variantStyles: Record<ButtonVariant, string> = {
  primary: "bg-primary text-white shadow-[0_0_0_1px_rgba(255,255,255,0.06)] hover:bg-primary-dim hover:shadow-glow-blue",
  ghost: "text-text-secondary hover:bg-[var(--accent-ghost)] hover:text-text-primary",
  outline: "border border-border-mid text-text-secondary hover:border-primary hover:bg-[var(--accent-ghost)] hover:text-text-primary",
  ai: "border border-ai/60 bg-[var(--ai-ghost)] text-ai hover:border-ai hover:bg-[rgba(6,182,212,0.12)] hover:shadow-glow-cyan",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-xs",
  md: "h-10 px-4 text-sm",
  lg: "h-11 px-5 text-sm",
  icon: "h-10 w-10 p-0",
};

export function buttonClasses({
  variant = "primary",
  size = "md",
  className,
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
}) {
  return cn(
    "inline-flex items-center justify-center gap-2 rounded-md font-medium transition duration-200 ease-nexus-out hover:-translate-y-0.5 active:translate-y-0 disabled:pointer-events-none disabled:opacity-50 motion-reduce:transform-none",
    variantStyles[variant],
    sizeStyles[size],
    className,
  );
}

