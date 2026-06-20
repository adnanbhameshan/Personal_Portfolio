import { ArrowDown } from "lucide-react";
import type { ArchitectureNode, ProjectAccent } from "../../types/project";
import { Card } from "../ui/Card";

interface ArchitectureDiagramProps {
  title: string;
  nodes: ArchitectureNode[];
  accent: ProjectAccent;
}

const accentText: Record<ProjectAccent, string> = {
  blue: "text-primary-glow",
  cyan: "text-ai",
  rose: "text-rose",
  green: "text-success",
};

export function ArchitectureDiagram({ title, nodes, accent }: ArchitectureDiagramProps) {
  return (
    <Card className="p-5">
      <p className="font-mono text-xs uppercase text-ai">{title}</p>
      <div className="mt-5 grid gap-3">
        {nodes.map((node, index) => (
          <div key={node.title}>
            <div className="rounded-lg border border-border-mid bg-elevated/70 p-4">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                <h3 className="font-display text-lg font-bold text-text-primary">{node.title}</h3>
                <p className={`font-mono text-xs uppercase ${accentText[accent]}`}>{node.subtitle}</p>
              </div>
              <p className="mt-2 text-sm leading-6 text-text-secondary">{node.description}</p>
            </div>
            {index < nodes.length - 1 ? (
              <div className="grid h-8 place-items-center text-text-tertiary">
                <ArrowDown aria-hidden="true" className="h-4 w-4" />
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </Card>
  );
}

