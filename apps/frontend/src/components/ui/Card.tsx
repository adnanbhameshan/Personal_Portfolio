import type { HTMLAttributes } from "react";
import { cn } from "../../lib/cn";
import type { ProjectAccent } from "../../types/project";

type CardVariant = "default" | "elevated" | "glass" | "project";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  accent?: ProjectAccent;
  interactive?: boolean;
  featured?: boolean;
}

const accentStyles: Record<ProjectAccent, string> = {
  blue: "before:bg-primary",
  cyan: "before:bg-ai",
  rose: "before:bg-rose",
  green: "before:bg-success",
};

export function Card({ className, variant = "default", accent = "blue", interactive = false, featured = false, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "relative rounded-lg border transition duration-300 ease-nexus-out",
        variant === "default" && "border-border-mid bg-surface shadow-card",
        variant === "elevated" && "border-border-mid bg-elevated shadow-elevated",
        variant === "glass" && "border-[var(--glass-border)] bg-[var(--glass-fill)] shadow-elevated backdrop-blur-xl",
        variant === "project" &&
          "overflow-hidden border-border-mid bg-surface shadow-card before:absolute before:inset-x-0 before:top-0 before:h-[3px]",
        variant === "project" && accentStyles[accent],
        featured && "border-ai/50 shadow-[0_0_0_1px_rgba(6,182,212,0.1),var(--shadow-card)]",
        interactive &&
          "hover:-translate-y-1 hover:border-primary/70 hover:bg-[linear-gradient(180deg,rgba(22,24,32,0.96),rgba(15,17,23,0.98))] hover:shadow-elevated focus-within:border-ai/70 motion-reduce:transform-none",
        className,
      )}
      {...props}
    />
  );
}
