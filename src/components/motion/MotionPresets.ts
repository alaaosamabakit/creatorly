import type { Transition } from "motion/react";

export const SPRINGS: Record<"snappy" | "bouncy" | "gentle", Transition> = {
  snappy: {
    type: "spring",
    stiffness: 420,
    damping: 30,
    mass: 0.8,
  },
  bouncy: {
    type: "spring",
    stiffness: 340,
    damping: 20,
    mass: 0.85,
  },
  gentle: {
    type: "spring",
    stiffness: 220,
    damping: 26,
    mass: 1,
  },
};

export const EASE_OUT_EXPO: [number, number, number, number] = [
  0.16, 1, 0.3, 1,
];

export const REVEAL_VIEWPORT = {
  once: true,
  amount: 0.16,
} as const;
