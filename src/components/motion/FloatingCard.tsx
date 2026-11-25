"use client";

import type { ReactNode } from "react";
import { motion } from "motion/react";
import { SPRINGS } from "@/components/motion/MotionPresets";
import { cn } from "@/lib/utils";
import type { CardAccent } from "@/types/creatorly";

const ACCENT_RING_HOVER: Record<CardAccent, string> = {
  coral: "hover:border-coral/35",
  indigo: "hover:border-indigo/35",
  mint: "hover:border-mint/45",
  violet: "hover:border-violet/35",
};

interface FloatingCardProps {
  children: ReactNode;
  className?: string;
  accent?: CardAccent;
  hoverLift?: number;
  tiltOnHover?: number;
  delay?: number;
}

/**
 * Layered, tactile floating surface with spring hover elevation and crisp border framing.
 */
export function FloatingCard({
  children,
  className,
  accent = "indigo",
  hoverLift = -6,
  tiltOnHover = 0,
  delay = 0,
}: FloatingCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      whileHover={{
        y: hoverLift,
        rotate: tiltOnHover,
        transition: SPRINGS.bouncy,
      }}
      transition={{ ...SPRINGS.gentle, delay }}
      className={cn(
        "relative rounded-3xl border border-black/[0.08] bg-surface shadow-float transition-colors duration-200",
        ACCENT_RING_HOVER[accent],
        className
      )}
    >
      {children}
    </motion.div>
  );
}
