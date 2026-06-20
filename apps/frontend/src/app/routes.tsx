import { Navigate, Route, Routes } from "react-router-dom";
import { AppShell } from "../components/layout/AppShell";
import { AboutPage } from "../pages/AboutPage";
import { AssistantPage } from "../pages/AssistantPage";
import { ContactPage } from "../pages/ContactPage";
import { DashboardPage } from "../pages/DashboardPage";
import { FuturePlaceholderPage } from "../pages/FuturePlaceholderPage";
import { NotFoundPage } from "../pages/NotFoundPage";
import { ProjectDetailPage } from "../pages/ProjectDetailPage";
import { ProjectsIndexPage } from "../pages/ProjectsIndexPage";
import { ResumePage } from "../pages/ResumePage";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route element={<AppShell />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/projects" element={<ProjectsIndexPage />} />
        <Route path="/projects/:slug" element={<ProjectDetailPage />} />
        <Route path="/assistant" element={<AssistantPage />} />
        <Route path="/resume" element={<ResumePage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/skills" element={<FuturePlaceholderPage title="Skills Intelligence" />} />
        <Route path="/github" element={<FuturePlaceholderPage title="GitHub Intelligence" />} />
        <Route path="/aws-journey" element={<FuturePlaceholderPage title="AWS Journey" />} />
        <Route path="/certifications" element={<FuturePlaceholderPage title="Certifications Hub" />} />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

