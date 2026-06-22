import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Bot } from "lucide-react";
import { projects } from "../data/projects";
import { Badge } from "../components/ui/Badge";
import { ButtonLink } from "../components/ui/ButtonLink";
import { Card } from "../components/ui/Card";
import { SectionHeader } from "../components/ui/SectionHeader";
import { StatCard } from "../components/ui/StatCard";
import { StatusPill } from "../components/ui/StatusPill";
import {
  cardEntrance,
  hoverLift,
  listStagger,
  listStaggerFast,
  pressTap,
  progressFill,
  softReveal,
} from "../lib/animations";

const stats = [
  {
    label: "Portfolio Projects",
    value: "3",
    description: "Full-stack, AI-integrated, and blockchain builds with complete engineering documentation.",
  },
  {
    label: "Technologies Used",
    value: "33+",
    description: "Verified across frontend, backend, database, AI/NLP, and blockchain layers.",
  },
  {
    label: "Currently Pursuing",
    value: "AWS SAA-C03",
    description: "Cloud architecture, IAM, compute, storage, and resilient system design.",
  },
];

// Skill tiers are based on verified project usage — no percentage estimates.
// "Built in projects" = used across 2+ documented projects.
// "Implemented" = used in at least one documented project with real code.
// "Actively studying" = in progress, not yet in a shipped project.
const skills = [
  { label: "Full-Stack Engineering (Node.js · Express · React · FastAPI)", tier: "Built across 3 projects", width: 88, tone: "bg-primary" },
  { label: "Auth & Security (Passport.js · JWT · bcrypt · CSRF)", tier: "Implemented in 2 projects", width: 76, tone: "bg-ai" },
  { label: "AI / NLP Integration (TF-IDF · Cosine Similarity · RAG)", tier: "Implemented in Trackr & NEXUS", width: 70, tone: "bg-success" },
  { label: "AWS Cloud Architecture (SAA-C03)", tier: "Actively studying", width: 38, tone: "bg-amber" },
];

export function DashboardPage() {
  return (
    <motion.div className="space-y-10" variants={listStagger} initial="initial" animate="animate">
      <motion.section className="grid gap-8 py-4 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-start lg:gap-10 lg:py-8" variants={softReveal}>
        <motion.div className="max-w-4xl" variants={softReveal}>
          <StatusPill label="Open to Relocation · Dubai, UAE" location="IT / Cloud / DevOps" />
          <div className="mt-8">
            <SectionHeader
              label="Developer Intelligence Activated"
              title="Adnan Ahmed Bhameshan — Full-Stack & Cloud-Focused Engineer."
              description="Targeting IT Support, Cloud Support, System Administration, and Junior DevOps roles in Dubai. AWS SAA-C03 in progress."
            />
          </div>
        </motion.div>
        <motion.div variants={cardEntrance} whileHover={hoverLift} whileTap={pressTap}>
          <Card className="p-4 lg:mt-3" interactive featured>
            <p className="font-mono text-[11px] uppercase text-ai">Featured Project</p>
            <h2 className="mt-2 font-display text-xl font-bold">Trackr</h2>
            <p className="mt-2 text-sm leading-6 text-text-secondary">
              Secure job tracking, pipeline analytics, and a separate FastAPI matching service.
            </p>
            <ButtonLink className="mt-4 w-full" variant="ai" size="sm" to="/projects/trackr">
              View Project
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </ButtonLink>
          </Card>
        </motion.div>
      </motion.section>

      <motion.section className="grid gap-4 md:grid-cols-3" variants={listStaggerFast}>
        {stats.map((stat) => (
          <motion.div key={stat.label} variants={cardEntrance} whileHover={hoverLift}>
            <StatCard {...stat} />
          </motion.div>
        ))}
      </motion.section>

      <motion.section className="space-y-4" variants={softReveal}>
        <motion.div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center" variants={softReveal}>
          <div>
            <p className="font-mono text-xs uppercase text-ai">Project Intelligence</p>
            <h2 className="mt-2 font-display text-2xl font-bold">Featured Work</h2>
          </div>
          <ButtonLink variant="outline" to="/projects">
            All Projects
            <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </ButtonLink>
        </motion.div>

        <motion.div className="grid gap-4 lg:grid-cols-3" variants={listStaggerFast}>
          {projects.map((project) => (
            <motion.div key={project.slug} variants={cardEntrance} whileHover={hoverLift} whileTap={pressTap}>
              <Card
                variant="project"
                accent={project.accent}
                className="h-full p-5"
                interactive
                featured={project.slug === "trackr"}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-mono text-xs uppercase text-text-tertiary">{project.eyebrow}</p>
                    <h3 className="mt-2 font-display text-xl font-bold">{project.name}</h3>
                  </div>
                  <Badge variant={project.status === "featured" ? "featured" : "tag"}>{project.status}</Badge>
                </div>
                <p className="mt-4 text-sm leading-6 text-text-secondary">{project.summary}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {project.tech.slice(0, 4).map((tech) => (
                    <Badge key={tech} variant="tech">
                      {tech}
                    </Badge>
                  ))}
                </div>
                <Link
                  to={project.href}
                  className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-ai transition hover:text-ai-glow focus-visible:text-ai-glow"
                >
                  Open intelligence brief
                  <ArrowRight aria-hidden="true" className="h-4 w-4" />
                </Link>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      <motion.section className="space-y-4" variants={softReveal}>
        <div>
          <p className="font-mono text-xs uppercase text-ai">Capability Signal</p>
          <h2 className="mt-2 font-display text-2xl font-bold">Skill Momentum</h2>
        </div>
        <Card className="grid gap-5 p-5" interactive>
          {skills.map((skill) => (
            <div key={skill.label}>
              <div className="flex items-start justify-between gap-4">
                <p className="text-sm font-medium text-text-primary">{skill.label}</p>
                <span className="shrink-0 font-mono text-xs text-text-tertiary">{skill.tier}</span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-elevated">
                <motion.div
                  className={`h-full origin-left rounded-full ${skill.tone}`}
                  style={{ width: `${skill.width}%` }}
                  variants={progressFill}
                />
              </div>
            </div>
          ))}
        </Card>
      </motion.section>

      <motion.section variants={cardEntrance}>
        <Card className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between" interactive>
          <div>
            <p className="font-mono text-xs uppercase text-ai">NEXUS AI</p>
            <h2 className="mt-2 font-display text-xl font-bold">AI Assistant — live</h2>
            <p className="mt-1 text-sm text-text-secondary">
              RAG-powered retrieval over the full project knowledge base. Ask anything about the portfolio, tech stack, or career goals.
            </p>
          </div>
          <ButtonLink variant="ai" to="/assistant">
            <Bot aria-hidden="true" className="h-4 w-4" />
            Open Assistant
          </ButtonLink>
        </Card>
      </motion.section>
    </motion.div>
  );
}
