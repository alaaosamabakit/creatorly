"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Calendar, Flame, Palette, Sliders, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { ACCENT_SURFACE_MAP, PlatformIcon } from "@/components/ui/PlatformIcon";
import { Reveal } from "@/components/motion/Reveal";
import { SPRINGS } from "@/components/motion/MotionPresets";
import {
  HOOK_LAB_OPTIONS,
  PLATFORM_META,
  WEEKLY_CADENCE,
} from "@/data/mockStudioData";
import { cn } from "@/lib/utils";
import type { CardAccent } from "@/types/creatorly";

const VOICE_SAMPLES = [
  {
    level: "Punchy",
    text: "Skip the 10-slide intro. Lead with tension, prove it in 12 seconds, and let the visual do the flexing.",
  },
  {
    level: "Balanced",
    text: "Great social stories feel effortless because the structure is sharp—one bold opener, real craft details, and room to breathe.",
  },
  {
    level: "Poetic",
    text: "Every frame is a quiet invitation: slow the thumb down with warmth, rhythm, and a point of view only you could make.",
  },
];

const BRAND_SWATCHES: {
  id: CardAccent;
  name: string;
  hex: string;
  vibe: string;
}[] = [
  { id: "coral", name: "Electric Coral", hex: "#FF5C35", vibe: "Hero Hooks" },
  { id: "indigo", name: "Cobalt Indigo", hex: "#4F46E5", vibe: "Deep Threads" },
  { id: "mint", name: "Acid Mint", hex: "#10D98E", vibe: "Live Wins" },
  { id: "violet", name: "Ultraviolet", hex: "#A855F7", vibe: "Remix Drops" },
];

/**
 * Interactive non-dashboard Studio Lab showcasing Hook Lab, Weekly Rhythm, and Brand DNA.
 */
export function CreativeBento() {
  const [selectedHookId, setSelectedHookId] = useState(HOOK_LAB_OPTIONS[0].id);
  const [selectedDayIndex, setSelectedDayIndex] = useState(1);
  const [voiceIndex, setVoiceIndex] = useState(1);
  const [activeSwatch, setActiveSwatch] = useState<CardAccent>("coral");

  const currentHook =
    HOOK_LAB_OPTIONS.find((h) => h.id === selectedHookId) ??
    HOOK_LAB_OPTIONS[0];
  const currentDay = WEEKLY_CADENCE[selectedDayIndex] ?? WEEKLY_CADENCE[0];
  const currentSwatchAccent = ACCENT_SURFACE_MAP[activeSwatch];

  return (
    <section
      id="studio-lab"
      className="mx-auto mt-20 w-full max-w-6xl scroll-mt-24 px-4 sm:px-6"
    >
      <Reveal>
        <div className="mb-8 flex flex-col justify-between gap-3 md:flex-row md:items-end">
          <div>
            <Badge variant="violet" className="mb-2">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Studio Lab</span>
            </Badge>
            <h3 className="font-display text-3xl font-extrabold text-ink sm:text-4xl">
              Craft your rhythm, hooks & brand signature.
            </h3>
          </div>
          <p className="max-w-md text-sm text-ink-secondary">
            Every piece of Creatorly is built to feel tactile and musical—test
            openers, tune your voice dial, and preview weekly flow.
          </p>
        </div>
      </Reveal>

      <div className="grid gap-6 lg:grid-cols-12">
        {/* Card 1: Interactive AI Hook Lab */}
        <Reveal delay={0.05} className="lg:col-span-7">
          <div className="flex h-full flex-col justify-between rounded-[2rem] border border-black/[0.08] bg-white p-6 shadow-float sm:p-7">
            <div>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="inline-flex items-center gap-2">
                  <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-coral-soft text-coral">
                    <Flame className="h-4 w-4" />
                  </span>
                  <div>
                    <h4 className="font-display text-lg font-bold text-ink">
                      AI Hook Lab
                    </h4>
                    <p className="text-xs text-ink-muted">
                      Switch opener styles to compare retention score
                    </p>
                  </div>
                </div>

                <Badge variant={currentHook.accent} className="font-mono">
                  {currentHook.retentionBoost}
                </Badge>
              </div>

              {/* Hook style selector tabs */}
              <div className="mt-5 flex flex-wrap gap-2">
                {HOOK_LAB_OPTIONS.map((option) => {
                  const isActive = option.id === selectedHookId;
                  return (
                    <motion.button
                      key={option.id}
                      type="button"
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedHookId(option.id)}
                      className={cn(
                        "rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors cursor-pointer",
                        isActive
                          ? "border-ink bg-ink text-white"
                          : "border-black/[0.08] bg-oat/70 text-ink-secondary hover:text-ink"
                      )}
                    >
                      {option.styleLabel}
                    </motion.button>
                  );
                })}
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={currentHook.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.22 }}
                  className="mt-5 rounded-3xl border border-black/[0.07] bg-cream/85 p-5"
                >
                  <p className="font-display text-xl font-bold leading-snug text-ink sm:text-2xl">
                    “{currentHook.hookText}”
                  </p>
                  <p className="mt-2.5 text-sm text-ink-secondary">
                    {currentHook.breakdown}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Animated Hook Score bar */}
            <div className="mt-6">
              <div className="mb-2 flex items-center justify-between text-xs font-semibold">
                <span className="font-mono uppercase tracking-wider text-ink-muted">
                  Predicted Thumb-Stop Score
                </span>
                <span className="font-mono text-sm font-bold text-ink">
                  {currentHook.score}/100
                </span>
              </div>
              <div className="h-3 w-full overflow-hidden rounded-full bg-oat">
                <motion.div
                  animate={{ width: `${currentHook.score}%` }}
                  transition={SPRINGS.bouncy}
                  className={cn(
                    "h-full rounded-full bg-gradient-to-r",
                    ACCENT_SURFACE_MAP[currentHook.accent].gradientBg
                  )}
                />
              </div>
            </div>
          </div>
        </Reveal>

        {/* Card 2: Brand Palette & Voice DNA */}
        <Reveal delay={0.1} className="lg:col-span-5">
          <div className="flex h-full flex-col justify-between rounded-[2rem] border border-black/[0.08] bg-white p-6 shadow-float sm:p-7">
            <div>
              <div className="flex items-center justify-between gap-2">
                <div className="inline-flex items-center gap-2">
                  <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-indigo-soft text-indigo">
                    <Palette className="h-4 w-4" />
                  </span>
                  <div>
                    <h4 className="font-display text-lg font-bold text-ink">
                      Brand Voice & Palette
                    </h4>
                    <p className="text-xs text-ink-muted">
                      Live swatch + tone dial preview
                    </p>
                  </div>
                </div>
              </div>

              {/* Interactive Swatch Chips */}
              <div className="mt-5 grid grid-cols-2 gap-2.5">
                {BRAND_SWATCHES.map((swatch) => {
                  const isActive = swatch.id === activeSwatch;
                  return (
                    <motion.button
                      key={swatch.id}
                      type="button"
                      whileTap={{ scale: 0.96 }}
                      onClick={() => setActiveSwatch(swatch.id)}
                      className={cn(
                        "flex items-center gap-2.5 rounded-2xl border p-2.5 text-left transition-all cursor-pointer",
                        isActive
                          ? "border-ink bg-cream shadow-sm"
                          : "border-black/[0.07] bg-white hover:bg-cream/60"
                      )}
                    >
                      <span
                        className="h-7 w-7 shrink-0 rounded-xl shadow-inner"
                        style={{ backgroundColor: swatch.hex }}
                      />
                      <span className="min-w-0">
                        <span className="block truncate text-xs font-bold text-ink">
                          {swatch.name}
                        </span>
                        <span className="block font-mono text-[10px] text-ink-muted">
                          {swatch.vibe}
                        </span>
                      </span>
                    </motion.button>
                  );
                })}
              </div>

              {/* Voice Dial */}
              <div className="mt-5 rounded-3xl border border-black/[0.07] bg-cream/85 p-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5 font-mono text-[11px] font-semibold uppercase tracking-wider text-ink-muted">
                    <Sliders className="h-3.5 w-3.5" />
                    Voice Dial
                  </span>
                  <div className="flex gap-1">
                    {VOICE_SAMPLES.map((sample, idx) => (
                      <button
                        key={sample.level}
                        type="button"
                        onClick={() => setVoiceIndex(idx)}
                        className={cn(
                          "rounded-full px-2.5 py-0.5 text-[11px] font-semibold transition-colors cursor-pointer",
                          voiceIndex === idx
                            ? cn(currentSwatchAccent.solidBg, "text-white")
                            : "bg-white text-ink-secondary hover:text-ink"
                        )}
                      >
                        {sample.level}
                      </button>
                    ))}
                  </div>
                </div>

                <AnimatePresence mode="wait">
                  <motion.p
                    key={`${voiceIndex}-${activeSwatch}`}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.2 }}
                    className="mt-3 text-sm leading-relaxed text-ink"
                  >
                    “{VOICE_SAMPLES[voiceIndex].text}”
                  </motion.p>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Card 3: Weekly Creative Cadence Bubbles (full-width tactile strip) */}
        <Reveal delay={0.14} className="lg:col-span-12">
          <div className="relative overflow-hidden rounded-[2rem] border border-black/[0.08] bg-white p-6 shadow-float sm:p-7">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
              <div className="inline-flex items-center gap-2.5">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-mint-soft text-mint-deep">
                  <Calendar className="h-4 w-4" />
                </span>
                <div>
                  <h4 className="font-display text-lg font-bold text-ink">
                    Creative Flow Cadence
                  </h4>
                  <p className="text-xs text-ink-muted">
                    Tap any day bubble to inspect your multi-platform drop
                    rhythm
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {WEEKLY_CADENCE.map((item, idx) => {
                  const isActive = idx === selectedDayIndex;
                  const accent = ACCENT_SURFACE_MAP[item.accent];
                  return (
                    <motion.button
                      key={item.day}
                      type="button"
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.94 }}
                      transition={SPRINGS.snappy}
                      onClick={() => setSelectedDayIndex(idx)}
                      className={cn(
                        "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-bold transition-all cursor-pointer",
                        isActive
                          ? "border-ink bg-ink text-white shadow-sm"
                          : "border-black/[0.08] bg-cream text-ink hover:bg-oat"
                      )}
                    >
                      <span
                        className={cn("h-2 w-2 rounded-full", accent.solidBg)}
                      />
                      <span>{item.shortDay}</span>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={currentDay.day}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="mt-6 flex flex-col justify-between gap-4 rounded-3xl border border-black/[0.07] bg-cream/80 p-5 sm:flex-row sm:items-center"
              >
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant={currentDay.accent}>
                      <PlatformIcon platform={currentDay.platform} />
                      <span>{PLATFORM_META[currentDay.platform].label}</span>
                    </Badge>
                    <span className="font-mono text-xs font-semibold text-ink-muted">
                      {currentDay.day} · {currentDay.time}
                    </span>
                  </div>
                  <p className="font-display text-xl font-bold text-ink">
                    {currentDay.title}
                  </p>
                </div>

                <div className="w-full sm:w-56">
                  <div className="mb-1.5 flex items-center justify-between font-mono text-[11px] font-semibold text-ink-muted">
                    <span>Audience Momentum</span>
                    <span className="text-ink">{currentDay.energy}%</span>
                  </div>
                  <div className="h-2.5 w-full overflow-hidden rounded-full bg-white">
                    <motion.div
                      animate={{ width: `${currentDay.energy}%` }}
                      transition={SPRINGS.bouncy}
                      className={cn(
                        "h-full rounded-full bg-gradient-to-r",
                        ACCENT_SURFACE_MAP[currentDay.accent].gradientBg
                      )}
                    />
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
