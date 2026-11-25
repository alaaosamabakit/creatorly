"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  Calendar,
  Clock,
  CopyPlus,
  Pencil,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { PlatformIcon } from "@/components/ui/PlatformIcon";
import { SPRINGS } from "@/components/motion/MotionPresets";
import {
  CALENDAR_PLATFORM_META,
  CALENDAR_STATUS_META,
  CALENDAR_TIME_SLOTS,
  formatReadableDate,
  formatTimeLabel,
} from "@/data/calendarData";
import { cn } from "@/lib/utils";
import type { CalendarPost, CalendarPostStatus } from "@/types/calendar";

interface PostDetailModalProps {
  post: CalendarPost | null;
  onClose: () => void;
  onEdit: (post: CalendarPost) => void;
  onDelete: (id: string) => void;
  onDuplicate: (post: CalendarPost) => void;
  onStatusChange: (id: string, status: CalendarPostStatus) => void;
  onReschedule: (id: string, date: string, time: string) => void;
}

const STATUS_ORDER: CalendarPostStatus[] = ["draft", "scheduled", "published"];

/**
 * Detailed editorial post preview modal with quick status switching, rescheduling, edit, and delete.
 */
export function PostDetailModal({
  post,
  onClose,
  onEdit,
  onDelete,
  onDuplicate,
  onStatusChange,
  onReschedule,
}: PostDetailModalProps) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    if (!post) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [post, onClose]);

  return (
    <AnimatePresence>
      {post ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/45 p-4 backdrop-blur-sm"
          onClick={() => {
            setConfirmDelete(false);
            onClose();
          }}
          role="dialog"
          aria-modal="true"
          aria-label="Scheduled post preview"
        >
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.96 }}
            transition={SPRINGS.bouncy}
            onClick={(e) => e.stopPropagation()}
            className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[2rem] border border-black/10 bg-white p-6 shadow-float-lg sm:p-8"
          >
            {(() => {
              const platformMeta = CALENDAR_PLATFORM_META[post.platform];
              const statusMeta = CALENDAR_STATUS_META[post.status];

              return (
                <>
                  {/* Top metadata badges */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant={platformMeta.accent}>
                        <PlatformIcon platform={post.platform} />
                        <span>{platformMeta.label}</span>
                      </Badge>
                      <Badge variant="cream" className="uppercase font-mono">
                        {post.format}
                      </Badge>
                      <span
                        className={cn(
                          "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold",
                          statusMeta.pillClass
                        )}
                      >
                        <span
                          className={cn(
                            "h-2 w-2 rounded-full",
                            statusMeta.dotClass
                          )}
                        />
                        {statusMeta.label}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setConfirmDelete(false);
                        onClose();
                      }}
                      aria-label="Close post preview"
                      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-black/[0.08] bg-oat/75 text-ink transition-colors hover:bg-oat cursor-pointer"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Vibrant visual preview cover */}
                  <div
                    className={cn(
                      "mt-5 overflow-hidden rounded-3xl bg-gradient-to-br p-6 text-white shadow-float",
                      platformMeta.gradientClass
                    )}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-semibold uppercase tracking-wider text-white/85">
                      <span>{platformMeta.handle}</span>
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-black/20 px-2.5 py-0.5 font-mono">
                        <Calendar className="h-3 w-3" />
                        {formatReadableDate(post.scheduledDate)} ·{" "}
                        {formatTimeLabel(post.scheduledTime)}
                      </span>
                    </div>

                    <h2 className="mt-4 font-display text-2xl font-extrabold leading-tight sm:text-3xl">
                      {post.title}
                    </h2>
                    <p className="mt-2.5 text-sm font-medium text-white/95">
                      “{post.hook}”
                    </p>
                  </div>

                  {/* Caption & visual art direction */}
                  <div className="mt-5 space-y-4">
                    <div className="rounded-2xl border border-black/[0.07] bg-cream/75 p-4">
                      <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-ink-muted">
                        Caption
                      </span>
                      <p className="mt-1.5 whitespace-pre-line text-sm leading-relaxed text-ink">
                        {post.caption}
                      </p>
                      {post.hashtags.length > 0 ? (
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {post.hashtags.map((tag) => (
                            <span
                              key={tag}
                              className="rounded-full bg-white px-2.5 py-0.5 font-mono text-[11px] font-medium text-indigo"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      ) : null}
                    </div>

                    {post.visualNotes ? (
                      <div className="rounded-2xl border border-black/[0.06] bg-oat/55 px-4 py-3 text-xs text-ink-secondary">
                        <strong className="font-mono uppercase tracking-wider text-ink">
                          Visual Direction:
                        </strong>{" "}
                        {post.visualNotes}
                      </div>
                    ) : null}

                    {/* Quick local status & quick reschedule strip */}
                    <div className="grid gap-3 rounded-2xl border border-black/[0.07] bg-white p-4 sm:grid-cols-2">
                      <div>
                        <span className="mb-2 block font-mono text-[11px] font-semibold uppercase tracking-wider text-ink-muted">
                          Local Planning Status
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {STATUS_ORDER.map((statusOption) => {
                            const meta = CALENDAR_STATUS_META[statusOption];
                            const active = post.status === statusOption;
                            return (
                              <button
                                key={statusOption}
                                type="button"
                                onClick={() =>
                                  onStatusChange(post.id, statusOption)
                                }
                                className={cn(
                                  "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold transition-all cursor-pointer",
                                  active
                                    ? "border-ink bg-ink text-white"
                                    : "border-black/[0.08] bg-cream text-ink-secondary hover:text-ink"
                                )}
                              >
                                <span
                                  className={cn(
                                    "h-1.5 w-1.5 rounded-full",
                                    meta.dotClass
                                  )}
                                />
                                {meta.label}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div>
                        <span className="mb-2 block font-mono text-[11px] font-semibold uppercase tracking-wider text-ink-muted">
                          Quick Reschedule
                        </span>
                        <div className="flex flex-wrap items-center gap-2">
                          <input
                            type="date"
                            aria-label="Scheduled date"
                            value={post.scheduledDate}
                            onChange={(e) => {
                              if (e.target.value) {
                                onReschedule(
                                  post.id,
                                  e.target.value,
                                  post.scheduledTime
                                );
                              }
                            }}
                            className="rounded-xl border border-black/[0.1] bg-cream px-2.5 py-1.5 font-mono text-xs font-medium text-ink focus:border-indigo focus:outline-none"
                          />
                          <div className="inline-flex items-center gap-1 rounded-xl border border-black/[0.1] bg-cream px-2 py-1">
                            <Clock className="h-3.5 w-3.5 text-ink-muted" />
                            <select
                              aria-label="Scheduled time"
                              value={post.scheduledTime}
                              onChange={(e) =>
                                onReschedule(
                                  post.id,
                                  post.scheduledDate,
                                  e.target.value
                                )
                              }
                              className="bg-transparent font-mono text-xs font-medium text-ink focus:outline-none"
                            >
                              {CALENDAR_TIME_SLOTS.map((slot) => (
                                <option key={slot.value} value={slot.value}>
                                  {slot.label}
                                </option>
                              ))}
                              {!CALENDAR_TIME_SLOTS.some(
                                (s) => s.value === post.scheduledTime
                              ) ? (
                                <option value={post.scheduledTime}>
                                  {formatTimeLabel(post.scheduledTime)}
                                </option>
                              ) : null}
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Footer action bar */}
                  <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-black/[0.06] pt-4">
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-ink-muted">
                      <Sparkles className="h-3.5 w-3.5 text-coral" />
                      Local calendar planner — external social publishing is not
                      connected yet.
                    </span>

                    <div className="flex flex-wrap items-center gap-2">
                      {confirmDelete ? (
                        <div className="inline-flex items-center gap-1.5 rounded-full bg-coral-soft px-2 py-1">
                          <span className="pl-2 text-xs font-semibold text-[#c93714]">
                            Remove post?
                          </span>
                          <Button
                            variant="coral"
                            size="sm"
                            onClick={() => {
                              setConfirmDelete(false);
                              onDelete(post.id);
                            }}
                          >
                            Confirm
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setConfirmDelete(false)}
                          >
                            Cancel
                          </Button>
                        </div>
                      ) : (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setConfirmDelete(true)}
                          className="text-[#c93714] hover:bg-coral-soft"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          <span>Delete</span>
                        </Button>
                      )}

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onDuplicate(post)}
                      >
                        <CopyPlus className="h-3.5 w-3.5" />
                        <span>Duplicate</span>
                      </Button>

                      <Button
                        variant="ink"
                        size="sm"
                        onClick={() => onEdit(post)}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                        <span>Edit Post</span>
                      </Button>
                    </div>
                  </div>
                </>
              );
            })()}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
