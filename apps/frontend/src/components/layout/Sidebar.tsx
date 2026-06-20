import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { futureNavigationItems, navigationItems } from "../../constants/navigation";
import { listStaggerFast, sidebarEntrance, softReveal } from "../../lib/animations";
import { cn } from "../../lib/cn";
import { Badge } from "../ui/Badge";

export function Sidebar() {
  return (
    <motion.aside
      className="fixed inset-y-0 left-0 z-30 hidden w-[260px] border-r border-border-subtle bg-deep lg:flex lg:flex-col"
      variants={sidebarEntrance}
      initial="initial"
      animate="animate"
    >
      <div className="border-b border-border-subtle p-6">
        <p className="font-display text-xl font-bold tracking-normal text-text-primary">NEXUS</p>
        <p className="mt-1 font-mono text-xs text-text-tertiary">v1.0.0 / command center</p>
      </div>

      <nav className="flex-1 space-y-8 overflow-y-auto p-4">
        <motion.div className="space-y-1" variants={listStaggerFast} initial="initial" animate="animate">
          {navigationItems.map((item) => (
            <motion.div key={item.href} variants={softReveal}>
              <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  "group flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition duration-200 ease-nexus-out",
                  isActive
                    ? "bg-[var(--accent-ghost)] text-text-primary shadow-[var(--inset-glow-blue)]"
                    : "text-text-secondary hover:translate-x-0.5 hover:bg-surface hover:text-text-primary motion-reduce:transform-none",
                )
              }
            >
              <item.icon aria-hidden="true" className="h-4 w-4" />
              <span>{item.label}</span>
              <ChevronRight aria-hidden="true" className="ml-auto h-4 w-4 opacity-0 transition group-hover:opacity-100" />
            </NavLink>
            </motion.div>
          ))}
        </motion.div>

        <div>
          <div className="mb-2 flex items-center justify-between px-3">
            <p className="font-mono text-[11px] uppercase text-text-tertiary">Future Modules</p>
            <Badge variant="tag">V2</Badge>
          </div>
          <div className="space-y-1">
            {futureNavigationItems.map((item) => (
              <NavLink
                key={item.href}
                to={item.href}
                className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm text-text-tertiary transition hover:bg-surface hover:text-text-secondary"
              >
                <item.icon aria-hidden="true" className="h-4 w-4" />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </div>
        </div>
      </nav>

      <div className="border-t border-border-subtle p-4">
        <div className="rounded-lg border border-border-mid bg-surface p-4">
          <p className="font-mono text-xs text-ai">STATUS</p>
          <p className="mt-2 text-sm font-medium text-text-primary">Open to International Opportunities</p>
        </div>
      </div>
    </motion.aside>
  );
}
