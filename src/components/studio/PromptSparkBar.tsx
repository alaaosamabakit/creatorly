"use client";

import type { RefObject } from "react";
import { motion } from "motion/react";
import { Loader2, Shuffle, Sparkles, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Pill } from "@/components/ui/Pill";
import { PlatformIcon } from "@/components/ui/PlatformIcon";
import { SPRINGS } from "@/components/motion/MotionPresets";
import {
  PLATFORM_META,
  QUICK_TOPICS,
  TONE_META,
} from "@/data/mockStudioData";
import { cn } from "@/lib/utils";
import type { PlatformId, ToneId } from "@/types/creatorly";

const PLATFORMS: PlatformId[] = [
  "all",
  "instagram",
  "tiktok",
  "x",
  "linkedin",
  "youtube",
];

const TONES: ToneId[] = ["electric", "editorial", "playful", "minimal"];

interface PromptSparkBarProps {
  topic: string;
  onTopicChange: (value: string) => void;
  platform: PlatformId;
  onPlatformChange: (platform: PlatformId) => void;
  tone: ToneId;
  onToneChange: (tone: ToneId) => void;
  isGenerating: boolean;
  onGenerate: () => void;
  onShuffle: () => void;
  inputRef: RefObject<HTMLInputElement | null>;
}

/**
 * Interactive AI Spark Composer for configuring platform format, voice tone, and topic.
 */
export function PromptSparkBar({
  topic,
  onTopicChange,
  platform,
  onPlatformChange,
  tone,
  onToneChange,
  isGenerating,
  onGenerate,
  onShuffle,
  inputRef,
}: PromptSparkBarProps) {
  return (
    <section
      id="playground"
      className="mx-auto w-full max-w-6xl scroll-mt-24 px-4 sm:px-6"
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={SPRINGS.gentle}
        className="relative overflow-hidden rounded-[2.25rem] border border-black/[0.09] bg-white p-5 shadow-float-lg sm:p-8"
      >
        {/* Subtle studio edge glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-gradient-to-br from-coral/15 via-violet/15 to-indigo/15 blur-2xl"
        />

        <div className="relative space-y-6">
          {/* Header row */}
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-indigo-soft px-3 py-1 font-mono text-[11px] font-semibold uppercase tracking-wider text-indigo">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Live AI Spark Playground</span>
              </div>
              <h2 className="mt-3 font-display text-2xl font-extrabold text-ink sm:text-3xl">
                Drop a raw idea. Watch it spin into native formats.
              </h2>
            </div>

            <p className="max-w-sm text-sm text-ink-secondary">
              Pick a platform and vibe below—or type any topic to regenerate the
              floating content cards in real time.
            </p>
          </div>

          {/* Platform segmented pills */}
          <div className="flex flex-wrap items-center gap-1.5 rounded-2xl border border-black/[0.06] bg-oat/70 p-1.5">
            {PLATFORMS.map((id) => (
              <Pill
                key={id}
                layoutId="playground-platform-pill"
                active={platform === id}
                onClick={() => onPlatformChange(id)}
                activeClassName="bg-ink text-white shadow-sm"
              >
                <PlatformIcon platform={id} />
                <span>{PLATFORM_META[id].label}</span>
              </Pill>
            ))}
          </div>

          {/* Prompt input form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              onGenerate();
            }}
            className="flex flex-col gap-3 rounded-3xl border border-black/[0.09] bg-cream/75 p-3 shadow-inner sm:flex-row sm:items-center sm:p-2.5 sm:pl-5"
          >
            <div className="flex flex-1 items-center gap-3">
              <Wand2 className="h-5 w-5 shrink-0 text-coral" />
              <label htmlFor="creatorly-topic-input" className="sr-only">
                What are you creating today?
              </label>
              <input
                ref={inputRef}
                id="creatorly-topic-input"
                type="text"
                value={topic}
                onChange={(e) => onTopicChange(e.target.value)}
                placeholder="Describe a launch, story, or hot take..."
                className="w-full bg-transparent text-sm font-medium text-ink placeholder:text-ink-muted focus:outline-none sm:text-base"
              />
            </div>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="md"
                onClick={onShuffle}
                aria-label="Shuffle sample topic and tone"
              >
                <Shuffle className="h-4 w-4 text-indigo" />
                <span className="hidden sm:inline">Shuffle</span>
              </Button>

              <Button
                type="submit"
                variant="coral"
                size="md"
                disabled={isGenerating}
                className="flex-1 sm:flex-none"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Sparking…</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    <span>Generate Sparks</span>
                  </>
                )}
              </Button>
            </div>
          </form>

          {/* Tone selector + Quick topic chips */}
          <div className="flex flex-col justify-between gap-4 border-t border-black/[0.06] pt-4 lg:flex-row lg:items-center">
            <div className="flex flex-wrap items-center gap-2">
              <span className="mr-1 font-mono text-[11px] font-semibold uppercase tracking-wider text-ink-muted">
                Tone:
              </span>
              {TONES.map((toneKey) => {
                const meta = TONE_META[toneKey];
                const isSelected = tone === toneKey;
                return (
                  <motion.button
                    key={toneKey}
                    type="button"
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onToneChange(toneKey)}
                    className={cn(
                      "inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-all cursor-pointer",
                      isSelected
                        ? "border-ink bg-ink text-white shadow-sm"
                        : "border-black/[0.08] bg-white text-ink-secondary hover:border-black/20 hover:text-ink"
                    )}
                  >
                    <span className={cn("h-2 w-2 rounded-full", meta.dotClass)} />
                    <span>{meta.label}</span>
                  </motion.button>
                );
              })}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-ink-muted">
                Quick Sparks:
              </span>
              {QUICK_TOPICS.slice(0, 3).map((sample) => (
                <button
                  key={sample}
                  type="button"
                  onClick={() => onTopicChange(sample)}
                  className={cn(
                    "rounded-full border px-3 py-1 text-xs font-medium transition-colors cursor-pointer",
                    topic === sample
                      ? "border-coral/40 bg-coral-soft text-[#c93714]"
                      : "border-black/[0.07] bg-oat/60 text-ink-secondary hover:bg-oat hover:text-ink"
                  )}
                >
                  {sample}
                </button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
