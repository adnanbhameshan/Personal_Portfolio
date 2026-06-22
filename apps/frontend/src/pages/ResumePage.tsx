import { Download, Mail } from "lucide-react";
import { ButtonLink } from "../components/ui/ButtonLink";
import { buttonClasses } from "../components/ui/buttonStyles";
import { Card } from "../components/ui/Card";
import { SectionHeader } from "../components/ui/SectionHeader";

// Set VITE_RESUME_URL once a resume PDF is attached. Until then the page
// shows an honest "available upon request" state instead of a dead link.
const resumeUrl = import.meta.env.VITE_RESUME_URL as string | undefined;

export function ResumePage() {
  return (
    <div className="space-y-6">
      <SectionHeader
        label="Resume Center"
        title="Recruiter-ready resume access."
        description="A downloadable PDF will appear here once attached. Until then, request it directly."
      />
      <Card className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-xl font-bold">Adnan Ahmed Bhameshan</h2>
          <p className="mt-1 text-sm text-text-secondary">Full Stack and AI Engineer</p>
        </div>
        {resumeUrl ? (
          <a
            className={buttonClasses({ variant: "outline" })}
            href={resumeUrl}
            target="_blank"
            rel="noreferrer"
            download
          >
            <Download aria-hidden="true" className="h-4 w-4" />
            Resume PDF
          </a>
        ) : (
          <div className="flex flex-col items-start gap-2 sm:items-end">
            <span className="rounded-md border border-border-mid bg-elevated px-3 py-2 text-sm text-text-secondary">
              Resume available upon request
            </span>
            <ButtonLink variant="ai" size="sm" to="/contact">
              <Mail aria-hidden="true" className="h-4 w-4" />
              Request resume
            </ButtonLink>
          </div>
        )}
      </Card>
    </div>
  );
}
