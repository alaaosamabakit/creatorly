"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Calendar, Clock, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { PlatformIcon } from "@/components/ui/PlatformIcon";
import { SPRINGS } from "@/components/motion/MotionPresets";
import {
  CALENDAR_PLATFORM_META,
  CALENDAR_STATUS_META,
  CALENDAR_TIME_SLOTS,
} from "@/data/calendarData";
import { STUDIO_FORMATS } from "@/data/studioGenerator";
import { cn } from "@/lib/utils";
import type { CalendarPost, CalendarPostStatus } from "@/types/calendar";
import type { StudioFormat, StudioPlatform } from "@/types/studio";

const PLATFORMS: StudioPlatform[] = [
  "instagram",
  "facebook",
  "tiktok",
  "linkedin",
  "youtube",
];

const STATUSES: CalendarPostStatus[] = ["draft", "scheduled", "published"];

interface PostComposerModalProps {
  open: boolean;
  editingPost: CalendarPost | null;
  defaultDate: string;
  defaultTime: string;
  onClose: () => void;
  onSave: (payload: Omit<CalendarPost, "id">, existingId?: string) => void;
}

function ComposerForm({
  editingPost,
  defaultDate,
  defaultTime,
  onClose,
  onSave,
}: Omit<PostComposerModalProps, "open">) {
  const [title, setTitle] = useState(editingPost?.title ?? "");
  const [hook, setHook] = useState(editingPost?.hook ?? "");
  const [caption, setCaption] = useState(editingPost?.caption ?? "");
  const [platform, setPlatform] = useState<StudioPlatform>(
    editingPost?.platform ?? "instagram"
  );
  const [format, setFormat] = useState<StudioFormat>(
    editingPost?.format ?? "carousel"
  );
  const [status, setStatus] = useState<CalendarPostStatus>(
    editingPost?.status ?? "scheduled"
  );
  const [scheduledDate, setScheduledDate] = useState(
    editingPost?.scheduledDate ?? defaultDate
  );
  const [scheduledTime, setScheduledTime] = useState(
    editingPost?.scheduledTime ?? defaultTime
  );
  const [hashtagsText, setHashtagsText] = useState(
    editingPost?.hashtags.join(" ") ?? "#CreatorlyStudio #ContentDrop"
  );
  const [visualNotes, setVisualNotes] = useState(
    editingPost?.visualNotes ?? ""
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanTitle = title.trim() || "Untitled Creatorly Drop";
    const cleanHook = hook.trim() || cleanTitle;
    const cleanCaption =
      caption.trim() ||
      "Drafted inside Creatorly's Editorial Content Calendar.";

    const parsedTags = hashtagsText
      .split(/[\s,]+/)
      .map((t) => t.trim())
      .filter(Boolean)
      .map((t) => (t.startsWith("#") ? t : `#${t}`));

    onSave(
      {
        title: cleanTitle,
        hook: cleanHook,
        caption: cleanCaption,
        platform,
        format,
        status,
        scheduledDate,
        scheduledTime,
        hashtags: parsedTags.length > 0 ? parsedTags : ["#Creatorly"],
        visualNotes: visualNotes.trim(),
      },
      editingPost?.id
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-coral-soft px-3 py-1 font-mono text-[11px] font-semibold uppercase tracking-wider text-[#c93714]">
            <Sparkles className="h-3.5 w-3.5" />
            {editingPost ? "Edit Scheduled Post" : "Schedule New Post"}
          </span>
          <h2 className="mt-2 font-display text-2xl font-extrabold text-ink">
            {editingPost
              ? "Refine your calendar card"
              : "Drop a new story onto the calendar"}
          </h2>
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close modal"
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-black/[0.08] bg-oat/75 text-ink transition-colors hover:bg-oat cursor-pointer"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Platform picker */}
      <div>
        <span className="mb-2 block font-mono text-[11px] font-semibold uppercase tracking-wider text-ink-muted">
          Platform
        </span>
        <div className="flex flex-wrap gap-2">
          {PLATFORMS.map((p) => {
            const meta = CALENDAR_PLATFORM_META[p];
            const active = platform === p;
            return (
              <button
                key={p}
                type="button"
                onClick={() => setPlatform(p)}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-all cursor-pointer",
                  active
                    ? cn(meta.chipBg, meta.chipText, meta.borderClass, "shadow-sm")
                    : "border-black/[0.08] bg-cream text-ink-secondary hover:text-ink"
                )}
              >
                <PlatformIcon platform={p} />
                <span>{meta.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Format + Status */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <span className="mb-2 block font-mono text-[11px] font-semibold uppercase tracking-wider text-ink-muted">
            Format
          </span>
          <div className="grid grid-cols-3 gap-1.5 rounded-2xl bg-oat/70 p-1">
            {STUDIO_FORMATS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setFormat(item.id)}
                className={cn(
                  "rounded-xl py-2 text-xs font-semibold transition-all cursor-pointer",
                  format === item.id
                    ? "bg-white text-ink shadow-sm"
                    : "text-ink-secondary hover:text-ink"
                )}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <span className="mb-2 block font-mono text-[11px] font-semibold uppercase tracking-wider text-ink-muted">
            Status (Local)
          </span>
          <div className="grid grid-cols-3 gap-1.5 rounded-2xl bg-oat/70 p-1">
            {STATUSES.map((s) => {
              const meta = CALENDAR_STATUS_META[s];
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => setStatus(s)}
                  className={cn(
                    "inline-flex items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-semibold transition-all cursor-pointer",
                    status === s
                      ? "bg-white text-ink shadow-sm"
                      : "text-ink-secondary hover:text-ink"
                  )}
                >
                  <span className={cn("h-1.5 w-1.5 rounded-full", meta.dotClass)} />
                  <span>{meta.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Date & Time Slot */}
      <div className="rounded-2xl border border-black/[0.08] bg-cream/75 p-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="composer-date"
              className="mb-1.5 inline-flex items-center gap-1.5 font-mono text-[11px] font-semibold uppercase tracking-wider text-ink-muted"
            >
              <Calendar className="h-3.5 w-3.5 text-coral" />
              Scheduled Date
            </label>
            <input
              id="composer-date"
              type="date"
              required
              value={scheduledDate}
              onChange={(e) => setScheduledDate(e.target.value)}
              className="w-full rounded-xl border border-black/[0.09] bg-white px-3 py-2 font-mono text-sm text-ink focus:border-coral focus:outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="composer-time"
              className="mb-1.5 inline-flex items-center gap-1.5 font-mono text-[11px] font-semibold uppercase tracking-wider text-ink-muted"
            >
              <Clock className="h-3.5 w-3.5 text-indigo" />
              Time Slot
            </label>
            <input
              id="composer-time"
              type="time"
              required
              value={scheduledTime}
              onChange={(e) => setScheduledTime(e.target.value)}
              className="w-full rounded-xl border border-black/[0.09] bg-white px-3 py-2 font-mono text-sm text-ink focus:border-indigo focus:outline-none"
            />
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          <span className="mr-1 font-mono text-[10px] font-semibold uppercase tracking-wider text-ink-muted">
            Studio Slots:
          </span>
          {CALENDAR_TIME_SLOTS.map((slot) => (
            <button
              key={slot.value}
              type="button"
              onClick={() => setScheduledTime(slot.value)}
              className={cn(
                "rounded-full border px-2.5 py-1 font-mono text-[11px] font-semibold transition-colors cursor-pointer",
                scheduledTime === slot.value
                  ? "border-ink bg-ink text-white"
                  : "border-black/[0.08] bg-white text-ink-secondary hover:text-ink"
              )}
            >
              {slot.label}
            </button>
          ))}
        </div>
      </div>

      {/* Title, Hook, Caption */}
      <div className="space-y-3.5">
        <div>
          <label
            htmlFor="composer-title"
            className="mb-1 block font-mono text-[11px] font-semibold uppercase tracking-wider text-ink-muted"
          >
            Post Title
          </label>
          <input
            id="composer-title"
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Tactile Coffee Ritual Carousel"
            className="w-full rounded-xl border border-black/[0.09] bg-cream/60 px-3.5 py-2.5 text-sm font-semibold text-ink placeholder:text-ink-muted focus:border-coral focus:bg-white focus:outline-none"
          />
        </div>

        <div>
          <label
            htmlFor="composer-hook"
            className="mb-1 block font-mono text-[11px] font-semibold uppercase tracking-wider text-ink-muted"
          >
            Opening Hook
          </label>
          <input
            id="composer-hook"
            type="text"
            value={hook}
            onChange={(e) => setHook(e.target.value)}
            placeholder="First-line thumb-stopper..."
            className="w-full rounded-xl border border-black/[0.09] bg-cream/60 px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-muted focus:border-indigo focus:bg-white focus:outline-none"
          />
        </div>

        <div>
          <label
            htmlFor="composer-caption"
            className="mb-1 block font-mono text-[11px] font-semibold uppercase tracking-wider text-ink-muted"
          >
            Caption
          </label>
          <textarea
            id="composer-caption"
            rows={3}
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Write the post body, key beats, or community question..."
            className="w-full resize-y rounded-xl border border-black/[0.09] bg-cream/60 px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-muted focus:border-indigo focus:bg-white focus:outline-none"
          />
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label
              htmlFor="composer-hashtags"
              className="mb-1 block font-mono text-[11px] font-semibold uppercase tracking-wider text-ink-muted"
            >
              Hashtags
            </label>
            <input
              id="composer-hashtags"
              type="text"
              value={hashtagsText}
              onChange={(e) => setHashtagsText(e.target.value)}
              placeholder="#Creatorly #Design"
              className="w-full rounded-xl border border-black/[0.09] bg-cream/60 px-3.5 py-2 font-mono text-xs text-ink placeholder:text-ink-muted focus:border-indigo focus:bg-white focus:outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="composer-notes"
              className="mb-1 block font-mono text-[11px] font-semibold uppercase tracking-wider text-ink-muted"
            >
              Visual Notes (Optional)
            </label>
            <input
              id="composer-notes"
              type="text"
              value={visualNotes}
              onChange={(e) => setVisualNotes(e.target.value)}
              placeholder="Warm cream card + coral type"
              className="w-full rounded-xl border border-black/[0.09] bg-cream/60 px-3.5 py-2 text-xs text-ink placeholder:text-ink-muted focus:border-indigo focus:bg-white focus:outline-none"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-2.5 border-t border-black/[0.06] pt-4">
        <Button type="button" variant="outline" size="md" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" variant="coral" size="md">
          <Sparkles className="h-4 w-4" />
          <span>{editingPost ? "Save Changes" : "Schedule Post"}</span>
        </Button>
      </div>
    </form>
  );
}

/**
 * Animated Create / Edit Post modal with date and time selection.
 */
export function PostComposerModal({
  open,
  editingPost,
  defaultDate,
  defaultTime,
  onClose,
  onSave,
}: PostComposerModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/45 p-4 backdrop-blur-sm"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label={editingPost ? "Edit calendar post" : "Create calendar post"}
        >
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.96 }}
            transition={SPRINGS.bouncy}
            onClick={(e) => e.stopPropagation()}
            className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[2rem] border border-black/10 bg-white p-6 shadow-float-lg sm:p-8"
          >
            <ComposerForm
              key={`${editingPost?.id ?? "new"}-${defaultDate}-${defaultTime}`}
              editingPost={editingPost}
              defaultDate={defaultDate}
              defaultTime={defaultTime}
              onClose={onClose}
              onSave={onSave}
            />
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
