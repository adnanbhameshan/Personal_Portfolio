import { Code2 } from "lucide-react";
import { skillGroups } from "../data/profile";
import { Badge } from "../components/ui/Badge";
import { Card } from "../components/ui/Card";
import { SectionHeader } from "../components/ui/SectionHeader";

export function SkillsPage() {
  return <div className="space-y-6">
    <SectionHeader label="Skills" title="Practical tools, grounded in shipped work." description="A concise view of technologies and engineering practices represented across professional experience and documented projects." />
    <div className="grid gap-4 lg:grid-cols-2">
      {skillGroups.map((group) => <Card key={group.title} className="p-5"><div className="flex items-start gap-3"><Code2 className="mt-0.5 h-5 w-5 text-ai" /><div><h2 className="font-display text-xl font-bold text-text-primary">{group.title}</h2><p className="mt-2 text-sm leading-6 text-text-secondary">{group.description}</p></div></div><div className="mt-5 flex flex-wrap gap-2">{group.skills.map((skill) => <Badge key={skill} variant="tech">{skill}</Badge>)}</div></Card>)}
    </div>
  </div>;
}
