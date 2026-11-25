"use client";

import { useState } from "react";
import { motion } from "motion/react";
import {
  ArrowDownRight,
  Flame,
  Shuffle,
  Sparkles,
  TrendingUp,
  Zap,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ACCENT_SURFACE_MAP, PlatformIcon } from "@/components/ui/PlatformIcon";
import { Reveal } from "@/components/motion/Reveal";
import { SPRINGS } from "@/components/motion/MotionPresets";
import { cn } from "@/lib/utils";
import type { CardAccent, SocialChannel } from "@/types/creatorly";

interface HeroPreviewItem {
  id: string;
  platform: SocialChannel;
  label: string;
  headline: string;
  metric: string;
  accent: CardAccent;
  baseRotate: number;
  baseY: number;
}

const HERO_DECK: HeroPreviewItem[] = [
  {
    id: "deck-ig",
    platform: "instagram",
    label: "Carousel · 7 Slides",
    headline: "Design for pauses, not passive scrolls.",
    metric: "95 Hook Score",
    accent: "coral",
    baseRotate: -4,
    baseY: 0,
  },
  {
    id: "deck-tt",
    platform: "tiktok",
    label: "Vertical Reel · 38s",
    headline: "One messy voice memo -> 4 native drops.",
    metric: "+68K Est. Reach",
    accent: "mint",
    baseRotate: 3,
    baseY: 14,
  },
  {
    id: "deck-x",
    platform: "x",
    label: "Thread · 6 Notes",
    headline: "Taste is the loudest distribution moat.",
    metric: "3.2x Save Rate",
    accent: "indigo",
    baseRotate: -1.5,
    baseY: 28,
  },
];

interface HeroStageProps {
  onExplorePlayground: () => void;
  onSurpriseSpark: () => void;
}

/**
 * Expressive editorial hero paired with an interactive floating card deck.
 */
export function HeroStage({
  onExplorePlayground,
  onSurpriseSpark,
}: HeroStageProps) {
  const [focusedCardId, setFocusedCardId] = useState<string>("deck-ig");

  return (
    <section className="relative overflow-hidden pt-10 pb-16 sm:pt-14 sm:pb-24">
      {/* Ambient creative aura */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[560px] bg-studio-dots opacity-55 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_78%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 top-12 -z-10 h-80 w-80 rounded-full bg-coral/18 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-0 top-8 -z-10 h-96 w-96 rounded-full bg-indigo/15 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-44 -z-10 h-64 w-64 -translate-x-1/2 rounded-full bg-mint/18 blur-3xl"
      />

      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-12 lg:gap-10">
        {/* Left editorial typography */}
        <div className="lg:col-span-7">
          <Reveal immediate delay={0.02}>
            <div className="mb-5 flex flex-wrap items-center gap-2.5">
              <Badge variant="coral" pulse>
                AI Creative Studio
              </Badge>
              <Badge variant="cream" className="font-mono text-[11px]">
                5 Native Formats · Zero Blank Pages
              </Badge>
            </div>
          </Reveal>

          <Reveal immediate delay={0.08}>
            <h1 className="font-display text-[clamp(2.5rem,5.6vw,4.65rem)] font-extrabold leading-[0.98] tracking-tight text-ink">
              Make social stories{" "}
              <span className="relative inline-block whitespace-nowrap">
                <span className="relative z-10 text-coral">impossible</span>
                <svg
                  aria-hidden="true"
                  viewBox="0 0 220 18"
                  className="absolute -bottom-1.5 left-0 -z-0 h-3.5 w-full text-coral/30"
                  fill="none"
                >
                  <path
                    d="M3 13C58 4 152 3 217 11"
                    stroke="currentColor"
                    strokeWidth="6"
                    strokeLinecap="round"
                  />
                </svg>
              </span>{" "}
              to scroll past.
            </h1>
          </Reveal>

          <Reveal immediate delay={0.14}>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-ink-secondary sm:text-lg">
              Creatorly turns one rough spark into platform-native carousels,
              short-form scripts, and punchy threads—styled with your voice,
              scored for retention, and ready to remix on a tactile canvas.
            </p>
          </Reveal>

          <Reveal immediate delay={0.2}>
            <div className="mt-8 flex flex-wrap items-center gap-3.5">
              <Button
                variant="coral"
                size="lg"
                onClick={onExplorePlayground}
              >
                <Sparkles className="h-4 w-4" />
                <span>Try Live AI Playground</span>
                <ArrowDownRight className="h-4 w-4" />
              </Button>

              <Button variant="glass" size="lg" onClick={onSurpriseSpark}>
                <Shuffle className="h-4 w-4 text-indigo" />
                <span>Surprise Me</span>
              </Button>
            </div>
          </Reveal>

          {/* Expressive studio ticker pills */}
          <Reveal immediate delay={0.26}>
            <div className="mt-10 flex flex-wrap items-center gap-3 text-xs font-semibold text-ink-secondary">
              <div className="inline-flex items-center gap-2 rounded-2xl border border-black/[0.07] bg-white/85 px-3.5 py-2 shadow-sm">
                <Flame className="h-4 w-4 text-coral" />
                <span>Live hook scoring</span>
              </div>
              <div className="inline-flex items-center gap-2 rounded-2xl border border-black/[0.07] bg-white/85 px-3.5 py-2 shadow-sm">
                <Zap className="h-4 w-4 text-indigo" />
                <span>4 instant tone dials</span>
              </div>
              <div className="inline-flex items-center gap-2 rounded-2xl border border-black/[0.07] bg-white/85 px-3.5 py-2 shadow-sm">
                <TrendingUp className="h-4 w-4 text-mint-deep" />
                <span>Native format framing</span>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Right interactive floating deck */}
        <div className="relative lg:col-span-5">
          <Reveal immediate delay={0.16}>
            <div className="relative mx-auto max-w-md pt-4 pb-6">
              {/* Tilted floating sticker accents */}
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{
                  duration: 4.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute -top-2 right-3 z-30 -rotate-3 rounded-2xl border border-mint/40 bg-mint-soft px-3 py-1.5 font-mono text-[11px] font-semibold text-mint-deep shadow-float"
              >
                +41% 3s Hold
              </motion.div>

              <motion.div
                animate={{ y: [0, 6, 0] }}
                transition={{
                  duration: 5.2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute -bottom-1 left-2 z-30 rotate-2 rounded-2xl border border-violet/25 bg-violet-soft px-3 py-1.5 font-mono text-[11px] font-semibold text-[#7e22ce] shadow-float"
              >
                Click any card to focus
              </motion.div>

              <div className="relative space-y-3.5">
                {HERO_DECK.map((item, idx) => {
                  const isFocused = focusedCardId === item.id;
                  const accent = ACCENT_SURFACE_MAP[item.accent];

                  return (
                    <motion.button
                      key={item.id}
                      type="button"
                      onClick={() => setFocusedCardId(item.id)}
                      onMouseEnter={() => setFocusedCardId(item.id)}
                      animate={{
                        scale: isFocused ? 1.03 : 0.98,
                        rotate: isFocused ? 0 : item.baseRotate,
                        x: isFocused ? 0 : idx % 2 === 0 ? -6 : 6,
                      }}
                      whileTap={{ scale: 0.97 }}
                      transition={SPRINGS.bouncy}
                      className={cn(
                        "relative w-full text-left rounded-3xl border bg-white p-5 transition-shadow cursor-pointer",
                        isFocused
                          ? "z-20 border-black/[0.14] shadow-float-lg"
                          : "z-10 border-black/[0.08] shadow-float opacity-90 hover:opacity-100"
                      )}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span
                          className={cn(
                            "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold",
                            accent.softBg,
                            accent.text,
                            accent.border
                          )}
                        >
                          <PlatformIcon platform={item.platform} />
                          <span>{item.label}</span>
                        </span>
                        <span className="font-mono text-[11px] font-semibold text-ink-muted">
                          {item.metric}
                        </span>
                      </div>

                      <p className="mt-3 font-display text-lg font-bold leading-snug text-ink sm:text-xl">
                        {item.headline}
                      </p>

                      <div className="mt-3 flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={cn("h-2 w-2 rounded-full", accent.solidBg)}
                          />
                          <span className="text-xs font-medium text-ink-muted">
                            {isFocused ? "Active focus" : "Tap to bring forward"}
                          </span>
                        </div>
                        <span
                          className={cn(
                            "h-1.5 w-14 rounded-full bg-gradient-to-r",
                            accent.gradientBg
                          )}
                        />
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
