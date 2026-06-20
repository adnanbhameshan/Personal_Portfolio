import { Card } from "../components/ui/Card";
import { SectionHeader } from "../components/ui/SectionHeader";

export function AboutPage() {
  return (
    <div className="space-y-6">
      <SectionHeader
        label="About"
        title="Engineer profile with product context."
        description="This page will expand into a concise story of Adnan's engineering path, values, and current cloud learning focus."
      />
      <Card className="p-5">
        <p className="leading-7 text-text-secondary">
          Adnan Ahmed Bhameshan is building toward full stack, AI, and cloud engineering roles with a focus on practical
          product execution and systems that are useful in the real world.
        </p>
      </Card>
    </div>
  );
}

