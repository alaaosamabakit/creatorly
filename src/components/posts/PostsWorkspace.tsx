"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowUpDown,
  FolderKanban,
  LayoutGrid,
  List,
  Plus,
  RotateCcw,
  Search,
  Sparkles,
  X,
} from "lucide-react";
import { FloatingNav } from "@/components/layout/FloatingNav";
import { StudioFooter } from "@/components/layout/StudioFooter";
import { Reveal } from "@/components/motion/Reveal";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Pill } from "@/components/ui/Pill";
import { PlatformIcon } from "@/components/ui/PlatformIcon";
import { PostComposerModal } from "@/components/calendar/PostComposerModal";
import { PostDetailModal } from "@/components/calendar/PostDetailModal";
import { PostLibraryCard } from "@/components/posts/PostLibraryCard";
import {
  CALENDAR_ANCHOR_DATE,
  CALENDAR_PLATFORM_META,
  CALENDAR_STATUS_META,
  addDays,
  formatReadableDate,
  formatTimeLabel,
  useCalendarStore,
} from "@/data/calendarData";
import { STUDIO_FORMATS } from "@/data/studioGenerator";
import { cn } from "@/lib/utils";
import type {
  CalendarPlatformFilter,
  CalendarPost,
  CalendarPostStatus,
} from "@/types/calendar";
import type { StudioFormat, StudioPlatform } from "@/types/studio";

type StatusTab = "all" | CalendarPostStatus;
type FormatFilter = "all" | StudioFormat;
type SortOption = "newest" | "oldest" | "scheduled";

const STATUS_TABS: { id: StatusTab; label: string }[] = [
  { id: "all", label: "All Posts" },
  { id: "draft", label: "Drafts" },
  { id: "scheduled", label: "Scheduled" },
  { id: "published", label: "Published" },
];

const PLATFORM_FILTERS: { id: CalendarPlatformFilter; label: string }[] = [
  { id: "all", label: "All Platforms" },
  { id: "instagram", label: "Instagram" },
  { id: "facebook", label: "Facebook" },
  { id: "tiktok", label: "TikTok" },
  { id: "linkedin", label: "LinkedIn" },
  { id: "youtube", label: "YouTube" },
];

/**
 * Editorial Posts Manager library for /posts, backed by the unified local post store.
 */
export function PostsWorkspace() {
  const {
    posts,
    createPost,
    updatePost,
    deletePost,
    movePost,
    resetSamplePosts,
  } = useCalendarStore();

  const [statusTab, setStatusTab] = useState<StatusTab>("all");
  const [platformFilter, setPlatformFilter] =
    useState<CalendarPlatformFilter>("all");
  const [formatFilter, setFormatFilter] = useState<FormatFilter>("all");
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");

  const [detailPostId, setDetailPostId] = useState<string | null>(null);
  const [composerState, setComposerState] = useState<{
    open: boolean;
    editingPost: CalendarPost | null;
  }>({
    open: false,
    editingPost: null,
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    window.setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 2400);
  };

  const counts = useMemo(() => {
    return posts.reduce(
      (acc, post) => {
        acc.all += 1;
        acc[post.status] += 1;
        return acc;
      },
      { all: 0, draft: 0, scheduled: 0, published: 0 }
    );
  }, [posts]);

  const filteredAndSortedPosts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    const filtered = posts.filter((post) => {
      if (statusTab !== "all" && post.status !== statusTab) return false;
      if (platformFilter !== "all" && post.platform !== platformFilter) {
        return false;
      }
      if (formatFilter !== "all" && post.format !== formatFilter) return false;

      if (query) {
        const haystack = [
          post.title,
          post.hook,
          post.caption,
          post.visualNotes,
          ...post.hashtags,
        ]
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(query)) return false;
      }

      return true;
    });

    return [...filtered].sort((a, b) => {
      if (sortBy === "scheduled") {
        const keyA = `${a.scheduledDate} ${a.scheduledTime}`;
        const keyB = `${b.scheduledDate} ${b.scheduledTime}`;
        return keyA.localeCompare(keyB);
      }

      const createdA = a.createdAt ?? `${a.scheduledDate}T${a.scheduledTime}`;
      const createdB = b.createdAt ?? `${b.scheduledDate}T${b.scheduledTime}`;
      if (sortBy === "oldest") {
        return createdA.localeCompare(createdB);
      }
      return createdB.localeCompare(createdA);
    });
  }, [posts, statusTab, platformFilter, formatFilter, searchQuery, sortBy]);

  const activeDetailPost = useMemo(
    () => posts.find((p) => p.id === detailPostId) ?? null,
    [posts, detailPostId]
  );

  const handleSaveComposer = (
    payload: Omit<CalendarPost, "id">,
    existingId?: string
  ) => {
    if (existingId) {
      updatePost(existingId, payload);
      showToast(`Updated "${payload.title}"`);
    } else {
      createPost({ ...payload, source: "manual" });
      showToast(`Added "${payload.title}" to library`);
    }
    setComposerState({ open: false, editingPost: null });
  };

  const handleDuplicate = (post: CalendarPost) => {
    const nextDate = addDays(post.scheduledDate, 1);
    createPost({
      ...post,
      title: `${post.title} (Copy)`,
      status: "draft",
      source: "manual",
      scheduledDate: nextDate,
      createdAt: new Date().toISOString(),
    });
    setDetailPostId(null);
    showToast(`Duplicated "${post.title}" as Draft`);
  };

  const handleDelete = (id: string) => {
    const target = posts.find((p) => p.id === id);
    deletePost(id);
    if (detailPostId === id) setDetailPostId(null);
    if (target) showToast(`Removed "${target.title}"`);
  };

  return (
    <div className="relative flex min-h-screen flex-col">
      {/* Ambient studio backdrop */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[520px] bg-studio-dots opacity-45 [mask-image:radial-gradient(ellipse_at_center,black_25%,transparent_78%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 top-20 -z-10 h-80 w-80 rounded-full bg-violet/14 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-0 top-12 -z-10 h-96 w-96 rounded-full bg-coral/14 blur-3xl"
      />

      <FloatingNav
        savedCount={posts.length}
        savedLabel="posts"
        ctaLabel="New Post"
        onFocusPrompt={() =>
          setComposerState({ open: true, editingPost: null })
        }
      />

      <main className="flex-1 pt-8 pb-12 sm:pt-12">
        <section className="mx-auto max-w-6xl px-4 sm:px-6">
          {/* Editorial Masthead */}
          <Reveal immediate>
            <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
              <div>
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <Badge variant="violet" pulse>
                    <FolderKanban className="h-3.5 w-3.5" />
                    <span>Posts Manager</span>
                  </Badge>
                  <Badge variant="cream" className="font-mono text-[11px]">
                    Local Content Library · Demo Publishing Only
                  </Badge>
                </div>
                <h1 className="font-display text-[clamp(2rem,4.5vw,3.4rem)] font-extrabold leading-[1.02] tracking-tight text-ink">
                  Every draft, spark & drop in{" "}
                  <span className="text-violet">one creative archive</span>.
                </h1>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    resetSamplePosts();
                    showToast("Restored sample Creatorly posts");
                  }}
                  className="inline-flex items-center gap-1.5 rounded-full border border-black/[0.08] bg-white px-3.5 py-2 text-xs font-semibold text-ink-secondary shadow-xs transition-colors hover:bg-oat hover:text-ink cursor-pointer"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>Reset Sample Data</span>
                </button>

                <Button
                  variant="coral"
                  size="md"
                  onClick={() =>
                    setComposerState({ open: true, editingPost: null })
                  }
                >
                  <Plus className="h-4 w-4" />
                  <span>New Post</span>
                </Button>
              </div>
            </div>
          </Reveal>

          {/* Controls & Filtering Dock */}
          <Reveal immediate delay={0.07}>
            <div className="mt-7 space-y-4 rounded-[2rem] border border-black/[0.08] bg-white/95 p-4 shadow-float sm:p-5">
              {/* Row 1: Status tabs + Search + View toggle */}
              <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
                <div className="flex flex-wrap items-center gap-1 rounded-2xl border border-black/[0.06] bg-oat/70 p-1">
                  {STATUS_TABS.map((tab) => (
                    <Pill
                      key={tab.id}
                      layoutId="posts-status-tab"
                      active={statusTab === tab.id}
                      onClick={() => setStatusTab(tab.id)}
                      activeClassName="bg-ink text-white shadow-sm"
                    >
                      <span>{tab.label}</span>
                      <span className="rounded-full bg-white/20 px-1.5 py-0.5 font-mono text-[10px]">
                        {counts[tab.id]}
                      </span>
                    </Pill>
                  ))}
                </div>

                <div className="flex flex-1 flex-wrap items-center gap-2.5 lg:justify-end">
                  {/* Search */}
                  <div className="relative min-w-[220px] flex-1 sm:max-w-xs">
                    <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search title, caption, or topic..."
                      aria-label="Search posts"
                      className="w-full rounded-full border border-black/[0.09] bg-cream/80 py-2 pl-9 pr-8 text-xs font-medium text-ink placeholder:text-ink-muted focus:border-indigo focus:bg-white focus:outline-none sm:text-sm"
                    />
                    {searchQuery ? (
                      <button
                        type="button"
                        onClick={() => setSearchQuery("")}
                        aria-label="Clear search"
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-full p-0.5 text-ink-muted hover:text-ink cursor-pointer"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    ) : null}
                  </div>

                  {/* Sort selector */}
                  <div className="inline-flex items-center gap-1.5 rounded-full border border-black/[0.08] bg-cream px-3 py-1.5">
                    <ArrowUpDown className="h-3.5 w-3.5 text-indigo" />
                    <select
                      aria-label="Sort posts"
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as SortOption)}
                      className="bg-transparent text-xs font-semibold text-ink focus:outline-none cursor-pointer"
                    >
                      <option value="newest">Newest First</option>
                      <option value="oldest">Oldest First</option>
                      <option value="scheduled">Scheduled Date</option>
                    </select>
                  </div>

                  {/* Grid / List toggle */}
                  <div className="inline-flex items-center gap-1 rounded-full border border-black/[0.07] bg-oat/75 p-1">
                    <button
                      type="button"
                      aria-label="Grid view"
                      onClick={() => setViewMode("grid")}
                      className={cn(
                        "inline-flex h-8 w-8 items-center justify-center rounded-full transition-colors cursor-pointer",
                        viewMode === "grid"
                          ? "bg-ink text-white shadow-xs"
                          : "text-ink-secondary hover:text-ink"
                      )}
                    >
                      <LayoutGrid className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      aria-label="List view"
                      onClick={() => setViewMode("list")}
                      className={cn(
                        "inline-flex h-8 w-8 items-center justify-center rounded-full transition-colors cursor-pointer",
                        viewMode === "list"
                          ? "bg-ink text-white shadow-xs"
                          : "text-ink-secondary hover:text-ink"
                      )}
                    >
                      <List className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Row 2: Platform + Format filters */}
              <div className="flex flex-col justify-between gap-3 border-t border-black/[0.06] pt-3.5 lg:flex-row lg:items-center">
                <div className="flex flex-wrap items-center gap-1.5 rounded-2xl bg-oat/55 p-1">
                  {PLATFORM_FILTERS.map((item) => {
                    const stripe =
                      item.id !== "all"
                        ? CALENDAR_PLATFORM_META[item.id as StudioPlatform]
                            .stripeClass
                        : undefined;
                    return (
                      <Pill
                        key={item.id}
                        layoutId="posts-platform-filter"
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
                  <span className="mr-1 font-mono text-[10px] font-semibold uppercase tracking-wider text-ink-muted">
                    Format:
                  </span>
                  <button
                    type="button"
                    onClick={() => setFormatFilter("all")}
                    className={cn(
                      "rounded-full border px-3 py-1 text-xs font-semibold transition-colors cursor-pointer",
                      formatFilter === "all"
                        ? "border-ink bg-ink text-white"
                        : "border-black/[0.08] bg-cream text-ink-secondary hover:text-ink"
                    )}
                  >
                    All
                  </button>
                  {STUDIO_FORMATS.map((fmt) => (
                    <button
                      key={fmt.id}
                      type="button"
                      onClick={() => setFormatFilter(fmt.id)}
                      className={cn(
                        "rounded-full border px-3 py-1 text-xs font-semibold transition-colors cursor-pointer",
                        formatFilter === fmt.id
                          ? "border-indigo bg-indigo text-white"
                          : "border-black/[0.08] bg-cream text-ink-secondary hover:text-ink"
                      )}
                    >
                      {fmt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>

          {/* Local / Demo clarity note + live feedback toast */}
          <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
            <p className="text-xs font-medium text-ink-muted">
              Showing{" "}
              <strong className="font-semibold text-ink">
                {filteredAndSortedPosts.length}
              </strong>{" "}
              of {posts.length} posts · Synced locally with AI Studio drafts &
              Calendar (external social publishing is not connected).
            </p>

            <AnimatePresence>
              {toastMessage ? (
                <motion.span
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className="inline-flex items-center gap-1.5 rounded-full border border-mint/40 bg-mint-soft px-3.5 py-1 text-xs font-semibold text-mint-deep"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>{toastMessage}</span>
                </motion.span>
              ) : null}
            </AnimatePresence>
          </div>

          {/* Posts Collection */}
          <div className="mt-5">
            {filteredAndSortedPosts.length === 0 ? (
              <div className="rounded-[2rem] border border-dashed border-black/15 bg-white/80 p-12 text-center shadow-float">
                <FolderKanban className="mx-auto h-7 w-7 text-violet" />
                <h2 className="mt-3 font-display text-xl font-extrabold text-ink">
                  No matching posts found
                </h2>
                <p className="mt-1 text-sm text-ink-secondary">
                  Try clearing your search or filters, or craft a brand-new post
                  here.
                </p>
                <div className="mt-5 flex flex-wrap justify-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setStatusTab("all");
                      setPlatformFilter("all");
                      setFormatFilter("all");
                      setSearchQuery("");
                    }}
                  >
                    Clear Filters
                  </Button>
                  <Button
                    variant="coral"
                    size="sm"
                    onClick={() =>
                      setComposerState({ open: true, editingPost: null })
                    }
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>New Post</span>
                  </Button>
                </div>
              </div>
            ) : (
              <div
                className={cn(
                  viewMode === "grid"
                    ? "grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
                    : "flex flex-col gap-3.5"
                )}
              >
                <AnimatePresence mode="popLayout">
                  {filteredAndSortedPosts.map((post) => (
                    <PostLibraryCard
                      key={post.id}
                      post={post}
                      viewMode={viewMode}
                      onInspect={(item) => setDetailPostId(item.id)}
                      onEdit={(item) =>
                        setComposerState({ open: true, editingPost: item })
                      }
                      onDuplicate={handleDuplicate}
                      onDelete={handleDelete}
                    />
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </section>
      </main>

      <StudioFooter />

      <PostDetailModal
        post={activeDetailPost}
        onClose={() => setDetailPostId(null)}
        onEdit={(post) => {
          setDetailPostId(null);
          setComposerState({ open: true, editingPost: post });
        }}
        onDelete={handleDelete}
        onDuplicate={handleDuplicate}
        onStatusChange={(id, status) => {
          updatePost(id, { status });
          showToast(`Marked as ${CALENDAR_STATUS_META[status].label}`);
        }}
        onReschedule={(id, date, time) => {
          movePost(id, date, time);
          showToast(
            `Rescheduled to ${formatReadableDate(date)} · ${formatTimeLabel(time)}`
          );
        }}
      />

      <PostComposerModal
        open={composerState.open}
        editingPost={composerState.editingPost}
        defaultDate={
          composerState.editingPost?.scheduledDate ?? CALENDAR_ANCHOR_DATE
        }
        defaultTime={composerState.editingPost?.scheduledTime ?? "11:30"}
        onClose={() => setComposerState({ open: false, editingPost: null })}
        onSave={handleSaveComposer}
      />
    </div>
  );
}
