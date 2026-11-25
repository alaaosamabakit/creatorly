"use client";

import { useState } from "react";
import { Clock, Plus } from "lucide-react";
import { CalendarPostCard } from "@/components/calendar/CalendarPostCard";
import {
  CALENDAR_TIME_SLOTS,
  formatTimeLabel,
  getWeekDays,
} from "@/data/calendarData";
import { cn } from "@/lib/utils";
import type { CalendarPost } from "@/types/calendar";

interface CalendarWeekViewProps {
  anchorDate: string;
  selectedDate: string;
  posts: CalendarPost[];
  draggingPostId: string | null;
  onSelectDate: (dateKey: string) => void;
  onSelectPost: (post: CalendarPost) => void;
  onCreateForSlot: (dateKey: string, time: string) => void;
  onDragStartPost: (postId: string) => void;
  onDragEndPost: () => void;
  onDropPostOnSlot: (postId: string, dateKey: string, time: string) => void;
}

/**
 * Maps any scheduled HH:mm string to the closest studio slot row so custom times stay visible.
 */
function resolveSlotValue(time24: string): string {
  const exact = CALENDAR_TIME_SLOTS.find((s) => s.value === time24);
  if (exact) return exact.value;

  const [hStr, mStr] = time24.split(":");
  const mins = Number(hStr) * 60 + Number(mStr);
  if (Number.isNaN(mins)) return CALENDAR_TIME_SLOTS[0].value;

  let closest = CALENDAR_TIME_SLOTS[0].value;
  let bestDiff = Infinity;
  for (const slot of CALENDAR_TIME_SLOTS) {
    const [sh, sm] = slot.value.split(":").map(Number);
    const diff = Math.abs(mins - (sh * 60 + sm));
    if (diff < bestDiff) {
      bestDiff = diff;
      closest = slot.value;
    }
  }
  return closest;
}

/**
 * Editorial Weekly Studio Matrix supporting drag-and-drop across dates & time slots
 * on desktop, plus a responsive day-pill timeline on mobile/tablet.
 */
export function CalendarWeekView({
  anchorDate,
  selectedDate,
  posts,
  draggingPostId,
  onSelectDate,
  onSelectPost,
  onCreateForSlot,
  onDragStartPost,
  onDragEndPost,
  onDropPostOnSlot,
}: CalendarWeekViewProps) {
  const [dragOverSlot, setDragOverSlot] = useState<string | null>(null);
  const weekDays = getWeekDays(anchorDate);

  const mobileActiveDay = weekDays.some((d) => d.dateKey === selectedDate)
    ? selectedDate
    : weekDays[0].dateKey;

  const getPostsForCell = (dateKey: string, slotValue: string) =>
    posts
      .filter(
        (p) =>
          p.scheduledDate === dateKey &&
          resolveSlotValue(p.scheduledTime) === slotValue
      )
      .sort((a, b) => a.scheduledTime.localeCompare(b.scheduledTime));

  return (
    <div className="space-y-4">
      {/* DESKTOP 7-DAY × TIME-SLOT MATRIX */}
      <div className="hidden overflow-hidden rounded-[2rem] border border-black/[0.08] bg-white/95 shadow-float lg:block">
        {/* Column headers */}
        <div className="grid grid-cols-[104px_repeat(7,minmax(0,1fr))] border-b border-black/[0.07] bg-oat/60">
          <div className="flex items-center justify-center px-2 py-3 font-mono text-[11px] font-semibold uppercase tracking-wider text-ink-muted">
            Slot
          </div>
          {weekDays.map((day) => {
            const isSelected = day.dateKey === selectedDate;
            return (
              <button
                key={day.dateKey}
                type="button"
                onClick={() => onSelectDate(day.dateKey)}
                className={cn(
                  "flex flex-col items-center justify-center border-l border-black/[0.06] py-3 transition-colors cursor-pointer",
                  isSelected ? "bg-coral-soft/60" : "hover:bg-white/60"
                )}
              >
                <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-ink-muted">
                  {day.shortDay}
                </span>
                <span
                  className={cn(
                    "mt-1 inline-flex h-7 w-7 items-center justify-center rounded-full font-display text-sm font-extrabold",
                    isSelected ? "bg-coral text-white" : "text-ink"
                  )}
                >
                  {day.dayNumber}
                </span>
              </button>
            );
          })}
        </div>

        {/* Time-slot rows */}
        {CALENDAR_TIME_SLOTS.map((slot) => (
          <div
            key={slot.value}
            className="grid grid-cols-[104px_repeat(7,minmax(0,1fr))] border-b border-black/[0.06] last:border-b-0"
          >
            <div className="flex flex-col items-center justify-start bg-cream/60 px-2 pt-4">
              <span className="inline-flex items-center gap-1 font-mono text-xs font-bold text-ink">
                <Clock className="h-3 w-3 text-indigo" />
                {slot.label}
              </span>
            </div>

            {weekDays.map((day) => {
              const cellKey = `${day.dateKey}__${slot.value}`;
              const cellPosts = getPostsForCell(day.dateKey, slot.value);
              const isDropTarget = dragOverSlot === cellKey;

              return (
                <div
                  key={cellKey}
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.dataTransfer.dropEffect = "move";
                    if (dragOverSlot !== cellKey) {
                      setDragOverSlot(cellKey);
                    }
                  }}
                  onDragLeave={() => {
                    if (dragOverSlot === cellKey) {
                      setDragOverSlot(null);
                    }
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    setDragOverSlot(null);
                    const droppedId =
                      e.dataTransfer.getData("text/plain") || draggingPostId;
                    if (droppedId) {
                      onDropPostOnSlot(droppedId, day.dateKey, slot.value);
                    }
                  }}
                  className={cn(
                    "group relative flex min-h-[118px] flex-col gap-2 border-l border-black/[0.06] p-2 transition-colors",
                    isDropTarget &&
                      "bg-indigo-soft/65 ring-2 ring-inset ring-indigo/45"
                  )}
                >
                  {cellPosts.map((post) => (
                    <CalendarPostCard
                      key={post.id}
                      post={post}
                      compact
                      onSelect={onSelectPost}
                      onDragStartPost={onDragStartPost}
                      onDragEndPost={onDragEndPost}
                    />
                  ))}

                  <button
                    type="button"
                    aria-label={`Add post on ${day.dateKey} at ${slot.label}`}
                    onClick={() => onCreateForSlot(day.dateKey, slot.value)}
                    className={cn(
                      "mt-auto inline-flex items-center justify-center gap-1 rounded-xl border border-dashed border-black/15 py-1.5 text-[11px] font-semibold text-ink-muted transition-all hover:border-coral/40 hover:bg-coral-soft/60 hover:text-[#c93714] cursor-pointer",
                      cellPosts.length === 0
                        ? "opacity-0 group-hover:opacity-100 focus:opacity-100"
                        : "opacity-0 group-hover:opacity-100 focus:opacity-100"
                    )}
                  >
                    <Plus className="h-3 w-3" />
                    <span>Add</span>
                  </button>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* MOBILE / TABLET DAY-PILL TIMELINE */}
      <div className="space-y-4 lg:hidden">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {weekDays.map((day) => {
            const isSelected = day.dateKey === mobileActiveDay;
            const dayCount = posts.filter(
              (p) => p.scheduledDate === day.dateKey
            ).length;

            return (
              <button
                key={day.dateKey}
                type="button"
                onClick={() => onSelectDate(day.dateKey)}
                className={cn(
                  "flex min-w-[74px] flex-col items-center rounded-2xl border px-3 py-2.5 transition-all cursor-pointer",
                  isSelected
                    ? "border-ink bg-ink text-white shadow-sm"
                    : "border-black/[0.08] bg-white text-ink hover:bg-oat/60"
                )}
              >
                <span className="font-mono text-[10px] uppercase opacity-75">
                  {day.shortDay}
                </span>
                <span className="mt-0.5 font-display text-lg font-extrabold">
                  {day.dayNumber}
                </span>
                <span
                  className={cn(
                    "mt-1 rounded-full px-1.5 py-0.5 font-mono text-[10px] font-semibold",
                    isSelected
                      ? "bg-white/15 text-white"
                      : "bg-oat text-ink-secondary"
                  )}
                >
                  {dayCount}
                </span>
              </button>
            );
          })}
        </div>

        <div className="space-y-3">
          {CALENDAR_TIME_SLOTS.map((slot) => {
            const slotPosts = getPostsForCell(mobileActiveDay, slot.value);
            return (
              <div
                key={slot.value}
                className="rounded-3xl border border-black/[0.08] bg-white p-4 shadow-float"
              >
                <div className="mb-2.5 flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 font-mono text-xs font-bold text-ink">
                    <Clock className="h-3.5 w-3.5 text-indigo" />
                    {formatTimeLabel(slot.value)}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      onCreateForSlot(mobileActiveDay, slot.value)
                    }
                    className="inline-flex items-center gap-1 rounded-full bg-oat px-3 py-1 text-xs font-semibold text-ink hover:bg-coral hover:text-white cursor-pointer"
                  >
                    <Plus className="h-3 w-3" />
                    <span>Schedule</span>
                  </button>
                </div>

                {slotPosts.length === 0 ? (
                  <p className="rounded-2xl border border-dashed border-black/10 bg-cream/60 py-3 text-center text-xs text-ink-muted">
                    Open slot
                  </p>
                ) : (
                  <div className="grid gap-2.5 sm:grid-cols-2">
                    {slotPosts.map((post) => (
                      <CalendarPostCard
                        key={post.id}
                        post={post}
                        onSelect={onSelectPost}
                        onDragStartPost={onDragStartPost}
                        onDragEndPost={onDragEndPost}
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
