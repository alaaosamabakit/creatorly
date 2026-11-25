"use client";

import type { ReactNode } from "react";
import { motion } from "motion/react";
import { SPRINGS } from "@/components/motion/MotionPresets";
import { cn } from "@/lib/utils";

interface PillProps {
  active: boolean;
  onClick: () => void;
  layoutId: string;
  children: ReactNode;
  activeClassName?: string;
  className?: string;
}

/**
 * Interactive filter pill with shared-element layoutId spring transition.
 */
export function Pill({
  active,
  onClick,
  layoutId,
  children,
  activeClassName = "bg-ink text-white shadow-sm",
  className,
}: PillProps) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileTap={{ scale: 0.96 }}
      transition={SPRINGS.snappy}
      className={cn(
        "relative inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-xs sm:text-sm font-semibold cursor-pointer select-none transition-colors",
        active ? "text-white" : "text-ink-secondary hover:text-ink",
        className
      )}
    >
      {active ? (
        <motion.span
          layoutId={layoutId}
          transition={SPRINGS.snappy}
          className={cn("absolute inset-0 rounded-full -z-0", activeClassName)}
        />
      ) : null}
      <span className="relative z-10 inline-flex items-center gap-1.5">
        {children}
      </span>
    </motion.button>
  );
}
