"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { CalendarPostCard } from "@/components/calendar/CalendarPostCard";
import {
  CALENDAR_PLATFORM_META,
  formatReadableDate,
  getMonthGridDays,
} from "@/data/calendarData";
import { cn } from "@/lib/utils";
import type { CalendarPost } from "@/types/calendar";

const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

interface CalendarMonthViewProps {
  anchorDate: string;
  selectedDate: string;
  posts: CalendarPost[];
  draggingPostId: string | null;
  onSelectDate: (dateKey: string) => void;
  onSelectPost: (post: CalendarPost) => void;
  onCreateForDate: (dateKey: string) => void;
  onDragStartPost: (postId: string) => void;
  onDragEndPost: () => void;
  onDropPostOnDate: (postId: string, dateKey: string) => void;
}

/**
 * Editorial Monthly Calendar with drag-and-drop date cells on desktop/tablet
 * and a tactile day-selector + agenda stack on mobile.
 */
export function CalendarMonthView({
  anchorDate,
  selectedDate,
  posts,
  draggingPostId,
  onSelectDate,
  onSelectPost,
  onCreateForDate,
  onDragStartPost,
  onDragEndPost,
  onDropPostOnDate,
}: CalendarMonthViewProps) {
  const [dragOverDate, setDragOverDate] = useState<string | null>(null);
  const gridDays = getMonthGridDays(anchorDate);

  const postsByDate = posts.reduce<Record<string, CalendarPost[]>>(
    (acc, post) => {
      const list = acc[post.scheduledDate] ?? [];
      list.push(post);
      list.sort((a, b) => a.scheduledTime.localeCompare(b.scheduledTime));
      acc[post.scheduledDate] = list;
      return acc;
    },
    {}
  );

  const selectedDayPosts = postsByDate[selectedDate] ?? [];

  return (
    <div className="space-y-4">
      {/* DESKTOP / TABLET 7-COLUMN EDITORIAL GRID */}
      <div className="hidden overflow-hidden rounded-[2rem] border border-black/[0.08] bg-white/90 shadow-float md:block">
        <div className="grid grid-cols-7 border-b border-black/[0.07] bg-oat/60">
          {WEEKDAY_LABELS.map((label) => (
            <div
              key={label}
              className="px-3 py-3 text-center font-mono text-[11px] font-semibold uppercase tracking-wider text-ink-muted"
            >
              {label}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7">
          {gridDays.map((cell) => {
            const dayPosts = postsByDate[cell.dateKey] ?? [];
            const isSelected = cell.dateKey === selectedDate;
            const isDropTarget = dragOverDate === cell.dateKey;

            return (
              <div
                key={cell.dateKey}
                onDragOver={(e) => {
                  e.preventDefault();
                  e.dataTransfer.dropEffect = "move";
                  if (dragOverDate !== cell.dateKey) {
                    setDragOverDate(cell.dateKey);
                  }
                }}
                onDragLeave={() => {
                  if (dragOverDate === cell.dateKey) {
                    setDragOverDate(null);
                  }
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragOverDate(null);
                  const droppedId =
                    e.dataTransfer.getData("text/plain") || draggingPostId;
                  if (droppedId) {
                    onDropPostOnDate(droppedId, cell.dateKey);
                  }
                }}
                onClick={() => onSelectDate(cell.dateKey)}
                className={cn(
                  "group relative flex min-h-[152px] flex-col border-b border-r border-black/[0.06] p-2.5 transition-colors nth-[7n]:border-r-0",
                  !cell.inCurrentMonth && "bg-cream/55 opacity-60",
                  isSelected && "bg-coral-soft/25",
                  isDropTarget &&
                    "bg-indigo-soft/65 ring-2 ring-inset ring-indigo/45"
                )}
              >
                <div className="mb-2 flex items-center justify-between">
                  <span
                    className={cn(
                      "inline-flex h-7 w-7 items-center justify-center rounded-full font-mono text-xs font-bold",
                      isSelected
                        ? "bg-coral text-white shadow-sm"
                        : "text-ink"
                    )}
                  >
                    {cell.dayNumber}
                  </span>

                  <button
                    type="button"
                    aria-label={`Add post on ${cell.dateKey}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onCreateForDate(cell.dateKey);
                    }}
                    className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-black/[0.08] bg-white text-ink-secondary opacity-0 shadow-xs transition-all hover:border-coral/40 hover:bg-coral hover:text-white group-hover:opacity-100 focus:opacity-100 cursor-pointer"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>

                <div
                  className="flex flex-1 flex-col gap-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  {dayPosts.map((post) => (
                    <CalendarPostCard
                      key={post.id}
                      post={post}
                      compact
                      onSelect={onSelectPost}
                      onDragStartPost={onDragStartPost}
                      onDragEndPost={onDragEndPost}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* MOBILE COMPACT MINI-MONTH + SELECTED DAY AGENDA */}
      <div className="space-y-4 md:hidden">
        <div className="rounded-3xl border border-black/[0.08] bg-white p-4 shadow-float">
          <div className="mb-2 grid grid-cols-7 text-center">
            {WEEKDAY_LABELS.map((d) => (
              <span
                key={d}
                className="font-mono text-[10px] font-semibold uppercase text-ink-muted"
              >
                {d.slice(0, 2)}
              </span>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {gridDays.map((cell) => {
              const dayPosts = postsByDate[cell.dateKey] ?? [];
              const isSelected = cell.dateKey === selectedDate;
              return (
                <button
                  key={cell.dateKey}
                  type="button"
                  onClick={() => onSelectDate(cell.dateKey)}
                  className={cn(
                    "flex flex-col items-center justify-center rounded-2xl py-2 transition-colors cursor-pointer",
                    isSelected
                      ? "bg-ink text-white"
                      : cell.inCurrentMonth
                        ? "bg-cream/60 text-ink hover:bg-oat"
                        : "text-ink-muted/50"
                  )}
                >
                  <span className="font-mono text-xs font-bold">
                    {cell.dayNumber}
                  </span>
                  <div className="mt-1 flex h-1.5 items-center gap-0.5">
                    {dayPosts.slice(0, 3).map((post) => (
                      <span
                        key={post.id}
                        className={cn(
                          "h-1.5 w-1.5 rounded-full",
                          CALENDAR_PLATFORM_META[post.platform].stripeClass
                        )}
                      />
                    ))}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="rounded-3xl border border-black/[0.08] bg-white p-4 shadow-float">
          <div className="mb-3 flex items-center justify-between gap-2">
            <div>
              <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-ink-muted">
                Selected Day
              </span>
              <h3 className="font-display text-lg font-extrabold text-ink">
                {formatReadableDate(selectedDate)}
              </h3>
            </div>
            <button
              type="button"
              onClick={() => onCreateForDate(selectedDate)}
              className="inline-flex items-center gap-1 rounded-full bg-coral px-3 py-1.5 text-xs font-semibold text-white cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add</span>
            </button>
          </div>

          {selectedDayPosts.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-black/15 bg-cream/60 p-5 text-center text-xs text-ink-muted">
              No posts planned for this day yet. Tap <strong>Add</strong> to
              schedule one.
            </p>
          ) : (
            <div className="space-y-2.5">
              {selectedDayPosts.map((post) => (
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
      </div>
    </div>
  );
}
