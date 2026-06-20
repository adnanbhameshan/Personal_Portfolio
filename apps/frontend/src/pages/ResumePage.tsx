import { Download } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { SectionHeader } from "../components/ui/SectionHeader";

export function ResumePage() {
  return (
    <div className="space-y-6">
      <SectionHeader
        label="Resume Center"
        title="Recruiter-ready resume access."
        description="Phase 1 establishes the route and page structure for standard and ATS-focused resume delivery."
      />
      <Card className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-xl font-bold">Adnan Ahmed Bhameshan</h2>
          <p className="mt-1 text-sm text-text-secondary">Full Stack and AI Engineer</p>
        </div>
        <Button variant="outline">
          <Download aria-hidden="true" className="h-4 w-4" />
          Resume PDF
        </Button>
      </Card>
    </div>
  );
}

