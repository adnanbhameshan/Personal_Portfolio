import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Check, CircleDot } from "lucide-react";
import { journeyChapters } from "../data/profile";
import { Badge } from "../components/ui/Badge";
import { Card } from "../components/ui/Card";
import { SectionHeader } from "../components/ui/SectionHeader";

export function JourneyPage() {
  const railRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const reduceMotion = useReducedMotion();
  useEffect(() => { const update = () => { const rail = railRef.current; if (!rail) return; const bounds = rail.getBoundingClientRect(); const viewport = window.innerHeight * 0.55; setProgress(Math.max(0, Math.min(1, (viewport - bounds.top) / Math.max(bounds.height, 1)))); }; update(); window.addEventListener("scroll", update, { passive: true }); window.addEventListener("resize", update); return () => { window.removeEventListener("scroll", update); window.removeEventListener("resize", update); }; }, []);
  return <div className="space-y-8"><SectionHeader label="Technical Journey" title="Engineering chapters, progressively unlocked." description="A chapter-based view of Adnan’s development—from technical foundations to professional delivery and NEXUS." />
    <div ref={railRef} className="journey-rail relative mx-auto max-w-5xl pb-4"><div className="absolute bottom-0 left-4 top-0 w-px bg-border-mid md:left-1/2 md:-translate-x-1/2" /><motion.div className="absolute left-4 top-0 w-px origin-top bg-ai shadow-[0_0_16px_var(--ai-primary)] md:left-1/2 md:-translate-x-1/2" animate={{ scaleY: progress }} transition={{ duration: reduceMotion ? 0 : 0.2 }} style={{ height: "100%" }} />
      <div className="space-y-8 md:space-y-12">{journeyChapters.map((chapter, index) => { const unlocked = progress >= index / journeyChapters.length; return <motion.article key={chapter.number} initial={{ opacity: 0.35, y: reduceMotion ? 0 : 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ amount: 0.35, once: false }} transition={{ duration: reduceMotion ? 0 : 0.35 }} className={`relative pl-12 md:grid md:grid-cols-[1fr_72px_1fr] md:pl-0 ${index % 2 === 0 ? "" : "md:[&>div:first-child]:col-start-3"}`}><div className="md:col-span-1"><Card variant={unlocked ? "glass" : "default"} className={`p-5 transition duration-300 ${unlocked ? "border-ai/40" : "opacity-75"}`}><div className="flex items-center justify-between gap-3"><span className="font-mono text-xs text-ai">CHAPTER {chapter.number}</span><Badge variant={unlocked ? "featured" : "tag"}>{unlocked ? "Unlocked" : "Pending"}</Badge></div><p className="mt-3 font-mono text-xs uppercase text-text-tertiary">{chapter.tag}</p><h2 className="mt-2 font-display text-2xl font-bold text-text-primary">{chapter.title}</h2><p className="mt-3 text-sm leading-7 text-text-secondary">{chapter.body}</p><div className="mt-5 flex flex-wrap gap-2">{chapter.skills.map((skill) => <Badge key={skill} variant="tech">{skill}</Badge>)}</div></Card></div><div className="absolute left-0 top-6 grid h-8 w-8 place-items-center rounded-full border border-ai/60 bg-deep text-ai shadow-[0_0_16px_rgba(6,182,212,0.25)] md:static md:col-start-2 md:mx-auto">{unlocked ? <Check className="h-4 w-4" /> : <CircleDot className="h-4 w-4" />}</div></motion.article>; })}</div>
    </div></div>;
}
