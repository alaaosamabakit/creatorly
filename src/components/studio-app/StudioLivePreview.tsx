"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  Bookmark,
  ChevronLeft,
  ChevronRight,
  Heart,
  MessageCircle,
  Play,
  Share2,
  Sparkles,
  ThumbsUp,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { ACCENT_SURFACE_MAP, PlatformIcon } from "@/components/ui/PlatformIcon";
import { SPRINGS } from "@/components/motion/MotionPresets";
import { STUDIO_PLATFORMS } from "@/data/studioGenerator";
import { cn } from "@/lib/utils";
import type { GeneratedStudioContent } from "@/types/studio";

interface StudioLivePreviewProps {
  content: GeneratedStudioContent;
  isGenerating: boolean;
}

/**
 * Interactive platform- and format-aware live social preview frame.
 */
export function StudioLivePreview({
  content,
  isGenerating,
}: StudioLivePreviewProps) {
  const [slideIndex, setSlideIndex] = useState(0);
  const [beatIndex, setBeatIndex] = useState(0);

  const platformMeta =
    STUDIO_PLATFORMS.find((p) => p.id === content.platform) ??
    STUDIO_PLATFORMS[0];
  const accent = ACCENT_SURFACE_MAP[content.accent];

  const safeSlideIndex = slideIndex % content.slides.length;
  const activeSlide = content.slides[safeSlideIndex] ?? content.slides[0];
  const safeBeatIndex = beatIndex % content.reelBeats.length;
  const activeBeat = content.reelBeats[safeBeatIndex] ?? content.reelBeats[0];

  return (
    <div className="relative rounded-[2.1rem] border border-black/[0.08] bg-white p-5 shadow-float-lg sm:p-6">
      {/* Header chrome */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Badge variant={content.accent}>
            <PlatformIcon platform={content.platform} />
            <span>{platformMeta.label} Live Preview</span>
          </Badge>
          <span className="rounded-full bg-oat px-2.5 py-1 font-mono text-[11px] font-semibold uppercase text-ink">
            {content.format}
          </span>
        </div>

        <span className="font-mono text-[11px] font-semibold text-ink-muted">
          {platformMeta.audienceHint}
        </span>
      </div>

      {/* Loading overlay state */}
      <AnimatePresence mode="wait">
        {isGenerating ? (
          <motion.div
            key="preview-loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex min-h-[430px] flex-col items-center justify-center rounded-3xl border border-dashed border-coral/35 bg-cream/70 p-8 text-center"
          >
            <motion.div
              animate={{ rotate: 360, scale: [1, 1.1, 1] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "linear" }}
              className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-coral via-violet to-indigo text-white shadow-coral-glow"
            >
              <Sparkles className="h-6 w-6" />
            </motion.div>
            <p className="mt-4 font-display text-lg font-bold text-ink">
              Framing {platformMeta.label} {content.format}…
            </p>
            <p className="mt-1 text-xs text-ink-muted">
              Updating layout, hook emphasis & live pacing
            </p>
          </motion.div>
        ) : (
          <motion.div
            key={`${content.platform}-${content.format}`}
            initial={{ opacity: 0, y: 10, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.985 }}
            transition={SPRINGS.gentle}
          >
            {/* CAROUSEL PREVIEW */}
            {content.format === "carousel" ? (
              <div className="rounded-3xl border border-black/[0.08] bg-cream/75 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span
                      className={cn(
                        "flex h-8 w-8 items-center justify-center rounded-full text-white",
                        accent.solidBg
                      )}
                    >
                      <PlatformIcon platform={content.platform} />
                    </span>
                    <div>
                      <p className="text-xs font-bold text-ink">
                        {platformMeta.handle}
                      </p>
                      <p className="font-mono text-[10px] text-ink-muted">
                        Slide {activeSlide.slideNumber} of {content.slides.length}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      aria-label="Previous slide"
                      onClick={() =>
                        setSlideIndex(
                          (prev) =>
                            (prev - 1 + content.slides.length) %
                            content.slides.length
                        )
                      }
                      className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-black/[0.09] bg-white text-ink transition-colors hover:bg-oat cursor-pointer"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      aria-label="Next slide"
                      onClick={() =>
                        setSlideIndex(
                          (prev) => (prev + 1) % content.slides.length
                        )
                      }
                      className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-black/[0.09] bg-white text-ink transition-colors hover:bg-oat cursor-pointer"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Interactive Slide Card */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeSlide.slideNumber}
                    initial={{ opacity: 0, x: 18 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -18 }}
                    transition={SPRINGS.snappy}
                    className={cn(
                      "relative flex min-h-[250px] flex-col justify-between overflow-hidden rounded-2xl bg-gradient-to-br p-6 text-white shadow-float",
                      accent.gradientBg
                    )}
                  >
                    <div className="flex items-center justify-between text-[11px] font-mono font-semibold uppercase tracking-wider text-white/85">
                      <span>{activeSlide.kicker}</span>
                      <span>
                        0{activeSlide.slideNumber}/0{content.slides.length}
                      </span>
                    </div>

                    <div className="my-4">
                      <h4 className="font-display text-2xl font-extrabold leading-tight">
                        {activeSlide.slideNumber === 1
                          ? content.hook
                          : activeSlide.headline}
                      </h4>
                      <p className="mt-2.5 text-sm leading-relaxed text-white/90">
                        {activeSlide.slideNumber === 1
                          ? content.visualSubtitle
                          : activeSlide.body}
                      </p>
                    </div>

                    <div className="flex items-center justify-between text-xs font-semibold text-white/85">
                      <span>{platformMeta.handle}</span>
                      <span>Swipe →</span>
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* Slide indicator dots */}
                <div className="mt-3 flex items-center justify-center gap-1.5">
                  {content.slides.map((slide, idx) => (
                    <button
                      key={slide.slideNumber}
                      type="button"
                      aria-label={`Jump to slide ${slide.slideNumber}`}
                      onClick={() => setSlideIndex(idx)}
                      className={cn(
                        "h-2 rounded-full transition-all cursor-pointer",
                        safeSlideIndex === idx
                          ? cn("w-6", accent.solidBg)
                          : "w-2 bg-black/15 hover:bg-black/30"
                      )}
                    />
                  ))}
                </div>

                {/* Caption & CTA below carousel */}
                <div className="mt-4 rounded-2xl border border-black/[0.06] bg-white p-4">
                  <p className="whitespace-pre-line text-xs leading-relaxed text-ink-secondary sm:text-sm">
                    {content.caption}
                  </p>
                  <p className="mt-2.5 text-xs font-semibold text-ink">
                    {content.cta}
                  </p>
                  <div className="mt-2.5 flex flex-wrap gap-1.5">
                    {content.hashtags.map((tag) => (
                      <span
                        key={tag}
                        className="font-mono text-[11px] font-medium text-indigo"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ) : null}

            {/* REEL / VERTICAL SHORT PREVIEW */}
            {content.format === "reel" ? (
              <div className="grid gap-4 rounded-3xl border border-black/[0.08] bg-cream/75 p-4 sm:grid-cols-12">
                {/* 9:16 Vertical Stage */}
                <div
                  className={cn(
                    "relative flex min-h-[340px] flex-col justify-between overflow-hidden rounded-[1.6rem] bg-gradient-to-br p-5 text-white shadow-float sm:col-span-7",
                    accent.gradientBg
                  )}
                >
                  <div className="flex items-center justify-between text-[11px] font-semibold">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-black/25 px-2.5 py-1 backdrop-blur-sm">
                      <Play className="h-3 w-3 fill-current" />
                      {platformMeta.label} Reel
                    </span>
                    <span className="rounded-full bg-black/25 px-2.5 py-1 font-mono">
                      {activeBeat.timecode}
                    </span>
                  </div>

                  {/* On-screen hook + beat cue */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeBeat.timecode}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.2 }}
                      className="my-auto py-4"
                    >
                      <span className="inline-block rounded-xl bg-white/95 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-ink">
                        On-Screen Text
                      </span>
                      <p className="mt-2.5 font-display text-xl font-extrabold leading-snug drop-shadow-sm">
                        “
                        {safeBeatIndex === 0
                          ? content.hook
                          : activeBeat.spokenLine}
                        ”
                      </p>
                      <p className="mt-2 rounded-xl bg-black/20 p-2.5 text-xs text-white/90 backdrop-blur-sm">
                        Visual: {activeBeat.visualCue}
                      </p>
                    </motion.div>
                  </AnimatePresence>

                  {/* Native bottom rail */}
                  <div className="flex items-end justify-between gap-2">
                    <div className="min-w-0">
                      <p className="truncate text-xs font-bold">
                        {platformMeta.handle}
                      </p>
                      <p className="truncate text-[11px] text-white/85">
                        {content.cta}
                      </p>
                    </div>
                    <div className="flex items-center gap-2.5 text-white/90">
                      <Heart className="h-4 w-4" />
                      <MessageCircle className="h-4 w-4" />
                      <Share2 className="h-4 w-4" />
                    </div>
                  </div>
                </div>

                {/* Beat timeline scrubber + caption */}
                <div className="flex flex-col justify-between gap-3 sm:col-span-5">
                  <div>
                    <p className="font-mono text-[11px] font-semibold uppercase tracking-wider text-ink-muted">
                      Scene Timeline
                    </p>
                    <div className="mt-2 space-y-2">
                      {content.reelBeats.map((beat, idx) => (
                        <button
                          key={beat.timecode}
                          type="button"
                          onClick={() => setBeatIndex(idx)}
                          className={cn(
                            "w-full rounded-2xl border p-2.5 text-left transition-all cursor-pointer",
                            safeBeatIndex === idx
                              ? "border-ink bg-white shadow-sm"
                              : "border-black/[0.06] bg-white/60 hover:bg-white"
                          )}
                        >
                          <span className="font-mono text-[10px] font-bold text-indigo">
                            {beat.timecode}
                          </span>
                          <p className="mt-0.5 line-clamp-2 text-xs font-semibold text-ink">
                            {beat.visualCue}
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-black/[0.06] bg-white p-3.5">
                    <p className="line-clamp-3 text-xs leading-relaxed text-ink-secondary">
                      {content.caption}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {content.hashtags.slice(0, 4).map((tag) => (
                        <span
                          key={tag}
                          className="font-mono text-[10px] font-medium text-coral"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : null}

            {/* SINGLE POST PREVIEW */}
            {content.format === "post" ? (
              <div className="rounded-3xl border border-black/[0.08] bg-cream/75 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span
                      className={cn(
                        "flex h-9 w-9 items-center justify-center rounded-full text-white",
                        accent.solidBg
                      )}
                    >
                      <PlatformIcon platform={content.platform} />
                    </span>
                    <div>
                      <p className="text-xs font-bold text-ink">
                        {platformMeta.handle}
                      </p>
                      <p className="font-mono text-[10px] text-ink-muted">
                        Just now · {platformMeta.label} Feed
                      </p>
                    </div>
                  </div>
                  <span className="rounded-full bg-white px-2.5 py-1 font-mono text-[10px] font-semibold text-ink-muted">
                    {content.hookScore}% Hook
                  </span>
                </div>

                {/* Editorial visual card */}
                <div
                  className={cn(
                    "relative overflow-hidden rounded-2xl bg-gradient-to-br p-6 text-white shadow-float",
                    accent.gradientBg
                  )}
                >
                  <span className="inline-block rounded-full bg-black/20 px-2.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-white/90">
                    {content.visualSubtitle}
                  </span>
                  <h4 className="mt-3 font-display text-2xl font-extrabold leading-tight">
                    {content.visualTitle}
                  </h4>
                  <p className="mt-2 text-sm text-white/90">
                    “{content.hook}”
                  </p>
                </div>

                {/* Feed text block */}
                <div className="mt-4 rounded-2xl border border-black/[0.06] bg-white p-4">
                  <p className="text-sm font-bold text-ink">{content.hook}</p>
                  <p className="mt-2 whitespace-pre-line text-xs leading-relaxed text-ink-secondary sm:text-sm">
                    {content.caption}
                  </p>
                  <p className="mt-2.5 text-xs font-semibold text-indigo">
                    {content.cta}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {content.hashtags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-cream px-2.5 py-0.5 font-mono text-[11px] text-ink-muted"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Platform native footer actions */}
                  <div className="mt-4 flex items-center justify-between border-t border-black/[0.06] pt-3 text-xs font-semibold text-ink-muted">
                    <span className="inline-flex items-center gap-1.5">
                      {content.platform === "facebook" ||
                      content.platform === "linkedin" ? (
                        <ThumbsUp className="h-3.5 w-3.5" />
                      ) : (
                        <Heart className="h-3.5 w-3.5" />
                      )}
                      React
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <MessageCircle className="h-3.5 w-3.5" />
                      Comment
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      {content.platform === "instagram" ? (
                        <Bookmark className="h-3.5 w-3.5" />
                      ) : (
                        <Share2 className="h-3.5 w-3.5" />
                      )}
                      {content.platform === "instagram" ? "Save" : "Share"}
                    </span>
                  </div>
                </div>
              </div>
            ) : null}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
