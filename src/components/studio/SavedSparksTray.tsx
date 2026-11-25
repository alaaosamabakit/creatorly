"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Bookmark, Check, Copy, Trash2 } from "lucide-react";
import { PlatformIcon } from "@/components/ui/PlatformIcon";
import { SPRINGS } from "@/components/motion/MotionPresets";
import { copyToClipboard } from "@/lib/utils";
import type { SparkCard } from "@/types/creatorly";

interface SavedSparksTrayProps {
  savedCards: SparkCard[];
  onClearSaved: () => void;
}

/**
 * Floating bottom dock appearing when the user saves sparks in the playground.
 */
export function SavedSparksTray({
  savedCards,
  onClearSaved,
}: SavedSparksTrayProps) {
  const [copiedAll, setCopiedAll] = useState(false);

  const handleCopyAll = async () => {
    const bundle = savedCards
      .map((card) => {
        const first = card.variations[0];
        return `• [${card.platform.toUpperCase()} — ${card.formatLabel}]\n  ${first.hook}\n  ${first.caption}`;
      })
      .join("\n\n");
    await copyToClipboard(bundle);
    setCopiedAll(true);
    window.setTimeout(() => setCopiedAll(false), 1800);
  };

  return (
    <AnimatePresence>
      {savedCards.length > 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 36, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 36, scale: 0.96 }}
          transition={SPRINGS.bouncy}
          className="fixed bottom-5 left-1/2 z-40 w-[calc(100%-2rem)] max-w-xl -translate-x-1/2"
        >
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-full border border-black/10 bg-ink px-4 py-2.5 text-white shadow-float-lg sm:px-5">
            <div className="flex items-center gap-2.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-coral text-white">
                <Bookmark className="h-3.5 w-3.5 fill-current" />
              </span>
              <span className="text-xs font-semibold sm:text-sm">
                {savedCards.length} {savedCards.length === 1 ? "spark" : "sparks"}{" "}
                queued
              </span>
              <div className="hidden items-center gap-1 sm:flex">
                {savedCards.slice(0, 4).map((card) => (
                  <span
                    key={card.id}
                    className="flex h-6 w-6 items-center justify-center rounded-full bg-white/12 text-white/90"
                  >
                    <PlatformIcon platform={card.platform} className="h-3 w-3" />
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopyAll}
                className="inline-flex items-center gap-1.5 rounded-full bg-mint px-3.5 py-1.5 text-xs font-bold text-ink transition-transform hover:scale-[1.03] active:scale-95 cursor-pointer"
              >
                {copiedAll ? (
                  <>
                    <Check className="h-3.5 w-3.5" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    <span>Copy Queue</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={onClearSaved}
                aria-label="Clear saved queue"
                className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white/80 transition-colors hover:bg-white/20 hover:text-white cursor-pointer"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
