interface SectionHeaderProps {
  label: string;
  title: string;
  description?: string;
}

export function SectionHeader({ label, title, description }: SectionHeaderProps) {
  return (
    <div className="max-w-3xl">
      <p className="font-mono text-xs uppercase text-ai">{label}</p>
      <h1 className="mt-3 font-display text-3xl font-bold leading-tight text-text-primary md:text-4xl">{title}</h1>
      {description ? <p className="mt-3 text-base leading-7 text-text-secondary">{description}</p> : null}
    </div>
  );
}

