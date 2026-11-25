"use client";

import {
  Clock,
  FileText,
  Palette,
  Sparkles,
  Type,
  Video,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { CAPTION_STYLES, REEL_GRADIENTS } from "@/data/reelsStore";
import { cn } from "@/lib/utils";
import type {
  CaptionStyleId,
  MediaAssetView,
  ReelGradientId,
  ReelScene,
} from "@/types/reels";

interface ReelsSceneEditorProps {
  scene: ReelScene;
  sceneIndex: number;
  captionStyle: CaptionStyleId;
  assignedAsset: MediaAssetView | null;
  onUpdateScene: (patch: Partial<ReelScene>) => void;
  onUpdateCaptionStyle: (style: CaptionStyleId) => void;
}

/**
 * Script, on-screen captions, timing, visual description, and backdrop editor for the active scene.
 */
export function ReelsSceneEditor({
  scene,
  sceneIndex,
  captionStyle,
  assignedAsset,
  onUpdateScene,
  onUpdateCaptionStyle,
}: ReelsSceneEditorProps) {
  const estimatedSpeechSec = Math.max(
    1,
    Math.round(scene.scriptText.trim().split(/\s+/).filter(Boolean).length / 2.4)
  );

  return (
    <div className="space-y-5 rounded-[2.1rem] border border-black/[0.08] bg-white p-5 shadow-float sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-black/[0.06] pb-4">
        <div className="flex items-center gap-2">
          <Badge variant="indigo">Scene 0{sceneIndex + 1}</Badge>
          <h3 className="font-display text-lg font-extrabold text-ink">
            Script, Captions & Visual Beat
          </h3>
        </div>
        <span className="font-mono text-[11px] font-semibold text-ink-muted">
          ~{estimatedSpeechSec}s spoken pace
        </span>
      </div>

      {/* Scene Title + Duration */}
      <div className="grid gap-4 sm:grid-cols-12">
        <div className="sm:col-span-8">
          <label
            htmlFor="scene-title-input"
            className="mb-1.5 block font-mono text-[11px] font-semibold uppercase tracking-wider text-ink-muted"
          >
            Scene Title
          </label>
          <input
            id="scene-title-input"
            type="text"
            value={scene.title}
            onChange={(e) => onUpdateScene({ title: e.target.value })}
            className="w-full rounded-2xl border border-black/[0.09] bg-cream/70 px-3.5 py-2 text-sm font-semibold text-ink focus:border-indigo focus:bg-white focus:outline-none"
          />
        </div>

        <div className="sm:col-span-4">
          <label
            htmlFor="scene-duration-input"
            className="mb-1.5 inline-flex items-center gap-1 font-mono text-[11px] font-semibold uppercase tracking-wider text-ink-muted"
          >
            <Clock className="h-3 w-3 text-coral" />
            Duration (sec)
          </label>
          <div className="flex items-center gap-2">
            <input
              id="scene-duration-input"
              type="number"
              min={1}
              max={60}
              value={scene.durationSec}
              onChange={(e) => {
                const val = Number(e.target.value);
                if (!Number.isNaN(val)) {
                  onUpdateScene({
                    durationSec: Math.min(60, Math.max(1, val)),
                  });
                }
              }}
              className="w-full rounded-2xl border border-black/[0.09] bg-cream/70 px-3.5 py-2 font-mono text-sm font-bold text-ink focus:border-coral focus:bg-white focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Script / Voiceover */}
      <div className="rounded-2xl border border-black/[0.07] bg-cream/65 p-4">
        <div className="mb-1.5 flex items-center justify-between">
          <label
            htmlFor="scene-script-input"
            className="inline-flex items-center gap-1.5 font-mono text-[11px] font-semibold uppercase tracking-wider text-ink-muted"
          >
            <FileText className="h-3.5 w-3.5 text-indigo" />
            Script / Voiceover
          </label>
          <span className="font-mono text-[11px] text-ink-muted">
            {scene.scriptText.length} chars
          </span>
        </div>
        <textarea
          id="scene-script-input"
          rows={3}
          value={scene.scriptText}
          onChange={(e) => onUpdateScene({ scriptText: e.target.value })}
          placeholder="What is spoken or narrated during this scene..."
          className="w-full resize-y rounded-xl border border-black/[0.08] bg-white px-3.5 py-2.5 text-sm leading-relaxed text-ink focus:border-indigo focus:outline-none"
        />
      </div>

      {/* On-screen text + Caption Style */}
      <div className="rounded-2xl border border-coral/20 bg-coral-soft/40 p-4 space-y-3.5">
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label
              htmlFor="scene-caption-input"
              className="inline-flex items-center gap-1.5 font-mono text-[11px] font-semibold uppercase tracking-wider text-[#c93714]"
            >
              <Type className="h-3.5 w-3.5" />
              On-Screen Caption
            </label>
            <span className="font-mono text-[11px] text-[#c93714]">
              {scene.onScreenText.length}/90 chars
            </span>
          </div>
          <input
            id="scene-caption-input"
            type="text"
            value={scene.onScreenText}
            onChange={(e) => onUpdateScene({ onScreenText: e.target.value })}
            placeholder="Bold on-screen hook or subtitle..."
            className="w-full rounded-xl border border-black/[0.08] bg-white px-3.5 py-2.5 font-display text-base font-bold text-ink focus:border-coral focus:outline-none"
          />
        </div>

        <div>
          <span className="mb-2 inline-flex items-center gap-1.5 font-mono text-[11px] font-semibold uppercase tracking-wider text-ink-muted">
            <Sparkles className="h-3 w-3 text-coral" />
            Caption Style (Project-wide)
          </span>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {CAPTION_STYLES.map((style) => {
              const active = captionStyle === style.id;
              return (
                <button
                  key={style.id}
                  type="button"
                  title={style.description}
                  onClick={() => onUpdateCaptionStyle(style.id)}
                  className={cn(
                    "rounded-xl border px-3 py-2 text-left text-xs font-semibold transition-all cursor-pointer",
                    active
                      ? "border-ink bg-ink text-white shadow-xs"
                      : "border-black/[0.08] bg-white text-ink-secondary hover:text-ink"
                  )}
                >
                  {style.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Visual Description + Backdrop / Media Selection */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor="scene-visual-input"
            className="mb-1.5 block font-mono text-[11px] font-semibold uppercase tracking-wider text-ink-muted"
          >
            Visual Direction
          </label>
          <textarea
            id="scene-visual-input"
            rows={3}
            value={scene.visualDescription}
            onChange={(e) =>
              onUpdateScene({ visualDescription: e.target.value })
            }
            placeholder="Camera angle, cut rhythm, or props..."
            className="w-full resize-none rounded-2xl border border-black/[0.09] bg-cream/70 px-3.5 py-2.5 text-xs leading-relaxed text-ink focus:border-indigo focus:bg-white focus:outline-none"
          />
        </div>

        <div className="space-y-3">
          <div>
            <span className="mb-1.5 inline-flex items-center gap-1.5 font-mono text-[11px] font-semibold uppercase tracking-wider text-ink-muted">
              <Palette className="h-3.5 w-3.5 text-violet" />
              Backdrop Gradient
            </span>
            <div className="flex flex-wrap gap-2">
              {REEL_GRADIENTS.map((grad) => {
                const isSelected = scene.gradientId === grad.id;
                return (
                  <button
                    key={grad.id}
                    type="button"
                    title={grad.label}
                    aria-label={`Select ${grad.label} gradient`}
                    onClick={() =>
                      onUpdateScene({ gradientId: grad.id as ReelGradientId })
                    }
                    className={cn(
                      "h-8 w-8 rounded-full bg-gradient-to-br transition-transform cursor-pointer",
                      grad.bgClass,
                      isSelected
                        ? "scale-110 ring-2 ring-ink ring-offset-2"
                        : "opacity-80 hover:opacity-100"
                    )}
                  />
                );
              })}
            </div>
          </div>

          <div className="rounded-2xl border border-black/[0.08] bg-cream/70 p-3">
            <span className="block font-mono text-[10px] font-semibold uppercase tracking-wider text-ink-muted">
              Assigned Local Media
            </span>
            {assignedAsset ? (
              <div className="mt-1.5 flex items-center justify-between gap-2">
                <span className="inline-flex min-w-0 items-center gap-1.5 text-xs font-semibold text-mint-deep">
                  <Video className="h-3.5 w-3.5 shrink-0" />
                  <span className="truncate">{assignedAsset.name}</span>
                </span>
                <button
                  type="button"
                  onClick={() => onUpdateScene({ mediaAssetId: null })}
                  className="inline-flex items-center gap-1 rounded-full bg-white px-2 py-0.5 text-[11px] font-semibold text-ink-secondary hover:text-[#c93714] cursor-pointer"
                >
                  <X className="h-3 w-3" />
                  Clear
                </button>
              </div>
            ) : (
              <p className="mt-1 text-xs text-ink-muted">
                Using gradient backdrop. Assign an image or video from the Media
                Library below.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
