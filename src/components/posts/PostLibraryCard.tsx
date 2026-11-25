"use client";

import Link from "next/link";
import { motion } from "motion/react";
import {
  Calendar,
  CopyPlus,
  Expand,
  Pencil,
  Trash2,
  Wand2,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { PlatformIcon } from "@/components/ui/PlatformIcon";
import { SPRINGS } from "@/components/motion/MotionPresets";
import {
  CALENDAR_PLATFORM_META,
  CALENDAR_STATUS_META,
  formatReadableDate,
  formatTimeLabel,
} from "@/data/calendarData";
import { cn } from "@/lib/utils";
import type { CalendarPost } from "@/types/calendar";

interface PostLibraryCardProps {
  post: CalendarPost;
  viewMode: "grid" | "list";
  onInspect: (post: CalendarPost) => void;
  onEdit: (post: CalendarPost) => void;
  onDuplicate: (post: CalendarPost) => void;
  onDelete: (id: string) => void;
}

/**
 * Editorial post library item supporting Grid card and List row layouts.
 */
export function PostLibraryCard({
  post,
  viewMode,
  onInspect,
  onEdit,
  onDuplicate,
  onDelete,
}: PostLibraryCardProps) {
  const platformMeta = CALENDAR_PLATFORM_META[post.platform];
  const statusMeta = CALENDAR_STATUS_META[post.status];
  const isSample = post.source === "sample";

  const statusDisplayLabel =
    post.status === "published" ? "Demo Published" : statusMeta.label;

  if (viewMode === "list") {
    return (
      <motion.article
        layout
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97 }}
        whileHover={{ y: -2, transition: SPRINGS.snappy }}
        transition={SPRINGS.gentle}
        className="group relative overflow-hidden rounded-3xl border border-black/[0.08] bg-white p-4 shadow-float transition-shadow hover:shadow-float-lg sm:p-5"
      >
        <span
          aria-hidden="true"
          className={cn(
            "absolute inset-y-0 left-0 w-1.5",
            platformMeta.stripeClass
          )}
        />

        <div className="flex flex-col justify-between gap-4 pl-2.5 lg:flex-row lg:items-center">
          {/* Left preview + meta */}
          <div className="flex min-w-0 flex-1 items-start gap-4">
            <button
              type="button"
              onClick={() => onInspect(post)}
              className={cn(
                "hidden h-20 w-24 shrink-0 flex-col justify-between rounded-2xl bg-gradient-to-br p-2.5 text-left text-white shadow-sm transition-transform group-hover:scale-[1.02] sm:flex cursor-pointer",
                platformMeta.gradientClass
              )}
            >
              <span className="font-mono text-[9px] font-bold uppercase tracking-wider text-white/85">
                {post.format}
              </span>
              <span className="line-clamp-2 font-display text-xs font-extrabold leading-tight">
                {post.title}
              </span>
            </button>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant={platformMeta.accent}>
                  <PlatformIcon platform={post.platform} />
                  <span>{platformMeta.label}</span>
                </Badge>
                <span className="rounded-full bg-oat px-2.5 py-0.5 font-mono text-[11px] font-semibold uppercase text-ink">
                  {post.format}
                </span>
                <span
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold",
                    statusMeta.pillClass
                  )}
                >
                  <span
                    className={cn("h-1.5 w-1.5 rounded-full", statusMeta.dotClass)}
                  />
                  {statusDisplayLabel}
                </span>
                {isSample ? (
                  <span className="rounded-full border border-dashed border-black/15 bg-cream px-2 py-0.5 font-mono text-[10px] font-medium text-ink-muted">
                    Sample Mock
                  </span>
                ) : (
                  <span className="rounded-full bg-mint-soft px-2 py-0.5 font-mono text-[10px] font-semibold text-mint-deep">
                    Local Draft
                  </span>
                )}
              </div>

              <button
                type="button"
                onClick={() => onInspect(post)}
                className="mt-2 block text-left cursor-pointer"
              >
                <h3 className="font-display text-lg font-extrabold text-ink transition-colors group-hover:text-coral">
                  {post.title}
                </h3>
                <p className="mt-1 line-clamp-1 text-sm text-ink-secondary">
                  “{post.hook}” — {post.caption}
                </p>
              </button>

              <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-ink-muted">
                <span className="inline-flex items-center gap-1 font-mono">
                  <Calendar className="h-3.5 w-3.5 text-indigo" />
                  {formatReadableDate(post.scheduledDate)} ·{" "}
                  {formatTimeLabel(post.scheduledTime)}
                </span>
                {post.hashtags.slice(0, 3).map((tag) => (
                  <span key={tag} className="font-mono text-[11px] text-indigo">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right action cluster */}
          <div className="flex flex-wrap items-center gap-1.5 border-t border-black/[0.06] pt-3 lg:border-t-0 lg:pt-0">
            <Link
              href={`/studio?postId=${encodeURIComponent(post.id)}`}
              className="inline-flex items-center gap-1.5 rounded-full bg-indigo-soft px-3 py-1.5 text-xs font-semibold text-indigo transition-colors hover:bg-indigo hover:text-white"
            >
              <Wand2 className="h-3.5 w-3.5" />
              <span>Open in AI Studio</span>
            </Link>

            {post.status === "scheduled" ? (
              <Link
                href={`/calendar?postId=${encodeURIComponent(post.id)}&date=${encodeURIComponent(post.scheduledDate)}`}
                className="inline-flex items-center gap-1.5 rounded-full bg-coral-soft px-3 py-1.5 text-xs font-semibold text-[#c93714] transition-colors hover:bg-coral hover:text-white"
              >
                <Calendar className="h-3.5 w-3.5" />
                <span>Calendar</span>
              </Link>
            ) : null}

            <button
              type="button"
              onClick={() => onEdit(post)}
              aria-label={`Edit ${post.title}`}
              className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-black/[0.08] bg-cream text-ink-secondary transition-colors hover:bg-oat hover:text-ink cursor-pointer"
            >
              <Pencil className="h-3.5 w-3.5" />
            </button>

            <button
              type="button"
              onClick={() => onDuplicate(post)}
              aria-label={`Duplicate ${post.title}`}
              className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-black/[0.08] bg-cream text-ink-secondary transition-colors hover:bg-oat hover:text-ink cursor-pointer"
            >
              <CopyPlus className="h-3.5 w-3.5" />
            </button>

            <button
              type="button"
              onClick={() => onDelete(post.id)}
              aria-label={`Delete ${post.title}`}
              className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-black/[0.08] bg-cream text-ink-muted transition-colors hover:border-coral/30 hover:bg-coral-soft hover:text-[#c93714] cursor-pointer"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </motion.article>
    );
  }

  /* GRID CARD VIEW */
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 18, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.94 }}
      whileHover={{ y: -5, transition: SPRINGS.bouncy }}
      transition={SPRINGS.gentle}
      className="group relative flex flex-col rounded-[1.85rem] border border-black/[0.08] bg-white p-4 shadow-float transition-shadow hover:shadow-float-lg"
    >
      {/* Top badges */}
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <Badge variant={platformMeta.accent}>
          <PlatformIcon platform={post.platform} />
          <span>{platformMeta.label}</span>
        </Badge>

        <div className="flex items-center gap-1.5">
          {isSample ? (
            <span className="rounded-full border border-dashed border-black/15 bg-cream px-2 py-0.5 font-mono text-[10px] font-medium text-ink-muted">
              Mock
            </span>
          ) : null}
          <span
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold",
              statusMeta.pillClass
            )}
          >
            <span
              className={cn("h-1.5 w-1.5 rounded-full", statusMeta.dotClass)}
            />
            {statusDisplayLabel}
          </span>
        </div>
      </div>

      {/* Visual editorial preview header */}
      <button
        type="button"
        onClick={() => onInspect(post)}
        className={cn(
          "relative overflow-hidden rounded-2xl bg-gradient-to-br p-4 text-left text-white transition-transform duration-200 group-hover:scale-[1.01] cursor-pointer",
          platformMeta.gradientClass
        )}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/20 blur-xl"
        />
        <div className="relative flex items-center justify-between text-[10px] font-mono font-bold uppercase tracking-wider text-white/85">
          <span>{post.format}</span>
          <span>{formatTimeLabel(post.scheduledTime)}</span>
        </div>
        <h3 className="relative mt-3 font-display text-lg font-extrabold leading-snug">
          {post.title}
        </h3>
        <p className="relative mt-1.5 text-[11px] font-medium text-white/90">
          {formatReadableDate(post.scheduledDate)}
        </p>
      </button>

      {/* Hook, caption & tags */}
      <div className="mt-3.5 flex-1 px-0.5">
        <p className="line-clamp-2 font-display text-[15px] font-bold leading-snug text-ink">
          “{post.hook}”
        </p>
        <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-ink-secondary">
          {post.caption}
        </p>

        {post.hashtags.length > 0 ? (
          <div className="mt-2.5 flex flex-wrap gap-1">
            {post.hashtags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-cream px-2 py-0.5 font-mono text-[10px] text-ink-muted"
              >
                {tag}
              </span>
            ))}
          </div>
        ) : null}
      </div>

      {/* Cross-app routing & edit actions */}
      <div className="mt-4 space-y-2 border-t border-black/[0.06] pt-3">
        <div className="flex flex-wrap items-center gap-1.5">
          <Link
            href={`/studio?postId=${encodeURIComponent(post.id)}`}
            className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full bg-indigo-soft px-3 py-1.5 text-xs font-semibold text-indigo transition-colors hover:bg-indigo hover:text-white"
          >
            <Wand2 className="h-3.5 w-3.5" />
            <span>Open in AI Studio</span>
          </Link>

          {post.status === "scheduled" ? (
            <Link
              href={`/calendar?postId=${encodeURIComponent(post.id)}&date=${encodeURIComponent(post.scheduledDate)}`}
              className="inline-flex items-center justify-center gap-1 rounded-full bg-coral-soft px-3 py-1.5 text-xs font-semibold text-[#c93714] transition-colors hover:bg-coral hover:text-white"
            >
              <Calendar className="h-3.5 w-3.5" />
              <span>Calendar</span>
            </Link>
          ) : null}
        </div>

        <div className="flex items-center justify-between gap-1.5">
          <button
            type="button"
            onClick={() => onInspect(post)}
            className="inline-flex items-center gap-1 rounded-full bg-oat/75 px-3 py-1.5 text-xs font-semibold text-ink transition-colors hover:bg-oat cursor-pointer"
          >
            <Expand className="h-3.5 w-3.5" />
            <span>Preview</span>
          </button>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => onEdit(post)}
              aria-label={`Edit ${post.title}`}
              className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-black/[0.08] bg-white text-ink-secondary transition-colors hover:bg-oat hover:text-ink cursor-pointer"
            >
              <Pencil className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => onDuplicate(post)}
              aria-label={`Duplicate ${post.title}`}
              className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-black/[0.08] bg-white text-ink-secondary transition-colors hover:bg-oat hover:text-ink cursor-pointer"
            >
              <CopyPlus className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => onDelete(post.id)}
              aria-label={`Delete ${post.title}`}
              className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-black/[0.08] bg-white text-ink-muted transition-colors hover:border-coral/30 hover:bg-coral-soft hover:text-[#c93714] cursor-pointer"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
