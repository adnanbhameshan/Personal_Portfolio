import { Mail } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { SectionHeader } from "../components/ui/SectionHeader";

export function ContactPage() {
  return (
    <div className="space-y-6">
      <SectionHeader
        label="Contact Center"
        title="A direct path for high-signal conversations."
        description="The production contact workflow will connect this surface to the FastAPI contact route."
      />
      <Card className="grid gap-4 p-5">
        <label className="grid gap-2 text-sm text-text-secondary">
          Name
          <input className="h-11 rounded-md border border-border-mid bg-elevated px-3 text-text-primary" />
        </label>
        <label className="grid gap-2 text-sm text-text-secondary">
          Email
          <input className="h-11 rounded-md border border-border-mid bg-elevated px-3 text-text-primary" type="email" />
        </label>
        <label className="grid gap-2 text-sm text-text-secondary">
          Message
          <textarea className="min-h-32 rounded-md border border-border-mid bg-elevated px-3 py-3 text-text-primary" />
        </label>
        <Button className="w-full sm:w-fit">
          <Mail aria-hidden="true" className="h-4 w-4" />
          Send Message
        </Button>
      </Card>
    </div>
  );
}

