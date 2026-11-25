"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import {
  CalendarDays,
  CalendarRange,
  ChevronLeft,
  ChevronRight,
  Plus,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { FloatingNav } from "@/components/layout/FloatingNav";
import { StudioFooter } from "@/components/layout/StudioFooter";
import { Reveal } from "@/components/motion/Reveal";
import { SPRINGS } from "@/components/motion/MotionPresets";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Pill } from "@/components/ui/Pill";
import { PlatformIcon } from "@/components/ui/PlatformIcon";
import { CalendarMonthView } from "@/components/calendar/CalendarMonthView";
import { CalendarWeekView } from "@/components/calendar/CalendarWeekView";
import { PostComposerModal } from "@/components/calendar/PostComposerModal";
import { PostDetailModal } from "@/components/calendar/PostDetailModal";
import {
  CALENDAR_ANCHOR_DATE,
  CALENDAR_PLATFORM_META,
  CALENDAR_STATUS_META,
  addDays,
  addMonths,
  formatDateKey,
  formatMonthHeading,
  formatReadableDate,
  formatTimeLabel,
  formatWeekHeading,
  useCalendarStore,
} from "@/data/calendarData";
import { cn } from "@/lib/utils";
import type {
  CalendarPlatformFilter,
  CalendarPost,
  CalendarPostStatus,
  CalendarViewMode,
} from "@/types/calendar";
import type { StudioPlatform } from "@/types/studio";

const PLATFORM_FILTERS: { id: CalendarPlatformFilter; label: string }[] = [
  { id: "all", label: "All Platforms" },
  { id: "instagram", label: "Instagram" },
  { id: "facebook", label: "Facebook" },
  { id: "tiktok", label: "TikTok" },
  { id: "linkedin", label: "LinkedIn" },
  { id: "youtube", label: "YouTube" },
];

const STATUS_FILTERS: { id: "all" | CalendarPostStatus; label: string }[] = [
  { id: "all", label: "All Statuses" },
  { id: "draft", label: "Draft" },
  { id: "scheduled", label: "Scheduled" },
  { id: "published", label: "Published" },
];

/**
 * Editorial Content Calendar workspace for /calendar.
 */
export function CalendarWorkspace() {
  const searchParams = useSearchParams();
  const initialPostId = searchParams.get("postId");
  const initialDate = searchParams.get("date");

  return (
    <CalendarWorkspaceInner
      key={`${initialPostId ?? "none"}-${initialDate ?? "anchor"}`}
      initialPostId={initialPostId}
      initialDate={initialDate}
    />
  );
}

function CalendarWorkspaceInner({
  initialPostId,
  initialDate,
}: {
  initialPostId: string | null;
  initialDate: string | null;
}) {
  const {
    posts,
    createPost,
    updatePost,
    deletePost,
    movePost,
    resetSamplePosts,
  } = useCalendarStore();

  const resolvedStartDate = initialDate || CALENDAR_ANCHOR_DATE;
  const [viewMode, setViewMode] = useState<CalendarViewMode>("month");
  const [anchorDate, setAnchorDate] = useState<string>(resolvedStartDate);
  const [selectedDate, setSelectedDate] = useState<string>(resolvedStartDate);
  const [platformFilter, setPlatformFilter] =
    useState<CalendarPlatformFilter>("all");
  const [statusFilter, setStatusFilter] = useState<
    "all" | CalendarPostStatus
  >("all");

  const [draggingPostId, setDraggingPostId] = useState<string | null>(null);
  const [detailPostId, setDetailPostId] = useState<string | null>(
    initialPostId
  );
  const [composerState, setComposerState] = useState<{
    open: boolean;
    editingPost: CalendarPost | null;
    defaultDate: string;
    defaultTime: string;
  }>({
    open: false,
    editingPost: null,
    defaultDate: CALENDAR_ANCHOR_DATE,
    defaultTime: "11:30",
  });

  const [feedbackBanner, setFeedbackBanner] = useState<string | null>(null);

  const showFeedback = (message: string) => {
    setFeedbackBanner(message);
    window.setTimeout(() => {
      setFeedbackBanner((prev) => (prev === message ? null : prev));
    }, 2600);
  };

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesPlatform =
        platformFilter === "all" || post.platform === platformFilter;
      const matchesStatus =
        statusFilter === "all" || post.status === statusFilter;
      return matchesPlatform && matchesStatus;
    });
  }, [posts, platformFilter, statusFilter]);

  const statusCounts = useMemo(() => {
    return posts.reduce(
      (acc, post) => {
        acc[post.status] += 1;
        return acc;
      },
      { draft: 0, scheduled: 0, published: 0 }
    );
  }, [posts]);

  const activeDetailPost = useMemo(
    () => posts.find((p) => p.id === detailPostId) ?? null,
    [posts, detailPostId]
  );

  const handleNavigate = (direction: -1 | 1) => {
    const nextAnchor =
      viewMode === "month"
        ? addMonths(anchorDate, direction)
        : addDays(anchorDate, direction * 7);
    setAnchorDate(nextAnchor);
    setSelectedDate(nextAnchor);
  };

  const handleJumpToday = () => {
    const todayKey = formatDateKey(new Date());
    setAnchorDate(todayKey);
    setSelectedDate(todayKey);
  };

  const openCreateModal = (dateKey = selectedDate, time = "11:30") => {
    setComposerState({
      open: true,
      editingPost: null,
      defaultDate: dateKey,
      defaultTime: time,
    });
  };

  const openEditModal = (post: CalendarPost) => {
    setDetailPostId(null);
    setComposerState({
      open: true,
      editingPost: post,
      defaultDate: post.scheduledDate,
      defaultTime: post.scheduledTime,
    });
  };

  const handleSaveComposer = (
    payload: Omit<CalendarPost, "id">,
    existingId?: string
  ) => {
    if (existingId) {
      updatePost(existingId, payload);
      showFeedback(`Updated "${payload.title}"`);
    } else {
      createPost(payload);
      setSelectedDate(payload.scheduledDate);
      setAnchorDate(payload.scheduledDate);
      showFeedback(
        `Scheduled "${payload.title}" for ${formatReadableDate(payload.scheduledDate)}`
      );
    }
    setComposerState((prev) => ({ ...prev, open: false, editingPost: null }));
  };

  const handleDropOnDate = (postId: string, targetDate: string) => {
    const post = posts.find((p) => p.id === postId);
    if (!post || post.scheduledDate === targetDate) return;
    movePost(postId, targetDate);
    setSelectedDate(targetDate);
    showFeedback(
      `Moved "${post.title}" to ${formatReadableDate(targetDate)}`
    );
  };

  const handleDropOnSlot = (
    postId: string,
    targetDate: string,
    targetTime: string
  ) => {
    const post = posts.find((p) => p.id === postId);
    if (
      !post ||
      (post.scheduledDate === targetDate && post.scheduledTime === targetTime)
    ) {
      return;
    }
    movePost(postId, targetDate, targetTime);
    setSelectedDate(targetDate);
    showFeedback(
      `Moved "${post.title}" to ${formatReadableDate(targetDate)} · ${formatTimeLabel(targetTime)}`
    );
  };

  const handleDuplicatePost = (post: CalendarPost) => {
    const nextDate = addDays(post.scheduledDate, 1);
    createPost({
      ...post,
      title: `${post.title} (Remix)`,
      status: "draft",
      scheduledDate: nextDate,
    });
    setDetailPostId(null);
    showFeedback(`Duplicated to ${formatReadableDate(nextDate)} as Draft`);
  };

  return (
    <div className="relative flex min-h-screen flex-col">
      {/* Warm editorial background glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[520px] bg-studio-dots opacity-45 [mask-image:radial-gradient(ellipse_at_center,black_25%,transparent_78%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 top-20 -z-10 h-80 w-80 rounded-full bg-mint/16 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-0 top-10 -z-10 h-96 w-96 rounded-full bg-coral/14 blur-3xl"
      />

      <FloatingNav
        savedCount={posts.length}
        savedLabel="posts"
        ctaLabel="Schedule Post"
        onFocusPrompt={() => openCreateModal(selectedDate, "11:30")}
      />

      <main className="flex-1 pt-8 pb-12 sm:pt-12">
        <section className="mx-auto max-w-6xl px-4 sm:px-6">
          {/* Editorial Masthead */}
          <Reveal immediate>
            <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
              <div>
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <Badge variant="indigo" pulse>
                    <CalendarDays className="h-3.5 w-3.5" />
                    <span>Editorial Calendar</span>
                  </Badge>
                  <Badge variant="cream" className="font-mono text-[11px]">
                    Drag & Drop · Local Planner
                  </Badge>
                </div>
                <h1 className="font-display text-[clamp(2rem,4.5vw,3.4rem)] font-extrabold leading-[1.02] tracking-tight text-ink">
                  Choreograph your{" "}
                  <span className="text-coral">creative rhythm</span> across
                  every feed.
                </h1>
              </div>

              {/* Status pill summary + Schedule CTA */}
              <div className="flex flex-wrap items-center gap-2.5">
                {(["draft", "scheduled", "published"] as CalendarPostStatus[]).map(
                  (statusKey) => {
                    const meta = CALENDAR_STATUS_META[statusKey];
                    return (
                      <div
                        key={statusKey}
                        className={cn(
                          "inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-semibold",
                          meta.pillClass
                        )}
                      >
                        <span
                          className={cn("h-2 w-2 rounded-full", meta.dotClass)}
                        />
                        <span>
                          {statusCounts[statusKey]} {meta.label}
                        </span>
                      </div>
                    );
                  }
                )}

                <Button
                  variant="coral"
                  size="md"
                  onClick={() => openCreateModal(selectedDate, "11:30")}
                >
                  <Plus className="h-4 w-4" />
                  <span>New Post</span>
                </Button>
              </div>
            </div>
          </Reveal>

          {/* Controls Dock: Navigation, View Switcher, Platform & Status Filters */}
          <Reveal immediate delay={0.07}>
            <div className="mt-7 space-y-4 rounded-[2rem] border border-black/[0.08] bg-white/95 p-4 shadow-float sm:p-5">
              {/* Top row: Month/Week navigation & View Toggle */}
              <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <div className="flex flex-wrap items-center gap-2.5">
                  <div className="inline-flex items-center gap-1 rounded-full border border-black/[0.08] bg-oat/70 p-1">
                    <button
                      type="button"
                      aria-label="Previous period"
                      onClick={() => handleNavigate(-1)}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white text-ink shadow-xs transition-transform active:scale-92 cursor-pointer"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={handleJumpToday}
                      className="rounded-full px-3 py-1 text-xs font-bold text-ink transition-colors hover:bg-white cursor-pointer"
                    >
                      Today
                    </button>
                    <button
                      type="button"
                      aria-label="Next period"
                      onClick={() => handleNavigate(1)}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white text-ink shadow-xs transition-transform active:scale-92 cursor-pointer"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>

                  <h2 className="font-display text-xl font-extrabold text-ink sm:text-2xl">
                    {viewMode === "month"
                      ? formatMonthHeading(anchorDate)
                      : formatWeekHeading(anchorDate)}
                  </h2>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {/* Monthly / Weekly View Switcher */}
                  <div className="inline-flex items-center gap-1 rounded-full border border-black/[0.07] bg-oat/75 p-1">
                    <Pill
                      layoutId="calendar-view-pill"
                      active={viewMode === "month"}
                      onClick={() => setViewMode("month")}
                      activeClassName="bg-ink text-white shadow-sm"
                    >
                      <CalendarDays className="h-3.5 w-3.5" />
                      <span>Monthly</span>
                    </Pill>
                    <Pill
                      layoutId="calendar-view-pill"
                      active={viewMode === "week"}
                      onClick={() => setViewMode("week")}
                      activeClassName="bg-ink text-white shadow-sm"
                    >
                      <CalendarRange className="h-3.5 w-3.5" />
                      <span>Weekly</span>
                    </Pill>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      resetSamplePosts();
                      setAnchorDate(CALENDAR_ANCHOR_DATE);
                      setSelectedDate(CALENDAR_ANCHOR_DATE);
                      showFeedback("Restored sample studio schedule");
                    }}
                    title="Reset demo calendar posts"
                    className="inline-flex items-center gap-1.5 rounded-full border border-black/[0.08] bg-cream px-3 py-2 text-xs font-semibold text-ink-secondary transition-colors hover:bg-oat hover:text-ink cursor-pointer"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Reset Demo</span>
                  </button>
                </div>
              </div>

              {/* Filter row: Platform Pills + Status Pills */}
              <div className="flex flex-col justify-between gap-3 border-t border-black/[0.06] pt-3.5 lg:flex-row lg:items-center">
                <div className="flex flex-wrap items-center gap-1.5 rounded-2xl bg-oat/55 p-1">
                  {PLATFORM_FILTERS.map((item) => {
                    const isPlatform = item.id !== "all";
                    const stripe = isPlatform
                      ? CALENDAR_PLATFORM_META[item.id as StudioPlatform]
                          .stripeClass
                      : undefined;
                    return (
                      <Pill
                        key={item.id}
                        layoutId="calendar-platform-filter"
                        active={platformFilter === item.id}
                        onClick={() => setPlatformFilter(item.id)}
                        activeClassName={stripe ?? "bg-ink"}
                      >
                        <PlatformIcon platform={item.id} />
                        <span>{item.label}</span>
                      </Pill>
                    );
                  })}
                </div>

                <div className="flex flex-wrap items-center gap-1.5">
                  {STATUS_FILTERS.map((item) => {
                    const isActive = statusFilter === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setStatusFilter(item.id)}
                        className={cn(
                          "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer",
                          isActive
                            ? "border-ink bg-ink text-white"
                            : "border-black/[0.08] bg-cream text-ink-secondary hover:text-ink"
                        )}
                      >
                        {item.id !== "all" ? (
                          <span
                            className={cn(
                              "h-1.5 w-1.5 rounded-full",
                              CALENDAR_STATUS_META[item.id].dotClass
                            )}
                          />
                        ) : null}
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </Reveal>

          {/* Subtle drag/action feedback toast */}
          <AnimatePresence>
            {feedbackBanner ? (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="mt-4 inline-flex items-center gap-2 rounded-full border border-mint/40 bg-mint-soft px-4 py-2 text-xs font-semibold text-mint-deep shadow-sm"
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>{feedbackBanner}</span>
              </motion.div>
            ) : null}
          </AnimatePresence>

          {/* Main Calendar View */}
          <div className="mt-6">
            <AnimatePresence mode="wait">
              {viewMode === "month" ? (
                <motion.div
                  key={`month-${anchorDate}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={SPRINGS.gentle}
                >
                  <CalendarMonthView
                    anchorDate={anchorDate}
                    selectedDate={selectedDate}
                    posts={filteredPosts}
                    draggingPostId={draggingPostId}
                    onSelectDate={setSelectedDate}
                    onSelectPost={(post) => setDetailPostId(post.id)}
                    onCreateForDate={(dateKey) =>
                      openCreateModal(dateKey, "11:30")
                    }
                    onDragStartPost={setDraggingPostId}
                    onDragEndPost={() => setDraggingPostId(null)}
                    onDropPostOnDate={handleDropOnDate}
                  />
                </motion.div>
              ) : (
                <motion.div
                  key={`week-${anchorDate}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={SPRINGS.gentle}
                >
                  <CalendarWeekView
                    anchorDate={anchorDate}
                    selectedDate={selectedDate}
                    posts={filteredPosts}
                    draggingPostId={draggingPostId}
                    onSelectDate={setSelectedDate}
                    onSelectPost={(post) => setDetailPostId(post.id)}
                    onCreateForSlot={(dateKey, time) =>
                      openCreateModal(dateKey, time)
                    }
                    onDragStartPost={setDraggingPostId}
                    onDragEndPost={() => setDraggingPostId(null)}
                    onDropPostOnSlot={handleDropOnSlot}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>
      </main>

      <StudioFooter />

      <PostDetailModal
        post={activeDetailPost}
        onClose={() => setDetailPostId(null)}
        onEdit={openEditModal}
        onDelete={(id) => {
          const target = posts.find((p) => p.id === id);
          deletePost(id);
          setDetailPostId(null);
          if (target) showFeedback(`Deleted "${target.title}"`);
        }}
        onDuplicate={handleDuplicatePost}
        onStatusChange={(id, status) => {
          updatePost(id, { status });
          showFeedback(`Marked as ${CALENDAR_STATUS_META[status].label}`);
        }}
        onReschedule={(id, date, time) => {
          movePost(id, date, time);
          showFeedback(
            `Rescheduled to ${formatReadableDate(date)} · ${formatTimeLabel(time)}`
          );
        }}
      />

      <PostComposerModal
        open={composerState.open}
        editingPost={composerState.editingPost}
        defaultDate={composerState.defaultDate}
        defaultTime={composerState.defaultTime}
        onClose={() =>
          setComposerState((prev) => ({
            ...prev,
            open: false,
            editingPost: null,
          }))
        }
        onSave={handleSaveComposer}
      />
    </div>
  );
}
