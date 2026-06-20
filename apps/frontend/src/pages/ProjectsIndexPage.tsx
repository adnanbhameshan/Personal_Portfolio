import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Search } from "lucide-react";
import { Badge } from "../components/ui/Badge";
import { Card } from "../components/ui/Card";
import { SectionHeader } from "../components/ui/SectionHeader";
import { projects } from "../data/projects";
import { cardEntrance, listStaggerFast, softReveal } from "../lib/animations";

const filters = ["All", "AI/ML", "Blockchain", "Full Stack", "React", "Node.js", "FastAPI"];

export function ProjectsIndexPage() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProjects = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return projects.filter((project) => {
      const matchesFilter =
        activeFilter === "All" ||
        project.category === activeFilter ||
        project.tech.some((tech) => tech.toLowerCase() === activeFilter.toLowerCase());

      const matchesSearch =
        normalizedQuery.length === 0 ||
        [project.name, project.summary, project.category, project.impact, ...project.tech]
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery);

      return matchesFilter && matchesSearch;
    });
  }, [activeFilter, searchQuery]);

  return (
    <motion.div className="space-y-8" variants={listStaggerFast} initial="initial" animate="animate">
      <motion.div variants={softReveal}>
        <SectionHeader
          label="Project Intelligence Center"
          title="Real code, architecture, and engineering decisions."
          description="A recruiter-facing review surface for evaluating product thinking, stack choices, and implementation depth."
        />
      </motion.div>

      <motion.div className="grid gap-4 lg:grid-cols-[1fr_320px]" variants={softReveal}>
        <div className="flex flex-wrap gap-2">
          {filters.map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => setActiveFilter(filter)}
              className={`rounded-md border px-3 py-2 text-sm transition ${
                activeFilter === filter
                  ? "border-ai/60 bg-[var(--ai-ghost)] text-ai"
                  : "border-border-mid bg-surface text-text-secondary hover:border-primary/60 hover:text-text-primary"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
        <label className="relative block">
          <span className="sr-only">Search projects</span>
          <Search aria-hidden="true" className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-tertiary" />
          <input
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search projects, stack, category..."
            className="h-11 w-full rounded-md border border-border-mid bg-surface pl-10 pr-3 text-sm text-text-primary placeholder:text-text-tertiary transition focus:border-ai"
          />
        </label>
      </motion.div>

      <motion.div className="grid gap-4" variants={listStaggerFast}>
        {filteredProjects.map((project, index) => (
          <motion.div key={project.slug} variants={cardEntrance}>
            <Card variant="project" accent={project.accent} className="p-5" interactive featured={project.slug === "trackr"}>
              <div className="grid gap-5 lg:grid-cols-[72px_1fr_180px] lg:items-center">
                <div>
                  <p className="font-mono text-xs uppercase text-text-tertiary">Priority</p>
                  <p className="mt-1 font-mono text-3xl font-bold text-text-primary">0{index + 1}</p>
                </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="font-display text-2xl font-bold">{project.name}</h2>
                  <Badge variant={project.status === "featured" ? "featured" : "tag"}>{project.status}</Badge>
                  <Badge variant="tag">{project.category}</Badge>
                </div>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-text-secondary">{project.summary}</p>
                <p className="mt-3 max-w-3xl text-sm leading-6 text-text-primary">{project.impact}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {project.tech.slice(0, 7).map((tech) => (
                    <Badge key={tech} variant="tech">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>
              <Link
                to={project.href}
                className="inline-flex items-center justify-start gap-2 rounded-md border border-ai/40 bg-[var(--ai-ghost)] px-3 py-2 text-sm font-medium text-ai transition hover:border-ai hover:text-ai-glow lg:justify-center"
              >
                View Case Study
                <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </Link>
            </div>
          </Card>
          </motion.div>
        ))}

        {filteredProjects.length === 0 ? (
          <Card className="p-6">
            <p className="text-sm text-text-secondary">No projects match the current search and filter combination.</p>
          </Card>
        ) : null}
      </motion.div>
    </motion.div>
  );
}
