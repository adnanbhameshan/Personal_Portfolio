import { MapPin } from "lucide-react";
import { cn } from "../../lib/cn";

interface StatusPillProps {
  label: string;
  location?: string;
  className?: string;
}

export function StatusPill({ label, location, className }: StatusPillProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-online/30 bg-[var(--status-ghost)] px-3 py-1.5 text-sm text-success",
        className,
      )}
    >
      <span className="h-2 w-2 rounded-full bg-online animate-status-pulse" />
      <span className="font-medium">{label}</span>
      {location ? (
        <>
          <span className="text-text-tertiary">/</span>
          <MapPin aria-hidden="true" className="h-3.5 w-3.5 text-text-tertiary" />
          <span className="text-text-secondary">{location}</span>
        </>
      ) : null}
    </div>
  );
}

