import {
  Bot,
  BriefcaseBusiness,
  Cpu,
  FileText,
  Gauge,
  Github,
  GraduationCap,
  Mail,
  RadioTower,
  UserRound,
} from "lucide-react";

export const navigationItems = [
  { label: "Dashboard", href: "/dashboard", icon: Gauge },
  { label: "Projects", href: "/projects", icon: BriefcaseBusiness },
  { label: "Experience", href: "/experience", icon: BriefcaseBusiness },
  { label: "Certifications", href: "/certifications", icon: GraduationCap },
  { label: "Skills", href: "/skills", icon: Cpu },
  { label: "GitHub", href: "/github", icon: Github },
  { label: "Technical Journey", href: "/journey", icon: RadioTower },
  { label: "NEXUS AI", href: "/assistant", icon: Bot },
  { label: "Resume", href: "/resume", icon: FileText },
  { label: "Contact", href: "/contact", icon: Mail },
  { label: "About", href: "/about", icon: UserRound },
];

export const mobileNavigationItems = [
  { label: "Dashboard", href: "/dashboard", icon: Gauge },
  { label: "Projects", href: "/projects", icon: BriefcaseBusiness },
  { label: "NEXUS AI", href: "/assistant", icon: Bot },
  { label: "Resume", href: "/resume", icon: FileText },
  { label: "Contact", href: "/contact", icon: Mail },
  { label: "About", href: "/about", icon: UserRound },
];
