import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import type { CardAccent } from "@/types/creatorly";

type BadgeVariant = CardAccent | "ink" | "cream";

const BADGE_CLASSES: Record<BadgeVariant, string> = {
  coral: "bg-coral-soft text-[#c93714] border-coral/20",
  indigo: "bg-indigo-soft text-indigo border-indigo/20",
  mint: "bg-mint-soft text-mint-deep border-mint/30",
  violet: "bg-violet-soft text-[#7e22ce] border-violet/20",
  ink: "bg-ink text-white border-ink",
  cream: "bg-oat text-ink border-black/[0.08]",
};

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  pulse?: boolean;
  className?: string;
}

/**
 * Tactile sticker-like status or category badge.
 */
export function Badge({
  children,
  variant = "cream",
  pulse = false,
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold tracking-tight",
        BADGE_CLASSES[variant],
        className
      )}
    >
      {pulse ? (
        <span className="relative flex h-2 w-2" aria-hidden="true">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-60" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-current" />
        </span>
      ) : null}
      {children}
    </span>
  );
}
