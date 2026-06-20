import { AnimatePresence, motion } from "framer-motion";
import { Bot, X } from "lucide-react";
import { useUiStore } from "../../store/useUiStore";
import { Button } from "../ui/Button";
import { NexusAIChat } from "./NexusAIChat";

export function NexusAIPanel() {
  const isOpen = useUiStore((state) => state.isAiPanelOpen);
  const close = useUiStore((state) => state.closeAiPanel);
  const open = useUiStore((state) => state.openAiPanel);

  return (
    <>
      <Button
        className="fixed bottom-24 right-4 z-30 shadow-glow-cyan lg:bottom-6"
        variant="ai"
        size="lg"
        onClick={open}
      >
        <Bot aria-hidden="true" className="h-4 w-4" />
        NEXUS AI
      </Button>

      <AnimatePresence>
        {isOpen ? (
          <motion.div
            className="fixed inset-0 z-50 bg-void/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.aside
              className="fixed inset-0 ml-auto flex h-full w-full flex-col border-border-subtle bg-deep shadow-elevated md:inset-y-0 md:right-0 md:w-[460px] md:border-l"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
              role="dialog"
              aria-modal="true"
              aria-label="NEXUS AI assistant"
            >
              <div className="flex items-center justify-end border-b border-border-subtle p-3">
                <Button variant="ghost" size="icon" onClick={close} aria-label="Close NEXUS AI">
                  <X aria-hidden="true" className="h-5 w-5" />
                </Button>
              </div>
              <NexusAIChat compact />
            </motion.aside>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
