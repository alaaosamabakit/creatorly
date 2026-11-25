"use client";

import { useState } from "react";
import { motion } from "motion/react";
import {
  Check,
  Clapperboard,
  CopyPlus,
  FolderPlus,
  Pencil,
  RotateCcw,
  Trash2,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Pill } from "@/components/ui/Pill";
import { PlatformIcon } from "@/components/ui/PlatformIcon";
import { SPRINGS } from "@/components/motion/MotionPresets";
import { REEL_ASPECT_RATIOS, REEL_PLATFORMS } from "@/data/reelsStore";
import { cn } from "@/lib/utils";
import type {
  ReelAspectRatio,
  ReelPlatform,
  ReelProject,
} from "@/types/reels";

interface ReelsProjectBarProps {
  projects: ReelProject[];
  activeProject: ReelProject;
  onSelectProject: (id: string) => void;
  onCreateProject: () => void;
  onDuplicateProject: () => void;
  onDeleteProject: () => void;
  onResetSamples: () => void;
  onUpdateProject: (patch: Partial<ReelProject>) => void;
}

const TARGET_DURATIONS = [15, 30, 45, 60];

/**
 * Workspace project management bar for switching, renaming, creating, and configuring Reels.
 */
export function ReelsProjectBar({
  projects,
  activeProject,
  onSelectProject,
  onCreateProject,
  onDuplicateProject,
  onDeleteProject,
  onResetSamples,
  onUpdateProject,
}: ReelsProjectBarProps) {
  const [isRenaming, setIsRenaming] = useState(false);
  const [renameDraft, setRenameDraft] = useState(activeProject.title);

  const commitRename = () => {
    const trimmed = renameDraft.trim();
    if (trimmed) {
      onUpdateProject({ title: trimmed });
    }
    setIsRenaming(false);
  };

  return (
    <div className="space-y-4 rounded-[2.1rem] border border-black/[0.08] bg-white/95 p-5 shadow-float-lg sm:p-6">
      {/* Top row: Project selector + CRUD */}
      <div className="flex flex-col justify-between gap-4 border-b border-black/[0.06] pb-4 lg:flex-row lg:items-center">
        <div className="flex flex-wrap items-center gap-2.5">
          <Badge variant="mint" pulse>
            <Clapperboard className="h-3.5 w-3.5" />
            <span>Local Draft</span>
          </Badge>

          {isRenaming ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                commitRename();
              }}
              className="flex items-center gap-1.5"
            >
              <input
                type="text"
                autoFocus
                value={renameDraft}
                onChange={(e) => setRenameDraft(e.target.value)}
                onBlur={commitRename}
                aria-label="Reel project title"
                className="rounded-full border border-indigo bg-cream px-3.5 py-1.5 font-display text-base font-bold text-ink focus:outline-none"
              />
              <button
                type="submit"
                aria-label="Save title"
                className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-ink text-white cursor-pointer"
              >
                <Check className="h-3.5 w-3.5" />
              </button>
            </form>
          ) : (
            <div className="flex items-center gap-2">
              <label htmlFor="reel-project-select" className="sr-only">
                Active Reel project
              </label>
              <select
                id="reel-project-select"
                value={activeProject.id}
                onChange={(e) => onSelectProject(e.target.value)}
                className="max-w-[260px] rounded-full border border-black/[0.09] bg-cream px-4 py-1.5 font-display text-base font-bold text-ink focus:border-coral focus:outline-none sm:max-w-xs cursor-pointer"
              >
                {projects.map((proj) => (
                  <option key={proj.id} value={proj.id}>
                    {proj.title}
                  </option>
                ))}
              </select>

              <button
                type="button"
                aria-label="Rename project"
                onClick={() => {
                  setRenameDraft(activeProject.title);
                  setIsRenaming(true);
                }}
                className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-black/[0.08] bg-white text-ink-secondary transition-colors hover:bg-oat hover:text-ink cursor-pointer"
              >
                <Pencil className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button variant="coral" size="sm" onClick={onCreateProject}>
            <FolderPlus className="h-3.5 w-3.5" />
            <span>New Reel</span>
          </Button>
          <Button variant="outline" size="sm" onClick={onDuplicateProject}>
            <CopyPlus className="h-3.5 w-3.5" />
            <span>Duplicate</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onDeleteProject}
            className="text-[#c93714] hover:bg-coral-soft"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>Delete</span>
          </Button>
          <button
            type="button"
            onClick={onResetSamples}
            title="Restore sample Reel projects"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-black/[0.08] bg-cream text-ink-secondary transition-colors hover:bg-oat hover:text-ink cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Bottom row: Title input + Platform + Aspect Ratio + Target Duration */}
      <div className="grid gap-4 lg:grid-cols-12 lg:items-end">
        {/* Direct title edit */}
        <div className="lg:col-span-4">
          <label
            htmlFor="reel-title-input"
            className="mb-1.5 block font-mono text-[11px] font-semibold uppercase tracking-wider text-ink-muted"
          >
            Reel Title
          </label>
          <input
            id="reel-title-input"
            type="text"
            value={activeProject.title}
            onChange={(e) => onUpdateProject({ title: e.target.value })}
            placeholder="Name your Reel concept..."
            className="w-full rounded-2xl border border-black/[0.09] bg-cream/75 px-3.5 py-2 text-sm font-semibold text-ink focus:border-coral focus:bg-white focus:outline-none"
          />
        </div>

        {/* Platform */}
        <div className="lg:col-span-4">
          <span className="mb-1.5 block font-mono text-[11px] font-semibold uppercase tracking-wider text-ink-muted">
            Platform
          </span>
          <div className="flex flex-wrap gap-1 rounded-2xl border border-black/[0.06] bg-oat/70 p-1">
            {REEL_PLATFORMS.map((p) => (
              <Pill
                key={p.id}
                layoutId="reels-platform-pill"
                active={activeProject.platform === p.id}
                onClick={() => onUpdateProject({ platform: p.id as ReelPlatform })}
                activeClassName="bg-ink text-white shadow-sm"
                className="px-3 py-1.5 text-xs"
              >
                <PlatformIcon platform={p.id} />
                <span>{p.shortLabel}</span>
              </Pill>
            ))}
          </div>
        </div>

        {/* Aspect Ratio + Target Duration */}
        <div className="grid grid-cols-2 gap-3 lg:col-span-4">
          <div>
            <span className="mb-1.5 block font-mono text-[11px] font-semibold uppercase tracking-wider text-ink-muted">
              Ratio
            </span>
            <div className="grid grid-cols-3 gap-1 rounded-2xl border border-black/[0.06] bg-oat/70 p-1">
              {REEL_ASPECT_RATIOS.map((ratio) => (
                <motion.button
                  key={ratio.id}
                  type="button"
                  whileTap={{ scale: 0.95 }}
                  transition={SPRINGS.snappy}
                  onClick={() =>
                    onUpdateProject({
                      aspectRatio: ratio.id as ReelAspectRatio,
                    })
                  }
                  title={ratio.hint}
                  className={cn(
                    "rounded-xl py-1.5 font-mono text-xs font-bold transition-colors cursor-pointer",
                    activeProject.aspectRatio === ratio.id
                      ? "bg-white text-ink shadow-xs"
                      : "text-ink-secondary hover:text-ink"
                  )}
                >
                  {ratio.label}
                </motion.button>
              ))}
            </div>
          </div>

          <div>
            <label
              htmlFor="reel-target-duration"
              className="mb-1.5 block font-mono text-[11px] font-semibold uppercase tracking-wider text-ink-muted"
            >
              Target Sec
            </label>
            <div className="flex items-center gap-1 rounded-2xl border border-black/[0.06] bg-oat/70 p-1">
              {TARGET_DURATIONS.map((sec) => (
                <button
                  key={sec}
                  type="button"
                  onClick={() => onUpdateProject({ targetDurationSec: sec })}
                  className={cn(
                    "flex-1 rounded-xl py-1.5 font-mono text-xs font-bold transition-colors cursor-pointer",
                    activeProject.targetDurationSec === sec
                      ? "bg-indigo text-white shadow-xs"
                      : "text-ink-secondary hover:text-ink"
                  )}
                >
                  {sec}s
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
