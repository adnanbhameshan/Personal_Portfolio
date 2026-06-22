import { Navigate, useParams } from "react-router-dom";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import { ArchitectureDiagram } from "../components/projects/ArchitectureDiagram";
import { ProjectSection } from "../components/projects/ProjectSection";
import { Badge } from "../components/ui/Badge";
import { ButtonLink } from "../components/ui/ButtonLink";
import { Card } from "../components/ui/Card";
import { projects } from "../data/projects";
import { cardEntrance, listStaggerFast, softReveal } from "../lib/animations";

export function ProjectDetailPage() {
  const { slug } = useParams();
  const project = projects.find((item) => item.slug === slug);

  if (!project) {
    return <Navigate to="/projects" replace />;
  }

  return (
    <motion.div className="space-y-8" variants={listStaggerFast} initial="initial" animate="animate">
      <ButtonLink variant="ghost" size="sm" to="/projects">
        <ArrowLeft aria-hidden="true" className="h-4 w-4" />
        Projects
      </ButtonLink>

      <motion.section variants={softReveal}>
        <Card variant="project" accent={project.accent} className="p-6 md:p-8" featured={project.slug === "trackr"}>
          <div className="grid gap-8 lg:grid-cols-[1fr_280px]">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant={project.status === "featured" ? "featured" : "tag"}>{project.status}</Badge>
                <Badge variant="tag">{project.category}</Badge>
              </div>
              <p className="mt-6 font-mono text-xs uppercase text-ai">{project.eyebrow}</p>
              <h1 className="mt-3 font-display text-4xl font-bold leading-tight text-text-primary md:text-5xl">
                {project.name}
              </h1>
              <p className="mt-5 max-w-3xl text-lg leading-8 text-text-secondary">{project.details.shortDescription}</p>
              <div className="mt-6 flex flex-wrap gap-2">
                {project.tech.map((tech) => (
                  <Badge key={tech} variant="tech">
                    {tech}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              {project.githubUrl ? (
                <a
                  className="flex items-center justify-between rounded-md border border-border-mid bg-elevated px-3 py-3 text-sm text-text-primary transition hover:border-ai"
                  href={project.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  GitHub Repository
                  <ExternalLink aria-hidden="true" className="h-4 w-4 text-ai" />
                </a>
              ) : (
                <div className="rounded-md border border-border-mid bg-elevated px-3 py-3 text-sm text-text-secondary">
                  TODO_VERIFY: GitHub repository URL.
                </div>
              )}
              {project.liveUrl ? (
                <a
                  className="flex items-center justify-between rounded-md border border-ai/40 bg-[var(--ai-ghost)] px-3 py-3 text-sm text-ai transition hover:border-ai"
                  href={project.liveUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  Live Demo
                  <ExternalLink aria-hidden="true" className="h-4 w-4" />
                </a>
              ) : project.liveStatus ? (
                <div className="rounded-md border border-border-mid bg-elevated px-3 py-3 text-sm leading-6 text-text-secondary">
                  {project.liveStatus}
                </div>
              ) : (
                <div className="rounded-md border border-border-mid bg-elevated px-3 py-3 text-sm text-text-secondary">
                  TODO_VERIFY: Live demo URL.
                </div>
              )}
            </div>
          </div>
        </Card>
      </motion.section>

      <motion.div className="grid gap-5 lg:grid-cols-2" variants={listStaggerFast}>
        <motion.div variants={cardEntrance}>
          <ProjectSection eyebrow="Problem" title="Why this project exists">
            <Card className="space-y-3 p-5">
              {project.details.problem.map((item) => (
                <p key={item} className="text-sm leading-7 text-text-secondary">
                  {item}
                </p>
              ))}
            </Card>
          </ProjectSection>
        </motion.div>
        <motion.div variants={cardEntrance}>
          <ProjectSection eyebrow="Solution" title="What the system does">
            <Card className="space-y-3 p-5">
              {project.details.solution.map((item) => (
                <p key={item} className="text-sm leading-7 text-text-secondary">
                  {item}
                </p>
              ))}
            </Card>
          </ProjectSection>
        </motion.div>
      </motion.div>

      <motion.section variants={cardEntrance}>
        <ArchitectureDiagram title={`${project.name} Architecture`} nodes={project.details.architecture} accent={project.accent} />
      </motion.section>

      {project.details.secondaryArchitecture ? (
        <motion.section variants={cardEntrance}>
          <ArchitectureDiagram
            title={project.details.secondaryArchitecture.title}
            nodes={project.details.secondaryArchitecture.nodes}
            accent={project.accent}
          />
        </motion.section>
      ) : null}

      {project.details.systemDetails ? (
        <motion.section variants={cardEntrance}>
          <ProjectSection eyebrow="System Reference" title="Verified implementation details">
            <div className="grid gap-4 md:grid-cols-2">
              {project.details.systemDetails.map((detail) => (
                <Card key={detail.title} className="p-5">
                  <h3 className="font-display text-lg font-bold text-text-primary">{detail.title}</h3>
                  <ul className="mt-3 space-y-2">
                    {detail.items.map((item) => (
                      <li key={item} className="text-sm leading-6 text-text-secondary">
                        {item}
                      </li>
                    ))}
                  </ul>
                </Card>
              ))}
            </div>
          </ProjectSection>
        </motion.section>
      ) : null}

      {project.details.workflow ? (
        <motion.section variants={cardEntrance}>
          <ProjectSection eyebrow="Workflow" title={project.slug === "digivote" ? "Smart contract and authentication flow" : "Core product workflow"}>
            <Card className="p-5">
              <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                {project.details.workflow.map((step, index) => (
                  <div key={step} className="rounded-md border border-border-mid bg-elevated p-4">
                    <p className="font-mono text-xs text-text-tertiary">Step {index + 1}</p>
                    <p className="mt-2 text-sm font-medium text-text-primary">{step}</p>
                  </div>
                ))}
              </div>
            </Card>
          </ProjectSection>
        </motion.section>
      ) : null}

      <motion.div className="grid gap-5 lg:grid-cols-[1fr_1fr]" variants={listStaggerFast}>
        <motion.div variants={cardEntrance}>
          <ProjectSection eyebrow="Technical Decisions" title="Why these choices matter">
            <Card className="space-y-3 p-5">
              {project.details.technicalDecisions.map((item) => (
                <p key={item} className="text-sm leading-7 text-text-secondary">
                  {item}
                </p>
              ))}
            </Card>
          </ProjectSection>
        </motion.div>
        <motion.div variants={cardEntrance}>
          <ProjectSection eyebrow="Challenges" title="Engineering tradeoffs">
            <div className="space-y-3">
              {project.details.challenges.map((item) => (
                <Card key={item.challenge} className="p-5">
                  <p className="font-medium text-text-primary">{item.challenge}</p>
                  <p className="mt-2 text-sm leading-6 text-text-secondary">{item.solution}</p>
                </Card>
              ))}
            </div>
          </ProjectSection>
        </motion.div>
      </motion.div>

      {project.details.lessons ? (
        <motion.section variants={cardEntrance}>
          <ProjectSection eyebrow="Lessons Learned" title="What this project demonstrates">
            <Card className="grid gap-3 p-5 md:grid-cols-3">
              {project.details.lessons.map((lesson) => (
                <p key={lesson} className="text-sm leading-6 text-text-secondary">
                  {lesson}
                </p>
              ))}
            </Card>
          </ProjectSection>
        </motion.section>
      ) : null}

      <motion.section variants={cardEntrance}>
        <ProjectSection eyebrow="Screenshots" title="Gallery">
          <div className="grid gap-4 md:grid-cols-3">
            {project.details.gallery.map((item) => (
              <Card key={item.title} className="overflow-hidden">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.alt ?? item.title}
                    className="aspect-video w-full border-b border-border-subtle bg-white object-cover object-top"
                    loading="lazy"
                  />
                ) : (
                  <div className="aspect-video border-b border-dashed border-border-active bg-elevated/50" />
                )}
                <div className="p-4">
                  <p className="font-display text-lg font-bold text-text-primary">{item.title}</p>
                  <p className="mt-2 text-sm leading-6 text-text-secondary">{item.note}</p>
                </div>
              </Card>
            ))}
          </div>
        </ProjectSection>
      </motion.section>

      <motion.section variants={cardEntrance}>
        <ProjectSection eyebrow="Future Improvements" title="Where it can grow">
          <Card className="space-y-3 p-5">
            {project.details.futureImprovements.map((item) => (
              <p key={item} className="text-sm leading-7 text-text-secondary">
                {item}
              </p>
            ))}
            {project.todoVerify?.map((item) => (
              <p key={item} className="font-mono text-xs leading-6 text-amber">
                TODO_VERIFY: {item.replace(/^TODO_VERIFY:\s*/, "")}
              </p>
            ))}
          </Card>
        </ProjectSection>
      </motion.section>
    </motion.div>
  );
}
