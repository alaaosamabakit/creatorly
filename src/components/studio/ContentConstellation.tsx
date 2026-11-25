"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  Bookmark,
  Check,
  Copy,
  Expand,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { ACCENT_SURFACE_MAP, PlatformIcon } from "@/components/ui/PlatformIcon";
import { SPRINGS } from "@/components/motion/MotionPresets";
import { PLATFORM_META, TONE_META } from "@/data/mockStudioData";
import { cn, copyToClipboard } from "@/lib/utils";
import type { SparkCard } from "@/types/creatorly";

interface ContentConstellationProps {
  cards: SparkCard[];
  savedIds: string[];
  onToggleSave: (id: string) => void;
  onInspectCard: (card: SparkCard, variationIndex: number) => void;
  isGenerating: boolean;
}

/**
 * Asymmetric floating constellation of social post cards with live Remix, Copy, and Save actions.
 */
export function ContentConstellation({
  cards,
  savedIds,
  onToggleSave,
  onInspectCard,
  isGenerating,
}: ContentConstellationProps) {
  const [variationMap, setVariationMap] = useState<Record<string, number>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleRemix = (card: SparkCard) => {
    setVariationMap((prev) => {
      const current = prev[card.id] ?? 0;
      return {
        ...prev,
        [card.id]: (current + 1) % card.variations.length,
      };
    });
  };

  const handleCopy = async (card: SparkCard, variationIdx: number) => {
    const variation = card.variations[variationIdx] ?? card.variations[0];
    const formatted = `${variation.hook}\n\n${variation.caption}\n\n${variation.cta}\n${card.tags.join(" ")}`;
    await copyToClipboard(formatted);
    setCopiedId(card.id);
    window.setTimeout(() => {
      setCopiedId((prev) => (prev === card.id ? null : prev));
    }, 1800);
  };

  return (
    <section
      id="constellation"
      className="mx-auto mt-14 w-full max-w-6xl scroll-mt-24 px-4 sm:px-6"
    >
      <div className="mb-8 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <span className="font-mono text-xs font-semibold uppercase tracking-wider text-ink-muted">
            Interactive Output Canvas
          </span>
          <h3 className="mt-1 font-display text-2xl font-extrabold text-ink sm:text-3xl">
            Floating Spark Constellation
          </h3>
        </div>
        <p className="text-sm text-ink-secondary">
          Click <strong className="font-semibold text-ink">Remix</strong> on
          any card to cycle AI angles, or inspect full slide/scene beats.
        </p>
      </div>

      <motion.div
        animate={{ opacity: isGenerating ? 0.55 : 1, scale: isGenerating ? 0.99 : 1 }}
        transition={{ duration: 0.2 }}
        className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 lg:items-start"
      >
        <AnimatePresence mode="popLayout">
          {cards.map((card, index) => {
            const variationIndex =
              (variationMap[card.id] ?? 0) % card.variations.length;
            const activeVariation =
              card.variations[variationIndex] ?? card.variations[0];
            const accent = ACCENT_SURFACE_MAP[card.accent];
            const isSaved = savedIds.includes(card.id);
            const isCopied = copiedId === card.id;

            // Asymmetric stagger offset on desktop for an organic floating feel
            const staggerOffsetClass =
              index % 3 === 1
                ? "lg:mt-8"
                : index % 3 === 2
                  ? "lg:mt-3"
                  : "";

            return (
              <motion.article
                key={card.id}
                layout
                initial={{ opacity: 0, y: 24, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.94 }}
                whileHover={{ y: -6, transition: SPRINGS.bouncy }}
                transition={{ ...SPRINGS.gentle, delay: index * 0.05 }}
                className={cn(
                  "group relative flex flex-col rounded-[1.85rem] border border-black/[0.08] bg-white p-4 shadow-float transition-shadow hover:shadow-float-lg",
                  staggerOffsetClass
                )}
              >
                {/* Top metadata row */}
                <div className="mb-3 flex items-center justify-between gap-2">
                  <Badge variant={card.accent}>
                    <PlatformIcon platform={card.platform} />
                    <span>{PLATFORM_META[card.platform].label}</span>
                  </Badge>

                  <div className="flex items-center gap-1.5">
                    <span className="rounded-full bg-oat px-2.5 py-1 font-mono text-[11px] font-semibold text-ink">
                      {activeVariation.hookScore}% Hook
                    </span>
                  </div>
                </div>

                {/* Tactile mini creative preview cover */}
                <div
                  className={cn(
                    "relative overflow-hidden rounded-2xl bg-gradient-to-br p-5 text-white",
                    accent.gradientBg
                  )}
                >
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-white/20 blur-xl"
                  />
                  <div className="relative flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-white/85">
                    <span>{card.formatLabel}</span>
                    <span className="rounded-full bg-black/20 px-2 py-0.5 font-mono">
                      {card.durationOrSlides}
                    </span>
                  </div>
                  <p className="relative mt-4 font-display text-xl font-extrabold leading-tight">
                    {card.visualHeadline}
                  </p>
                  <div className="relative mt-4 flex items-center justify-between text-xs text-white/90">
                    <span>{card.visualSubline}</span>
                    <span className="font-mono">{card.bestTime}</span>
                  </div>
                </div>

                {/* Animated copy & hook body */}
                <div className="mt-4 flex-1 px-1">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-ink-muted">
                      {TONE_META[card.tone].label} Cut · 0{variationIndex + 1}
                    </span>
                    <span className="font-mono text-[11px] text-ink-muted">
                      Est. {card.estimatedReach}
                    </span>
                  </div>

                  <AnimatePresence mode="wait">
                    <motion.div
                      key={`${card.id}-v-${variationIndex}`}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.22 }}
                    >
                      <h4 className="font-display text-[17px] font-bold leading-snug text-ink">
                        “{activeVariation.hook}”
                      </h4>
                      <p className="mt-2 text-sm leading-relaxed text-ink-secondary">
                        {activeVariation.caption}
                      </p>
                    </motion.div>
                  </AnimatePresence>

                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {card.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-cream px-2.5 py-0.5 font-mono text-[11px] text-ink-muted"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Interactive card toolbar */}
                <div className="mt-5 flex items-center justify-between gap-2 border-t border-black/[0.06] pt-3.5">
                  <div className="flex items-center gap-1.5">
                    <motion.button
                      type="button"
                      whileTap={{ scale: 0.92 }}
                      onClick={() => handleRemix(card)}
                      className="inline-flex items-center gap-1.5 rounded-full bg-oat/90 px-3 py-1.5 text-xs font-semibold text-ink transition-colors hover:bg-oat cursor-pointer"
                    >
                      <RefreshCw className="h-3.5 w-3.5 text-indigo" />
                      <span>Remix</span>
                    </motion.button>

                    <motion.button
                      type="button"
                      whileTap={{ scale: 0.92 }}
                      onClick={() => handleCopy(card, variationIndex)}
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer",
                        isCopied
                          ? "bg-mint-soft text-mint-deep"
                          : "bg-oat/60 text-ink-secondary hover:bg-oat hover:text-ink"
                      )}
                    >
                      {isCopied ? (
                        <>
                          <Check className="h-3.5 w-3.5" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5" />
                          <span>Copy</span>
                        </>
                      )}
                    </motion.button>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <motion.button
                      type="button"
                      whileTap={{ scale: 0.88 }}
                      onClick={() => onToggleSave(card.id)}
                      aria-label={isSaved ? "Remove from saved sparks" : "Save spark"}
                      className={cn(
                        "inline-flex h-8 w-8 items-center justify-center rounded-full border transition-colors cursor-pointer",
                        isSaved
                          ? "border-coral/35 bg-coral-soft text-coral"
                          : "border-black/[0.08] bg-white text-ink-secondary hover:text-ink"
                      )}
                    >
                      <Bookmark
                        className={cn("h-3.5 w-3.5", isSaved && "fill-current")}
                      />
                    </motion.button>

                    <motion.button
                      type="button"
                      whileTap={{ scale: 0.92 }}
                      onClick={() => onInspectCard(card, variationIndex)}
                      aria-label={`Inspect ${card.formatLabel}`}
                      className="inline-flex h-8 items-center gap-1 rounded-full border border-black/[0.08] bg-white px-2.5 text-xs font-semibold text-ink transition-colors hover:bg-ink hover:text-white cursor-pointer"
                    >
                      <Expand className="h-3.5 w-3.5" />
                      <span>Inspect</span>
                    </motion.button>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </AnimatePresence>
      </motion.div>

      {cards.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-black/15 bg-white/70 p-10 text-center">
          <Sparkles className="mx-auto h-6 w-6 text-coral" />
          <p className="mt-2 font-display text-lg font-bold text-ink">
            No sparks match that filter yet
          </p>
        </div>
      ) : null}
    </section>
  );
}
