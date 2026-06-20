import { useEffect, useMemo, useState } from "react";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion";
import { Card } from "./Card";

interface StatCardProps {
  label: string;
  value: string;
  description: string;
}

export function StatCard({ label, value, description }: StatCardProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const numericValue = useMemo(() => {
    const match = value.match(/^(\d+)/);
    return match ? Number(match[1]) : null;
  }, [value]);
  const [displayValue, setDisplayValue] = useState(numericValue ? "0" : value);

  useEffect(() => {
    if (!numericValue || prefersReducedMotion) {
      setDisplayValue(value);
      return undefined;
    }

    const startedAt = performance.now();
    const duration = 700;
    let animationFrame = 0;

    const tick = (time: number) => {
      const progress = Math.min((time - startedAt) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const currentValue = Math.round(numericValue * eased);
      setDisplayValue(value.replace(/^(\d+)/, String(currentValue)));

      if (progress < 1) {
        animationFrame = window.requestAnimationFrame(tick);
      }
    };

    animationFrame = window.requestAnimationFrame(tick);

    return () => window.cancelAnimationFrame(animationFrame);
  }, [numericValue, prefersReducedMotion, value]);

  return (
    <Card className="p-5" interactive>
      <p className="font-mono text-xs uppercase text-text-tertiary">{label}</p>
      <strong className="mt-3 block min-h-9 font-display text-3xl font-bold text-text-primary">{displayValue}</strong>
      <p className="mt-2 text-sm leading-6 text-text-secondary">{description}</p>
    </Card>
  );
}
