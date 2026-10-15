import { Navigate, Route, Routes } from "react-router-dom";
import { AppShell } from "../components/layout/AppShell";
import { AboutPage } from "../pages/AboutPage";
import { AssistantPage } from "../pages/AssistantPage";
import { ContactPage } from "../pages/ContactPage";
import { DashboardPage } from "../pages/DashboardPage";
import { NotFoundPage } from "../pages/NotFoundPage";
import { ProjectDetailPage } from "../pages/ProjectDetailPage";
import { ProjectsIndexPage } from "../pages/ProjectsIndexPage";
import { ResumePage } from "../pages/ResumePage";
import { SkillsPage } from "../pages/SkillsPage";
import { ExperiencePage } from "../pages/ExperiencePage";
import { CertificationsPage } from "../pages/CertificationsPage";
import { GitHubPage } from "../pages/GitHubPage";
import { JourneyPage } from "../pages/JourneyPage";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route element={<AppShell />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/projects" element={<ProjectsIndexPage />} />
        <Route path="/projects/:slug" element={<ProjectDetailPage />} />
        <Route path="/experience" element={<ExperiencePage />} />
        <Route path="/assistant" element={<AssistantPage />} />
        <Route path="/resume" element={<ResumePage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/skills" element={<SkillsPage />} />
        <Route path="/github" element={<GitHubPage />} />
        <Route path="/journey" element={<JourneyPage />} />
        <Route path="/aws-journey" element={<Navigate to="/journey" replace />} />
        <Route path="/certifications" element={<CertificationsPage />} />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
