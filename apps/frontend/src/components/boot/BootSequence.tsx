import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { easeOut, listStaggerFast, softReveal } from "../../lib/animations";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";

const loadingLines = [
  "Loading Developer Profile...",
  "Loading Projects...",
  "Loading AI Core...",
  "Loading Certifications...",
  "Loading Cloud Journey...",
];

interface BootSequenceProps {
  onComplete: (skipNextTime?: boolean) => void;
}

export function BootSequence({ onComplete }: BootSequenceProps) {
  const [visibleLines, setVisibleLines] = useState(1);
  const [canSkip, setCanSkip] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const skipTimer = window.setTimeout(() => setCanSkip(true), 2_000);
    const lineTimer = window.setInterval(() => {
      setVisibleLines((current) => Math.min(current + 1, loadingLines.length));
    }, prefersReducedMotion ? 120 : 420);
    const completeTimer = window.setTimeout(() => onComplete(true), prefersReducedMotion ? 1_200 : 4_700);

    return () => {
      window.clearTimeout(skipTimer);
      window.clearInterval(lineTimer);
      window.clearTimeout(completeTimer);
    };
  }, [onComplete, prefersReducedMotion]);

  return (
    <motion.main
      className="fixed inset-0 z-50 grid min-h-screen place-items-center bg-void px-4"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: prefersReducedMotion ? 0.1 : 0.6, ease: easeOut }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_12%,rgba(6,182,212,0.12),transparent_28rem)]" />
      <Card variant="glass" className="w-full max-w-2xl p-5 md:p-7">
        <div className="flex items-center justify-between border-b border-border-subtle pb-4">
          <div>
            <p className="font-mono text-sm text-ai">NEXUS v1.0.0</p>
            <p className="mt-1 text-sm text-text-secondary">Developer Intelligence System</p>
          </div>
          <span className="h-2.5 w-2.5 rounded-full bg-online shadow-[var(--glow-green)]" />
        </div>

        <motion.div
          className="mt-5 space-y-3 font-mono text-sm"
          variants={listStaggerFast}
          initial="initial"
          animate="animate"
        >
          {loadingLines.slice(0, visibleLines).map((line) => (
            <motion.div
              key={line}
              variants={softReveal}
              className="flex min-h-6 items-center gap-3 text-text-secondary"
            >
              <span className="text-ai">&gt;</span>
              <span className="text-text-primary">{line}</span>
              <span className="ml-auto text-success">OK</span>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="mt-6 space-y-4 border-t border-border-subtle pt-5 font-mono"
          initial={{ opacity: 0 }}
          animate={{ opacity: visibleLines === loadingLines.length ? 1 : 0 }}
          transition={{ duration: prefersReducedMotion ? 0.01 : 0.45, ease: easeOut }}
        >
          <p className="text-sm text-success">ALL SYSTEMS OPERATIONAL</p>
          <div className="grid gap-3 text-sm sm:grid-cols-3">
            <div>
              <p className="text-[11px] uppercase text-text-tertiary">Identity Resolved</p>
              <p className="mt-1 text-text-primary">Adnan Ahmed Bhameshan</p>
            </div>
            <div>
              <p className="text-[11px] uppercase text-text-tertiary">Role</p>
              <p className="mt-1 text-text-primary">Full Stack Engineer · AI Developer</p>
            </div>
            <div>
              <p className="text-[11px] uppercase text-text-tertiary">Status</p>
              <p className="mt-1 text-text-primary">Open to International Opportunities</p>
            </div>
          </div>
          <p className="text-sm text-ai">ACCESS GRANTED</p>
        </motion.div>

        <div className="mt-6 h-1 overflow-hidden rounded-full bg-elevated">
          <motion.div
            className="h-full bg-ai"
            initial={{ width: "8%" }}
            animate={{ width: `${Math.min((visibleLines / loadingLines.length) * 100, 100)}%` }}
            transition={{ duration: prefersReducedMotion ? 0.01 : 0.4, ease: easeOut }}
          />
        </div>
      </Card>

      {canSkip ? (
        <Button
          className="absolute bottom-6 right-6"
          variant="ghost"
          size="sm"
          onClick={() => onComplete(true)}
        >
          SKIP
        </Button>
      ) : null}
    </motion.main>
  );
}
