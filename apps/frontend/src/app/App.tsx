import { AnimatePresence, motion } from "framer-motion";
import { BootSequence } from "../components/boot/BootSequence";
import { useBootPreference } from "../hooks/useBootPreference";
import { pageTransition } from "../lib/animations";
import { AppRoutes } from "./routes";

export function App() {
  const { shouldBoot, completeBoot } = useBootPreference();

  return (
    <AnimatePresence mode="wait">
      {shouldBoot ? (
        <BootSequence key="boot" onComplete={completeBoot} />
      ) : (
        <motion.div
          key="app"
          variants={pageTransition}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          <AppRoutes />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
