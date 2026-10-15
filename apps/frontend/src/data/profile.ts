export type SkillGroup = {
  title: string;
  description: string;
  skills: string[];
};

export const professionalProfile = {
  name: "Adnan Ahmed Bhameshan",
  location: "Dubai, UAE",
  headline: "Full Stack Developer | React · TypeScript · Node.js · FastAPI · AWS Certified",
  githubUrl: "https://github.com/adnanbhameshan",
  portfolioUrl: "https://portfolio.adnanbhameshan.com",
};

export const skillGroups: SkillGroup[] = [
  {
    title: "Programming",
    description: "Languages used across portfolio projects and professional engineering work.",
    skills: ["JavaScript", "TypeScript", "Python", "Solidity"],
  },
  {
    title: "Frontend",
    description: "Component-driven interfaces, dashboards, routing, and responsive UI systems.",
    skills: ["React", "Vite", "Tailwind CSS", "React Router", "Recharts"],
  },
  {
    title: "Backend & APIs",
    description: "Application services, REST APIs, authentication, and maintainable service boundaries.",
    skills: ["Node.js", "Express.js", "FastAPI", "REST APIs", "JWT", "bcryptjs"],
  },
  {
    title: "Data",
    description: "Document and relational data modelling used in full-stack applications.",
    skills: ["MongoDB", "MongoDB Atlas", "PostgreSQL", "Mongoose", "Sequelize"],
  },
  {
    title: "Cloud & Delivery",
    description: "Cloud fundamentals, deployment platforms, version control, and delivery workflows.",
    skills: ["AWS Certified Solutions Architect – Associate", "EC2", "S3", "IAM", "RDS", "VPC", "Terraform", "Docker", "CloudWatch", "GitHub Actions", "Vercel", "Render", "Neon", "CI/CD"],
  },
  {
    title: "AI & Intelligent Systems",
    description: "Applied NLP, retrieval, LLM integration, and grounded assistant design.",
    skills: ["LLM APIs", "RAG", "Prompt Engineering", "NLP", "TF-IDF", "Cosine Similarity"],
  },
  {
    title: "Engineering Practice",
    description: "Cross-cutting practices demonstrated through portfolio and professional work.",
    skills: ["API Integration", "Authentication", "Responsive UI", "System Design", "Web Security Practices", "Clean Maintainable Code"],
  },
];

export type Certification = {
  title: string;
  issuer: string;
  category: "Certifications" | "Technical Credentials" | "Achievements" | "Additional";
  status: string;
  issued?: string;
  expires?: string;
  detail?: string;
  action?: { label: string; href: string };
  hero?: boolean;
};

export const certifications: Certification[] = [
  {
    title: "AWS Certified Solutions Architect – Associate",
    issuer: "Amazon Web Services",
    category: "Certifications",
    status: "Certified",
    issued: "July 25, 2026",
    expires: "July 25, 2029",
    detail: "SAA-C03 · Validation number: c6aa0324cde04484a41525db066ff4c7.",
    action: { label: "Verify Credential", href: "https://aws.amazon.com/verification" },
    hero: true,
  },
  {
    title: "Nutanix Certified Professional – Multicloud Infrastructure 6",
    issuer: "Nutanix",
    category: "Certifications",
    status: "Completed",
    issued: "December 27, 2025",
    action: { label: "View Certificate", href: "https://drive.google.com/file/d/1kOwxyNTIj_PijkwSgDRimN3Mh4AdRE_M/view?usp=drive_link" },
  },
  {
    title: "Google Advanced Data Analytics Capstone",
    issuer: "Google / Coursera",
    category: "Technical Credentials",
    status: "Completed",
    issued: "September 19, 2025",
    action: { label: "View Certificate", href: "https://drive.google.com/file/d/1c2FmFkm3L_rUjbaYdanQ90I_e0_zHifW/view?usp=drive_link" },
  },
  {
    title: "React Front-End Development",
    issuer: "HackerRank",
    category: "Technical Credentials",
    status: "Earned",
    issued: "September 7, 2024",
    detail: "Credential ID: F17CB7EEE532",
    action: { label: "View Certificate", href: "https://drive.google.com/file/d/1xauWE_KeCWYfS5u6v2j_MHlKk85km7V9/view?usp=drive_link" },
  },
  {
    title: "Cybersecurity Essentials",
    issuer: "Cisco Networking Academy",
    category: "Technical Credentials",
    status: "Completed",
    issued: "May 16, 2024",
    action: { label: "View Certificate", href: "https://drive.google.com/file/d/1-VfUGVFpAimkjOjH_8TgE5U04XECxYx_/view?usp=drive_link" },
  },
  {
    title: "PCAP: Programming Essentials in Python",
    issuer: "Cisco Networking Academy / OpenEDG Python Institute",
    category: "Technical Credentials",
    status: "Completed",
    issued: "July 8, 2023",
    action: { label: "View Certificate", href: "https://drive.google.com/file/d/1-V6-PTtgn0Q0gPS-ChBeDzX51E24gsLI/view?usp=drive_link" },
  },
  {
    title: "Programming Essentials in C++",
    issuer: "Cisco Networking Academy / C++ Institute",
    category: "Technical Credentials",
    status: "Course completed",
    issued: "May 28, 2023",
    detail: "Technical course completion; not a C++ Certified Associate Programmer certification.",
    action: { label: "View Certificate", href: "https://drive.google.com/file/d/1rkErBwjXUfQlpSOB1AyFiBzZ1WzcwApR/view?usp=drive_link" },
  },
  {
    title: "Technical Quiz – 2nd Prize",
    issuer: "Technocrat 2023",
    category: "Achievements",
    status: "Awarded",
    issued: "September 14, 2023",
    action: { label: "View Certificate", href: "https://drive.google.com/file/d/1-YYxgOxe2umHE_W_tfC9kJDJoJDwy29l/view?usp=drive_link" },
  },
  {
    title: "IELTS Academic",
    issuer: "IELTS",
    category: "Additional",
    status: "Completed",
    issued: "June 7, 2025",
    detail: "Overall Band 6.5 · CEFR B2",
    action: { label: "View Certificate", href: "https://drive.google.com/file/d/1WI4BXHSW3kQvF4CRNIz3Qz6K1_FdtbHz/view?usp=drive_link" },
  },
];

export const journeyChapters = [
  { number: "01", title: "Foundation", tag: "Learning foundations", body: "A Diploma in Electrical and Electronics Engineering built systems thinking and structured problem solving, followed by a B.Tech transition into Information Technology at VJIT.", skills: ["Engineering Fundamentals", "Programming Foundations", "Problem Solving"] },
  { number: "02", title: "Building", tag: "Projects in practice", body: "Project-based learning became the working method: build, test, debug, document, and improve practical software instead of treating theory as the endpoint.", skills: ["JavaScript", "Python", "Git"] },
  { number: "03", title: "Engineering", tag: "Full-stack systems", body: "Trackr, DigiVote, and VJIT Sports Scheduler developed experience with full-stack workflows, APIs, data modelling, authentication, authorization, and system trade-offs.", skills: ["React", "Node.js", "PostgreSQL", "MongoDB", "JWT"] },
  { number: "04", title: "Intelligent Systems", tag: "Applied AI", body: "Trackr uses a dedicated Python service for pure-Python TF-IDF and cosine-similarity matching. NEXUS adds Gemini 2.5 Flash, grounded RAG, semantic retrieval, and LLM-assisted portfolio exploration.", skills: ["FastAPI", "TF-IDF", "Cosine Similarity", "RAG"] },
  { number: "05", title: "Cloud", tag: "Certified foundation", body: "AWS learning progressed into AWS Certified Solutions Architect – Associate and an AWS/Terraform infrastructure project covering VPC, EC2, RDS PostgreSQL, S3, IAM, CloudWatch, Docker, and CI/CD.", skills: ["AWS Certified", "Terraform", "CloudWatch"] },
  { number: "06", title: "Professional Engineering", tag: "SAHL Business Solutions", body: "Full Stack Developer experience at SAHL Business Solutions brought application delivery, API design, databases, authentication, AI services, and CI/CD into professional practice.", skills: ["Full Stack", "REST APIs", "CI/CD"] },
  { number: "07", title: "NEXUS", tag: "Developer command center", body: "NEXUS brings the journey together as a recruiter-focused developer command center: project intelligence, verified knowledge, and an AI assistant built around accuracy.", skills: ["TypeScript", "FastAPI", "Knowledge Design"] },
] as const;
