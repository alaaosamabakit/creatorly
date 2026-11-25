"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check, Copy, Sparkles, X } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ACCENT_SURFACE_MAP, PlatformIcon } from "@/components/ui/PlatformIcon";
import { SPRINGS } from "@/components/motion/MotionPresets";
import { PLATFORM_META, TONE_META } from "@/data/mockStudioData";
import { cn, copyToClipboard } from "@/lib/utils";
import type { SparkCard } from "@/types/creatorly";

interface PostPreviewModalProps {
  card: SparkCard | null;
  initialVariationIndex: number;
  onClose: () => void;
}

/**
 * Interactive preview drawer/modal showing full slide/scene beats and variation switcher.
 */
export function PostPreviewModal({
  card,
  initialVariationIndex,
  onClose,
}: PostPreviewModalProps) {
  const [override, setOverride] = useState<{
    cardId: string;
    index: number;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  const variationIndex =
    card && override?.cardId === card.id
      ? override.index
      : initialVariationIndex;

  useEffect(() => {
    if (!card) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [card, onClose]);

  const activeVariation = card
    ? (card.variations[variationIndex] ?? card.variations[0])
    : null;

  const handleCopyBrief = async () => {
    if (!card || !activeVariation) return;
    const brief = [
      `[${PLATFORM_META[card.platform].label} · ${card.formatLabel}]`,
      `Hook: ${activeVariation.hook}`,
      `Caption: ${activeVariation.caption}`,
      `CTA: ${activeVariation.cta}`,
      "",
      "Structure Beats:",
      ...card.slidesOrBeats.map((b, i) => `${i + 1}. ${b}`),
    ].join("\n");

    await copyToClipboard(brief);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <AnimatePresence>
      {card && activeVariation ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4 backdrop-blur-sm"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label="Inspect content spark"
        >
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.96 }}
            transition={SPRINGS.bouncy}
            onClick={(e) => e.stopPropagation()}
            className="relative max-h-[88vh] w-full max-w-2xl overflow-y-auto rounded-[2rem] border border-black/10 bg-white p-6 shadow-float-lg sm:p-8"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant={card.accent}>
                  <PlatformIcon platform={card.platform} />
                  <span>{PLATFORM_META[card.platform].label}</span>
                </Badge>
                <Badge variant="cream">
                  {TONE_META[card.tone].label} Voice
                </Badge>
                <Badge variant="mint">
                  {activeVariation.hookScore}% Hook Score
                </Badge>
              </div>

              <button
                type="button"
                onClick={onClose}
                aria-label="Close preview"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-black/[0.08] bg-oat/70 text-ink transition-colors hover:bg-oat cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Gradient artwork banner */}
            <div
              className={cn(
                "mt-5 rounded-3xl bg-gradient-to-br p-6 text-white",
                ACCENT_SURFACE_MAP[card.accent].gradientBg
              )}
            >
              <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-white/85">
                <span>{card.formatLabel}</span>
                <span className="font-mono">{card.bestTime}</span>
              </div>
              <h3 className="mt-3 font-display text-2xl font-extrabold leading-tight sm:text-3xl">
                {card.visualHeadline}
              </h3>
              <p className="mt-2 text-sm text-white/85">{card.visualSubline}</p>
            </div>

            {/* Variation switcher */}
            <div className="mt-6 flex items-center justify-between gap-3">
              <span className="font-mono text-xs font-semibold uppercase tracking-wider text-ink-muted">
                AI Angle Variations
              </span>
              <div className="inline-flex rounded-full bg-oat p-1">
                {card.variations.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() =>
                      setOverride({ cardId: card.id, index: idx })
                    }
                    className={cn(
                      "rounded-full px-3.5 py-1 text-xs font-semibold transition-colors cursor-pointer",
                      variationIndex === idx
                        ? "bg-ink text-white"
                        : "text-ink-secondary hover:text-ink"
                    )}
                  >
                    Cut 0{idx + 1}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-4 rounded-2xl border border-black/[0.07] bg-cream/70 p-4">
              <p className="font-display text-lg font-bold text-ink">
                “{activeVariation.hook}”
              </p>
              <p className="mt-2 text-sm leading-relaxed text-ink-secondary">
                {activeVariation.caption}
              </p>
              <p className="mt-3 text-xs font-semibold text-indigo">
                CTA: {activeVariation.cta}
              </p>
            </div>

            {/* Scene / slide breakdown */}
            <div className="mt-6">
              <h4 className="font-mono text-xs font-semibold uppercase tracking-wider text-ink-muted">
                Creative Beat Breakdown
              </h4>
              <ul className="mt-3 space-y-2.5">
                {card.slidesOrBeats.map((beat, idx) => (
                  <li
                    key={beat}
                    className="flex items-start gap-3 rounded-2xl border border-black/[0.06] bg-white px-4 py-3 text-sm text-ink"
                  >
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-oat font-mono text-xs font-bold text-ink">
                      {idx + 1}
                    </span>
                    <span className="pt-0.5 leading-snug">{beat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-black/[0.06] pt-4">
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-ink-muted">
                <Sparkles className="h-3.5 w-3.5 text-coral" />
                Est. organic reach: {card.estimatedReach}
              </span>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={onClose}>
                  Close
                </Button>
                <Button variant="coral" size="sm" onClick={handleCopyBrief}>
                  {copied ? (
                    <>
                      <Check className="h-3.5 w-3.5" />
                      <span>Copied Full Brief</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>Copy Full Brief</span>
                    </>
                  )}
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
