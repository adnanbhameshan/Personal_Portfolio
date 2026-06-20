import type { ReactNode } from "react";

interface ProjectSectionProps {
  eyebrow: string;
  title: string;
  children: ReactNode;
}

export function ProjectSection({ eyebrow, title, children }: ProjectSectionProps) {
  return (
    <section className="space-y-4">
      <div>
        <p className="font-mono text-xs uppercase text-ai">{eyebrow}</p>
        <h2 className="mt-2 font-display text-2xl font-bold text-text-primary">{title}</h2>
      </div>
      {children}
    </section>
  );
}

