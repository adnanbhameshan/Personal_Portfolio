import { ExternalLink, Github, Layers3 } from "lucide-react";
import { projects } from "../data/projects";
import { professionalProfile } from "../data/profile";
import { Badge } from "../components/ui/Badge";
import { ButtonLink } from "../components/ui/ButtonLink";
import { Card } from "../components/ui/Card";
import { SectionHeader } from "../components/ui/SectionHeader";

export function GitHubPage() {
  return <div className="space-y-6"><SectionHeader label="GitHub" title="Selected repositories, explained through engineering decisions." description="A curated project showcase—not an unreliable statistics dashboard." />
    <Card variant="glass" className="flex flex-col justify-between gap-4 p-5 sm:flex-row sm:items-center"><div className="flex items-center gap-3"><Github className="h-6 w-6 text-ai" /><div><p className="font-display font-bold text-text-primary">adnanbhameshan</p><p className="text-sm text-text-secondary">Explore the public profile and selected engineering work.</p></div></div><a className="inline-flex items-center justify-center gap-2 rounded-md border border-ai/50 bg-[var(--ai-ghost)] px-4 py-2 text-sm font-medium text-ai transition hover:border-ai" href={professionalProfile.githubUrl} target="_blank" rel="noreferrer">View GitHub Profile<ExternalLink className="h-4 w-4" /></a></Card>
    <div className="grid gap-4 lg:grid-cols-3">{projects.map((project) => <Card key={project.slug} variant="project" accent={project.accent} className="flex flex-col p-5"><div className="flex items-start justify-between gap-4"><Layers3 className="h-5 w-5 text-ai" /><Badge variant="tag">{project.category}</Badge></div><h2 className="mt-5 font-display text-2xl font-bold text-text-primary">{project.name}</h2><p className="mt-3 flex-1 text-sm leading-6 text-text-secondary">{project.summary}</p><div className="mt-5 flex flex-wrap gap-2">{project.tech.slice(0, 5).map((tech) => <Badge key={tech} variant="tech">{tech}</Badge>)}</div><div className="mt-6 flex flex-wrap gap-3"><ButtonLink to={project.href} size="sm" variant="outline">Project Details</ButtonLink>{project.githubUrl ? <a href={project.githubUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-sm font-medium text-ai hover:text-ai-glow">Repository<ExternalLink className="h-4 w-4" /></a> : null}</div></Card>)}</div>
  </div>;
}
