import { motion } from "framer-motion";
import { Outlet } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { shellFade } from "../../lib/animations";
import { NexusAIPanel } from "../ai/NexusAIPanel";
import { NexusGridPulse } from "../background/NexusGridPulse";
import { MobileNav } from "./MobileNav";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

export function AppShell() {
  const location = useLocation();
  const showGridPulse = location.pathname === "/dashboard" || location.pathname.startsWith("/projects");

  return (
    <motion.div
      className="min-h-screen bg-transparent text-text-primary"
      variants={shellFade}
      initial="initial"
      animate="animate"
    >
      {showGridPulse ? <NexusGridPulse /> : null}
      <Sidebar />
      <div className="min-h-screen lg:pl-[260px]">
        <Topbar />
        <main className="mx-auto w-full max-w-[1200px] px-4 pb-28 pt-6 sm:px-6 lg:px-8 lg:pb-12">
          <Outlet />
        </main>
      </div>
      <MobileNav />
      <NexusAIPanel />
    </motion.div>
  );
}
