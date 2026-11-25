"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";
import { motion } from "motion/react";
import { SPRINGS } from "@/components/motion/MotionPresets";
import { cn } from "@/lib/utils";

type ButtonVariant = "coral" | "ink" | "indigo" | "glass" | "outline" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  coral:
    "bg-coral text-white shadow-coral-glow hover:bg-[#f24e26] border border-transparent",
  ink: "bg-ink text-white shadow-float hover:bg-[#23232c] border border-transparent",
  indigo:
    "bg-indigo text-white shadow-indigo-glow hover:bg-[#4338ca] border border-transparent",
  glass:
    "bg-white/85 backdrop-blur-md text-ink border border-black/[0.09] shadow-float hover:bg-white",
  outline:
    "bg-transparent text-ink border border-black/[0.14] hover:border-ink/40 hover:bg-oat/60",
  ghost:
    "bg-transparent text-ink-secondary hover:text-ink hover:bg-black/[0.05] border border-transparent",
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: "h-9 px-3.5 text-xs gap-1.5 rounded-full",
  md: "h-11 px-5 text-sm gap-2 rounded-full",
  lg: "h-13 px-6.5 text-[15px] gap-2.5 rounded-full",
};

interface ButtonProps
  extends Omit<
    ButtonHTMLAttributes<HTMLButtonElement>,
    "onAnimationStart" | "onDragStart" | "onDragEnd" | "onDrag"
  > {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
}

/**
 * Expressive interactive button with spring hover and tap compression.
 */
export function Button({
  variant = "ink",
  size = "md",
  className,
  children,
  disabled,
  type = "button",
  ...rest
}: ButtonProps) {
  return (
    <motion.button
      type={type}
      disabled={disabled}
      whileHover={disabled ? undefined : { y: -2, scale: 1.02 }}
      whileTap={disabled ? undefined : { scale: 0.96, y: 0 }}
      transition={SPRINGS.snappy}
      className={cn(
        "inline-flex items-center justify-center font-semibold tracking-tight cursor-pointer select-none transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo disabled:opacity-50 disabled:cursor-not-allowed",
        VARIANT_CLASSES[variant],
        SIZE_CLASSES[size],
        className
      )}
      {...rest}
    >
      {children}
    </motion.button>
  );
}
