export type ProjectAccent = "blue" | "cyan" | "rose" | "green";

export interface Project {
  slug: string;
  name: string;
  eyebrow: string;
  summary: string;
  status: "featured" | "complete" | "active";
  accent: ProjectAccent;
  tech: string[];
  impact: string;
  href: string;
  category: string;
  priority: number;
  githubUrl?: string;
  liveUrl?: string;
  liveStatus?: string;
  todoVerify?: string[];
  details: ProjectDetails;
}

export interface ArchitectureNode {
  title: string;
  subtitle: string;
  description: string;
}

export interface ProjectDetails {
  shortDescription: string;
  problem: string[];
  solution: string[];
  architecture: ArchitectureNode[];
  secondaryArchitecture?: {
    title: string;
    nodes: ArchitectureNode[];
  };
  systemDetails?: Array<{
    title: string;
    items: string[];
  }>;
  technicalDecisions: string[];
  challenges: Array<{
    challenge: string;
    solution: string;
  }>;
  gallery: Array<{
    title: string;
    note: string;
    image?: string;
    alt?: string;
  }>;
  futureImprovements: string[];
  lessons?: string[];
  workflow?: string[];
}
