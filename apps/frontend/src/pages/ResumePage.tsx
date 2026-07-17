import { Download, Mail } from "lucide-react";
import { ButtonLink } from "../components/ui/ButtonLink";
import { buttonClasses } from "../components/ui/buttonStyles";
import { Card } from "../components/ui/Card";
import { SectionHeader } from "../components/ui/SectionHeader";

const resumeUrl = import.meta.env.VITE_RESUME_URL as string | undefined;

const resumeOptions = [
  {
    label: "Software Engineering Resume",
    href: "/resumes/adnan-bhameshan-software-engineering-resume.pdf",
    description: "General software engineering resume for full-stack roles.",
  },
  {
    label: "AI Software Engineering Resume",
    href: "/resumes/adnan-bhameshan-ai-software-engineering-resume.pdf",
    description: "AI-focused software engineering resume for AI and product engineering roles.",
  },
] as const;

export function ResumePage() {
  return (
    <div className="space-y-6">
      <SectionHeader
        label="Resume Center"
        title="Recruiter-ready resume access."
        description="Choose the resume version that best matches the role context."
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
          <ButtonLink variant="ai" size="sm" to="/contact">
            <Mail aria-hidden="true" className="h-4 w-4" />
            Contact
          </ButtonLink>
        )}
      </Card>

      {!resumeUrl ? (
        <div className="grid gap-4 md:grid-cols-2">
          {resumeOptions.map((resume) => (
            <Card key={resume.href} className="flex flex-col gap-4 p-5">
              <div>
                <h3 className="font-display text-lg font-bold text-text-primary">{resume.label}</h3>
                <p className="mt-2 text-sm leading-6 text-text-secondary">{resume.description}</p>
              </div>
              <a
                className={buttonClasses({ variant: "outline" })}
                href={resume.href}
                target="_blank"
                rel="noreferrer"
                download
              >
                <Download aria-hidden="true" className="h-4 w-4" />
                Download PDF
              </a>
            </Card>
          ))}
        </div>
      ) : null}
    </div>
  );
}
