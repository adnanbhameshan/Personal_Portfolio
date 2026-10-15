import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Bot, Menu } from "lucide-react";
import { navigationItems } from "../../constants/navigation";
import { topbarEntrance } from "../../lib/animations";
import { useUiStore } from "../../store/useUiStore";
import { Button } from "../ui/Button";
import { ButtonLink } from "../ui/ButtonLink";
import { StatusPill } from "../ui/StatusPill";
import { ThemeToggle } from "./ThemeToggle";

export function Topbar() {
  const location = useLocation();
  const toggleSidebar = useUiStore((state) => state.toggleSidebar);
  const activeItem = navigationItems.find((item) => location.pathname.startsWith(item.href));

  return (
    <motion.header
      className="sticky top-0 z-20 border-b border-border-subtle bg-void/85 backdrop-blur-xl"
      variants={topbarEntrance}
      initial="initial"
      animate="animate"
    >
      <div className="mx-auto flex h-16 w-full max-w-[1200px] items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <Button className="lg:hidden" variant="ghost" size="icon" onClick={toggleSidebar} aria-label="Open navigation">
            <Menu aria-hidden="true" className="h-5 w-5" />
          </Button>
          <div className="min-w-0">
            <p className="truncate font-display text-sm font-bold text-text-primary md:text-base">
              {activeItem?.label ?? "NEXUS"}
            </p>
            <p className="hidden truncate text-xs text-text-secondary sm:block">
              Adnan Ahmed Bhameshan / Full Stack Developer
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 md:gap-3">
          <ThemeToggle />
          <div className="hidden md:block"><StatusPill label="Available" location="Dubai, UAE" /></div>
          <ButtonLink className="hidden md:inline-flex" to="/assistant" variant="ai" size="sm">
            <Bot aria-hidden="true" className="h-4 w-4" />
            Ask NEXUS AI
          </ButtonLink>
        </div>
      </div>
    </motion.header>
  );
}
