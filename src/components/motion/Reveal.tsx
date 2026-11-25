"use client";

import type { ReactNode } from "react";
import { motion } from "motion/react";
import { EASE_OUT_EXPO, REVEAL_VIEWPORT } from "@/components/motion/MotionPresets";
import { cn } from "@/lib/utils";

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  immediate?: boolean;
}

/**
 * Smooth entrance animation wrapper supporting both immediate mount and scroll reveal.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 22,
  immediate = false,
}: RevealProps) {
  if (immediate) {
    return (
      <motion.div
        initial={{ opacity: 0, y }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay, ease: EASE_OUT_EXPO }}
        className={cn(className)}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={REVEAL_VIEWPORT}
      transition={{ duration: 0.6, delay, ease: EASE_OUT_EXPO }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}
