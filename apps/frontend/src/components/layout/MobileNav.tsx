import { AnimatePresence, motion } from "framer-motion";
import { NavLink } from "react-router-dom";
import { navigationItems } from "../../constants/navigation";
import { cn } from "../../lib/cn";
import { useUiStore } from "../../store/useUiStore";

export function MobileNav() {
  const isSidebarOpen = useUiStore((state) => state.isSidebarOpen);
  const closeSidebar = useUiStore((state) => state.closeSidebar);

  return (
    <>
      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-border-subtle bg-deep/95 px-2 py-2 backdrop-blur-xl lg:hidden">
        <div className="mx-auto grid max-w-lg grid-cols-6 gap-1">
          {navigationItems.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  "flex flex-col items-center gap-1 rounded-md px-1 py-2 text-[10px] font-medium transition",
                  isActive ? "bg-[var(--accent-ghost)] text-text-primary" : "text-text-tertiary",
                )
              }
            >
              <item.icon aria-hidden="true" className="h-4 w-4" />
              <span className="max-w-full truncate">{item.label.replace("NEXUS ", "")}</span>
            </NavLink>
          ))}
        </div>
      </nav>

      <AnimatePresence>
        {isSidebarOpen ? (
          <motion.div
            className="fixed inset-0 z-40 bg-void/80 backdrop-blur-sm lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeSidebar}
          >
            <motion.div
              className="h-full w-[280px] border-r border-border-subtle bg-deep p-4"
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              onClick={(event) => event.stopPropagation()}
            >
              <p className="px-3 py-4 font-display text-xl font-bold">NEXUS</p>
              <div className="space-y-1">
                {navigationItems.map((item) => (
                  <NavLink
                    key={item.href}
                    to={item.href}
                    onClick={closeSidebar}
                    className={({ isActive }) =>
                      cn(
                        "flex items-center gap-3 rounded-md px-3 py-3 text-sm",
                        isActive ? "bg-[var(--accent-ghost)] text-text-primary" : "text-text-secondary",
                      )
                    }
                  >
                    <item.icon aria-hidden="true" className="h-4 w-4" />
                    <span>{item.label}</span>
                  </NavLink>
                ))}
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}

