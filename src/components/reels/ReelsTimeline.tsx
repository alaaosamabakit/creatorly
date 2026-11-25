"use client";

import { useState } from "react";
import { motion } from "motion/react";
import {
  ArrowLeft,
  ArrowRight,
  Clock,
  CopyPlus,
  Film,
  GripVertical,
  Plus,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { SPRINGS } from "@/components/motion/MotionPresets";
import { REEL_GRADIENTS } from "@/data/reelsStore";
import { cn } from "@/lib/utils";
import type { MediaAssetView, ReelScene } from "@/types/reels";

interface ReelsTimelineProps {
  scenes: ReelScene[];
  activeSceneId: string;
  targetDurationSec: number;
  assets: MediaAssetView[];
  onSelectScene: (sceneId: string) => void;
  onAddScene: () => void;
  onDuplicateScene: (sceneId: string) => void;
  onDeleteScene: (sceneId: string) => void;
  onReorderScenes: (fromIndex: number, toIndex: number) => void;
}

/**
 * Proportional visual scene timeline with drag-and-drop & directional reordering.
 */
export function ReelsTimeline({
  scenes,
  activeSceneId,
  targetDurationSec,
  assets,
  onSelectScene,
  onAddScene,
  onDuplicateScene,
  onDeleteScene,
  onReorderScenes,
}: ReelsTimelineProps) {
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);

  const totalDuration = scenes.reduce((sum, s) => sum + s.durationSec, 0);
  const durationDelta = totalDuration - targetDurationSec;

  return (
    <div className="rounded-[2.1rem] border border-black/[0.08] bg-white/95 p-5 shadow-float sm:p-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-ink-muted">
            Scene Timeline
          </span>
          <div className="mt-1 flex flex-wrap items-center gap-2.5">
            <h2 className="font-display text-xl font-extrabold text-ink">
              {scenes.length} {scenes.length === 1 ? "Scene" : "Scenes"}
            </h2>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-oat px-3 py-1 font-mono text-xs font-bold text-ink">
              <Clock className="h-3.5 w-3.5 text-coral" />
              {totalDuration}s / {targetDurationSec}s target
            </span>
            <span
              className={cn(
                "rounded-full px-2.5 py-0.5 font-mono text-[11px] font-semibold",
                durationDelta === 0
                  ? "bg-mint-soft text-mint-deep"
                  : durationDelta > 0
                    ? "bg-coral-soft text-[#c93714]"
                    : "bg-indigo-soft text-indigo"
              )}
            >
              {durationDelta === 0
                ? "Exact match"
                : durationDelta > 0
                  ? `+${durationDelta}s over`
                  : `${Math.abs(durationDelta)}s spare`}
            </span>
          </div>
        </div>

        <Button variant="ink" size="sm" onClick={onAddScene}>
          <Plus className="h-3.5 w-3.5" />
          <span>Add Scene</span>
        </Button>
      </div>

      {/* Proportional visual duration ribbon */}
      <div className="mt-4 flex h-3.5 w-full overflow-hidden rounded-full bg-oat p-0.5">
        {scenes.map((scene) => {
          const gradient =
            REEL_GRADIENTS.find((g) => g.id === scene.gradientId) ??
            REEL_GRADIENTS[0];
          const isActive = scene.id === activeSceneId;
          const widthPct =
            totalDuration > 0
              ? Math.max((scene.durationSec / totalDuration) * 100, 6)
              : 100 / scenes.length;

          return (
            <button
              key={scene.id}
              type="button"
              onClick={() => onSelectScene(scene.id)}
              title={`${scene.title} (${scene.durationSec}s)`}
              style={{ width: `${widthPct}%` }}
              className={cn(
                "mx-0.5 h-full rounded-full bg-gradient-to-r transition-all cursor-pointer",
                gradient.bgClass,
                isActive ? "ring-2 ring-ink ring-offset-1" : "opacity-75 hover:opacity-100"
              )}
            />
          );
        })}
      </div>

      {/* Interactive scene strip */}
      <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {scenes.map((scene, index) => {
          const isActive = scene.id === activeSceneId;
          const gradient =
            REEL_GRADIENTS.find((g) => g.id === scene.gradientId) ??
            REEL_GRADIENTS[0];
          const assignedMedia = scene.mediaAssetId
            ? assets.find((a) => a.id === scene.mediaAssetId)
            : null;
          const isDropTarget = overIndex === index && dragIndex !== index;

          return (
            <div
              key={scene.id}
              draggable
              onDragStart={(e) => {
                e.dataTransfer.effectAllowed = "move";
                e.dataTransfer.setData("text/plain", String(index));
                setDragIndex(index);
              }}
              onDragOver={(e) => {
                e.preventDefault();
                if (overIndex !== index) setOverIndex(index);
              }}
              onDragLeave={() => {
                if (overIndex === index) setOverIndex(null);
              }}
              onDrop={(e) => {
                e.preventDefault();
                setOverIndex(null);
                const from =
                  dragIndex ?? Number(e.dataTransfer.getData("text/plain"));
                if (!Number.isNaN(from) && from !== index) {
                  onReorderScenes(from, index);
                }
                setDragIndex(null);
              }}
              onDragEnd={() => {
                setDragIndex(null);
                setOverIndex(null);
              }}
              className={cn(
                "group relative flex flex-col justify-between rounded-3xl border bg-cream/70 p-3.5 transition-all",
                isActive
                  ? "border-ink bg-white shadow-float ring-1 ring-ink/15"
                  : "border-black/[0.08] hover:border-black/20 hover:bg-white",
                isDropTarget && "border-indigo ring-2 ring-indigo/40"
              )}
            >
              {/* Top drag handle + duration */}
              <div className="flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => onSelectScene(scene.id)}
                  className="inline-flex items-center gap-1.5 text-left cursor-pointer"
                >
                  <GripVertical className="h-3.5 w-3.5 text-ink-muted" />
                  <span
                    className={cn(
                      "h-2.5 w-2.5 rounded-full bg-gradient-to-r",
                      gradient.bgClass
                    )}
                  />
                  <span className="font-mono text-[11px] font-bold text-ink-muted">
                    #{index + 1}
                  </span>
                </button>

                <span className="rounded-full bg-oat px-2.5 py-0.5 font-mono text-[11px] font-bold text-ink">
                  {scene.durationSec}s
                </span>
              </div>

              {/* Scene summary click area */}
              <motion.button
                type="button"
                whileTap={{ scale: 0.98 }}
                transition={SPRINGS.snappy}
                onClick={() => onSelectScene(scene.id)}
                className="mt-2.5 flex-1 text-left cursor-pointer"
              >
                <p className="line-clamp-1 font-display text-sm font-bold text-ink">
                  {scene.title}
                </p>
                <p className="mt-1 line-clamp-2 text-xs text-ink-secondary">
                  {scene.onScreenText || scene.scriptText}
                </p>
                {assignedMedia ? (
                  <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-mint-soft px-2 py-0.5 font-mono text-[10px] font-semibold text-mint-deep">
                    <Film className="h-3 w-3" />
                    <span className="max-w-[120px] truncate">
                      {assignedMedia.name}
                    </span>
                  </span>
                ) : null}
              </motion.button>

              {/* Reorder & scene actions */}
              <div className="mt-3 flex items-center justify-between gap-1 border-t border-black/[0.06] pt-2.5">
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    disabled={index === 0}
                    aria-label="Move scene earlier"
                    onClick={() => onReorderScenes(index, index - 1)}
                    className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-black/[0.08] bg-white text-ink-secondary hover:text-ink disabled:opacity-35 cursor-pointer disabled:cursor-not-allowed"
                  >
                    <ArrowLeft className="h-3 w-3" />
                  </button>
                  <button
                    type="button"
                    disabled={index === scenes.length - 1}
                    aria-label="Move scene later"
                    onClick={() => onReorderScenes(index, index + 1)}
                    className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-black/[0.08] bg-white text-ink-secondary hover:text-ink disabled:opacity-35 cursor-pointer disabled:cursor-not-allowed"
                  >
                    <ArrowRight className="h-3 w-3" />
                  </button>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    aria-label="Duplicate scene"
                    onClick={() => onDuplicateScene(scene.id)}
                    className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-black/[0.08] bg-white text-ink-secondary hover:text-ink cursor-pointer"
                  >
                    <CopyPlus className="h-3 w-3" />
                  </button>
                  <button
                    type="button"
                    disabled={scenes.length <= 1}
                    aria-label="Delete scene"
                    onClick={() => onDeleteScene(scene.id)}
                    className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-black/[0.08] bg-white text-ink-muted hover:border-coral/35 hover:text-[#c93714] disabled:opacity-35 cursor-pointer disabled:cursor-not-allowed"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
