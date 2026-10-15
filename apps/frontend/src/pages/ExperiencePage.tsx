import { BriefcaseBusiness, Code2, MapPin } from "lucide-react";
import { Badge } from "../components/ui/Badge";
import { Card } from "../components/ui/Card";
import { SectionHeader } from "../components/ui/SectionHeader";

const focuses = ["Full-stack application delivery", "RESTful API design", "Secure authentication workflows", "Data modelling across MongoDB and PostgreSQL", "Python-based AI services and RAG", "Cloud delivery and CI/CD practices"];

export function ExperiencePage() {
  return <div className="space-y-6"><SectionHeader label="Experience" title="Professional engineering, applied across the stack." description="A recruiter-focused view of verified software engineering experience." />
    <Card variant="project" accent="cyan" className="p-6 md:p-8"><div className="flex flex-col justify-between gap-6 md:flex-row"><div><div className="flex flex-wrap items-center gap-2"><Badge variant="featured">Full Stack Developer</Badge><Badge variant="tag">Feb 2025 – Jul 2026</Badge></div><h2 className="mt-5 font-display text-3xl font-bold text-text-primary">SAHL Business Solutions</h2><p className="mt-3 flex items-center gap-2 text-sm text-text-secondary"><MapPin className="h-4 w-4 text-ai" /> Hyderabad, India</p></div><div className="grid h-12 w-12 place-items-center rounded-lg border border-ai/40 bg-[var(--ai-ghost)]"><BriefcaseBusiness className="h-6 w-6 text-ai" /></div></div>
      <p className="mt-7 max-w-3xl text-base leading-7 text-text-secondary">Contributed to full-stack web applications with an emphasis on dependable APIs, secure user workflows, maintainable frontend systems, data-backed features, and Python-based intelligent services.</p>
      <div className="mt-7 grid gap-3 sm:grid-cols-2">{focuses.map((focus) => <div key={focus} className="flex items-center gap-3 rounded-md border border-border-mid bg-elevated p-4 text-sm text-text-secondary"><Code2 className="h-4 w-4 shrink-0 text-ai" />{focus}</div>)}</div>
      <div className="mt-7 flex flex-wrap gap-2">{["JavaScript", "TypeScript", "React", "Node.js", "FastAPI", "MongoDB", "PostgreSQL", "AWS", "GitHub"].map((item) => <Badge key={item} variant="tech">{item}</Badge>)}</div>
    </Card></div>;
}
