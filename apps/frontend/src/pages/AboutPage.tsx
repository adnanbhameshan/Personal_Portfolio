import { Cloud, Code2, Database, ShieldCheck } from "lucide-react";
import { Card } from "../components/ui/Card";
import { SectionHeader } from "../components/ui/SectionHeader";

const highlights = [
  {
    icon: Code2,
    title: "Full-Stack Engineering",
    body: "Built production-quality web applications end-to-end using Node.js, Express.js, React, FastAPI, and PostgreSQL — from database schema design to REST API implementation to authenticated frontend views.",
  },
  {
    icon: ShieldCheck,
    title: "Authentication & Security",
    body: "Implemented secure authentication systems in multiple projects: JWT with bcryptjs in Trackr, and Passport.js local strategy with CSRF protection, bcrypt hashing, and route-level role-based access control in VJIT Sports Scheduler.",
  },
  {
    icon: Database,
    title: "Database Design",
    body: "Designed relational schemas in PostgreSQL (with Sequelize ORM) and document-based schemas in MongoDB (with Mongoose). Applied structured data modelling for Users, Sessions, and Reports in a multi-role system.",
  },
  {
    icon: Cloud,
    title: "AWS Certified — SAA-C03",
    body: "AWS Certified Solutions Architect – Associate, with a verified foundation in cloud architecture, security, availability, and resilient system design.",
  },
];

export function AboutPage() {
  return (
    <div className="space-y-6">
      <SectionHeader
        label="About"
        title="Practical engineering. Full-stack delivery."
        description="Full Stack Developer based in Dubai, UAE."
      />

      <Card className="p-5">
        <p className="leading-7 text-text-secondary">
          Adnan Ahmed Bhameshan is a full-stack engineer with hands-on experience across backend APIs,
          relational databases, authentication systems, and applied AI workflows. He built three
          documented portfolio projects from scratch — each one demonstrating a distinct engineering
          discipline: AI/NLP service separation in Trackr, blockchain trust boundary design in DigiVote,
          and role-based access control with PostgreSQL in VJIT Sports Scheduler.
        </p>
        <p className="mt-4 leading-7 text-text-secondary">
          He is an AWS Certified Solutions Architect – Associate and brings a cloud-aware engineering
          perspective to software delivery, API design, authentication, data systems, and applied AI workflows.
        </p>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2">
        {highlights.map((item) => (
          <Card key={item.title} className="flex gap-4 p-5">
            <item.icon aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-ai" />
            <div>
              <h3 className="font-display text-base font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-text-secondary">{item.body}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
