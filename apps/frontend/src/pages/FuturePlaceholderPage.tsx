import { Card } from "../components/ui/Card";
import { SectionHeader } from "../components/ui/SectionHeader";

interface FuturePlaceholderPageProps {
  title: string;
}

export function FuturePlaceholderPage({ title }: FuturePlaceholderPageProps) {
  return (
    <div className="space-y-6">
      <SectionHeader
        label="Future Module"
        title={title}
        description="This route is reserved for a later phase and intentionally excluded from the Phase 1 implementation."
      />
      <Card className="p-5">
        <p className="text-sm leading-6 text-text-secondary">Placeholder only. No V2 features are implemented yet.</p>
      </Card>
    </div>
  );
}

