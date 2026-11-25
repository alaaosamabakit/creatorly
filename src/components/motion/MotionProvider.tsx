"use client";

import type { ReactNode } from "react";
import { MotionConfig } from "motion/react";

/**
 * Provides global reduced-motion awareness and default studio spring physics.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <MotionConfig
      reducedMotion="user"
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </MotionConfig>
  );
}
