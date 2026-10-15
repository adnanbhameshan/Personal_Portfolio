import { Download, ExternalLink } from "lucide-react";
import { buttonClasses } from "../components/ui/buttonStyles";
import { Card } from "../components/ui/Card";
import { SectionHeader } from "../components/ui/SectionHeader";

const resumeOptions = [
  {
    label: "Full-Stack Developer Resume",
    href: "/resumes/adnan-ahmed-full-stack-developer-resume.pdf",
    description: "Targets React, TypeScript, Node.js, Express.js, FastAPI, AI/RAG, APIs, databases, and full-stack product delivery.",
  },
  {
    label: "Cloud Support Engineer Resume",
    href: "/resumes/adnan-ahmed-cloud-support-engineer-resume.pdf",
    description: "Targets AWS, cloud infrastructure, Linux, networking, troubleshooting, monitoring, Terraform, Docker, and CI/CD support.",
  },
  {
    label: "IT Operations Resume",
    href: "/resumes/adnan-ahmed-it-operations-resume.pdf",
    description: "Targets IT operations, application and service support, incident triage, monitoring, AWS, Linux, and cloud infrastructure.",
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
          <p className="mt-1 text-sm text-text-secondary">Three focused resume versions for different role families.</p>
        </div>
      </Card>

      <div className="grid gap-4 lg:grid-cols-3">
        {resumeOptions.map((resume) => (
          <Card key={resume.href} className="flex flex-col gap-4 p-5">
            <div className="flex-1">
              <h3 className="font-display text-lg font-bold text-text-primary">{resume.label}</h3>
              <p className="mt-2 text-sm leading-6 text-text-secondary">{resume.description}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <a
                className={buttonClasses({ variant: "outline", size: "sm" })}
                href={resume.href}
                target="_blank"
                rel="noreferrer"
              >
                <ExternalLink aria-hidden="true" className="h-4 w-4" />
                View
              </a>
              <a
                className={buttonClasses({ variant: "ai", size: "sm" })}
                href={resume.href}
                download
              >
                <Download aria-hidden="true" className="h-4 w-4" />
                Download
              </a>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
