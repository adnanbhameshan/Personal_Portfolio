import { motion } from "framer-motion";
import { NexusAIChat } from "../components/ai/NexusAIChat";
import { Card } from "../components/ui/Card";
import { SectionHeader } from "../components/ui/SectionHeader";
import { cardEntrance, listStaggerFast, softReveal } from "../lib/animations";

export function AssistantPage() {
  return (
    <motion.div className="space-y-6" variants={listStaggerFast} initial="initial" animate="animate">
      <motion.div variants={softReveal}>
        <SectionHeader
          label="NEXUS AI"
          title="An intelligent portfolio guide for faster evaluation."
          description="Ask focused questions about Adnan's projects, skills, technologies, AWS learning path, and role fit."
        />
      </motion.div>
      <motion.div variants={cardEntrance}>
        <Card variant="glass" className="h-[min(720px,calc(100vh-190px))] overflow-hidden">
          <NexusAIChat />
        </Card>
      </motion.div>
    </motion.div>
  );
}
