import type { Variants } from "framer-motion";

export const easeOut = [0.16, 1, 0.3, 1] as const;
export const easeStandard = [0.2, 0.8, 0.2, 1] as const;

export const pageTransition: Variants = {
  initial: { opacity: 0, y: 18 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: easeOut },
  },
  exit: {
    opacity: 0,
    y: 10,
    transition: { duration: 0.2, ease: easeStandard },
  },
};

export const shellFade: Variants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { duration: 0.5, ease: easeOut },
  },
};

export const topbarEntrance: Variants = {
  initial: { opacity: 0, y: -10 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: easeOut, delay: 0.05 },
  },
};

export const sidebarEntrance: Variants = {
  initial: { opacity: 0, x: -14 },
  animate: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: easeOut, delay: 0.08 },
  },
};

export const listStagger: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.08,
    },
  },
};

export const listStaggerFast: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.04,
    },
  },
};

export const cardEntrance: Variants = {
  initial: { opacity: 0, y: 18 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.48, ease: easeOut },
  },
};

export const softReveal: Variants = {
  initial: { opacity: 0, y: 12 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.42, ease: easeOut },
  },
};

export const progressFill: Variants = {
  initial: { scaleX: 0 },
  animate: {
    scaleX: 1,
    transition: { duration: 0.8, ease: easeOut, delay: 0.12 },
  },
};

export const hoverLift = {
  y: -4,
  transition: { duration: 0.2, ease: easeStandard },
};

export const pressTap = {
  scale: 0.985,
  transition: { duration: 0.12, ease: easeStandard },
};

