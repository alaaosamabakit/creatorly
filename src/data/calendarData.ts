"use client";

import { useSyncExternalStore } from "react";
import type {
  CalendarPlatformTheme,
  CalendarPost,
  CalendarPostStatus,
} from "@/types/calendar";
import type { GeneratedStudioContent, StudioPlatform } from "@/types/studio";

export const CALENDAR_ANCHOR_DATE = "2026-11-25";

export const CALENDAR_STORAGE_KEY = "creatorly.calendar.posts.v1";

export const CALENDAR_TIME_SLOTS: { value: string; label: string }[] = [
  { value: "08:30", label: "8:30 AM" },
  { value: "11:30", label: "11:30 AM" },
  { value: "14:00", label: "2:00 PM" },
  { value: "17:30", label: "5:30 PM" },
  { value: "20:00", label: "8:00 PM" },
];

export const CALENDAR_PLATFORM_META: Record<
  StudioPlatform,
  CalendarPlatformTheme
> = {
  instagram: {
    id: "instagram",
    label: "Instagram",
    handle: "@creatorly.studio",
    accent: "coral",
    chipBg: "bg-coral-soft",
    chipText: "text-[#c93714]",
    borderClass: "border-coral/30",
    stripeClass: "bg-coral",
    gradientClass: "from-[#FF5C35] via-[#FF7D4D] to-[#FFA66B]",
  },
  facebook: {
    id: "facebook",
    label: "Facebook",
    handle: "Creatorly Community",
    accent: "indigo",
    chipBg: "bg-indigo-soft",
    chipText: "text-indigo",
    borderClass: "border-indigo/30",
    stripeClass: "bg-indigo",
    gradientClass: "from-[#4F46E5] via-[#6366F1] to-[#818CF8]",
  },
  tiktok: {
    id: "tiktok",
    label: "TikTok",
    handle: "@creatorly.ai",
    accent: "mint",
    chipBg: "bg-mint-soft",
    chipText: "text-mint-deep",
    borderClass: "border-mint/40",
    stripeClass: "bg-mint",
    gradientClass: "from-[#0BB878] via-[#10D98E] to-[#5EEAD4]",
  },
  linkedin: {
    id: "linkedin",
    label: "LinkedIn",
    handle: "Creatorly Labs",
    accent: "violet",
    chipBg: "bg-violet-soft",
    chipText: "text-[#7e22ce]",
    borderClass: "border-violet/30",
    stripeClass: "bg-violet",
    gradientClass: "from-[#9333EA] via-[#A855F7] to-[#D946EF]",
  },
  youtube: {
    id: "youtube",
    label: "YouTube",
    handle: "Creatorly TV",
    accent: "coral",
    chipBg: "bg-[#FFE9EE]",
    chipText: "text-[#be123c]",
    borderClass: "border-[#f43f5e]/30",
    stripeClass: "bg-[#f43f5e]",
    gradientClass: "from-[#E11D48] via-[#FF5C35] to-[#FB7185]",
  },
};

export const CALENDAR_STATUS_META: Record<
  CalendarPostStatus,
  {
    label: string;
    dotClass: string;
    pillClass: string;
    description: string;
  }
> = {
  draft: {
    label: "Draft",
    dotClass: "bg-amber-500",
    pillClass: "bg-oat text-ink-secondary border-black/[0.08]",
    description: "In progress locally",
  },
  scheduled: {
    label: "Scheduled",
    dotClass: "bg-indigo",
    pillClass: "bg-indigo-soft text-indigo border-indigo/25",
    description: "Planned on your local calendar",
  },
  published: {
    label: "Published",
    dotClass: "bg-mint",
    pillClass: "bg-mint-soft text-mint-deep border-mint/35",
    description: "Marked complete locally (demo)",
  },
};

export const INITIAL_CALENDAR_POSTS: CalendarPost[] = [
  {
    id: "cal-1",
    title: "Espresso Ritual Ceramic Drop",
    hook: "Most product launches whisper. We sculpted a morning ritual instead.",
    caption:
      "Seven tactile frames showing raw stoneware glazing, morning steam shots, and how small-batch design changes daily focus.",
    platform: "instagram",
    format: "carousel",
    status: "published",
    scheduledDate: "2026-11-18",
    scheduledTime: "11:30",
    hashtags: ["#CreatorlyStudio", "#CeramicCraft", "#LaunchStory"],
    visualNotes: "Warm alabaster backdrop + close-up espresso pour cover.",
    createdAt: "2026-11-16T09:10:00.000Z",
    source: "sample",
    tone: "bold",
  },
  {
    id: "cal-2",
    title: "Why Small Studios Move Faster",
    hook: "Your creative calendar shouldn't feel like an accounting ledger.",
    caption:
      "Three shifts that helped our two-person team replace messy spreadsheets with live visual cards and faster feedback loops.",
    platform: "linkedin",
    format: "post",
    status: "published",
    scheduledDate: "2026-11-23",
    scheduledTime: "08:30",
    hashtags: ["#CreativeOps", "#BrandDesign", "#SmallTeams"],
    visualNotes: "Editorial quote card on crisp cream paper.",
    createdAt: "2026-11-18T11:20:00.000Z",
    source: "sample",
    tone: "editorial",
  },
  {
    id: "cal-3",
    title: "34-Second Studio Remix Loop",
    hook: "POV: You turn one voice note into five native posts before coffee cools.",
    caption:
      "Fast jump-cut walkthrough showing tone switching from Editorial to Playful without losing your human cadence.",
    platform: "tiktok",
    format: "reel",
    status: "scheduled",
    scheduledDate: "2026-11-24",
    scheduledTime: "17:30",
    hashtags: ["#CreatorFlow", "#ShortForm", "#StudioVibes"],
    visualNotes: "9:16 desk overhead + kinetic captions in Mint.",
    createdAt: "2026-11-20T14:00:00.000Z",
    source: "sample",
    tone: "playful",
  },
  {
    id: "cal-4",
    title: "Typography Rules for Thumb-Stops",
    hook: "Stop cramming 90 words onto Slide 1. Give your claim room to breathe.",
    caption:
      "Side-by-side layout breakdown comparing noisy template slides with high-contrast editorial spacing.",
    platform: "instagram",
    format: "carousel",
    status: "scheduled",
    scheduledDate: "2026-11-25",
    scheduledTime: "11:30",
    hashtags: ["#CarouselCraft", "#Typography", "#DesignTips"],
    visualNotes: "Bricolage Grotesque display cover in Electric Coral.",
    createdAt: "2026-11-21T16:45:00.000Z",
    source: "sample",
    tone: "bold",
  },
  {
    id: "cal-5",
    title: "Community Poll: Voice Dial",
    hook: "Which creative energy performs best in your feed right now?",
    caption:
      "Asking our community whether Bold contrarian openers or calm Editorial storytelling earned more meaningful replies this month.",
    platform: "facebook",
    format: "post",
    status: "scheduled",
    scheduledDate: "2026-11-26",
    scheduledTime: "14:00",
    hashtags: ["#CreatorCommunity", "#Storytelling", "#ContentStrategy"],
    visualNotes: "Cobalt Indigo comparison graphic with 2-option callout.",
    createdAt: "2026-11-22T10:15:00.000Z",
    source: "sample",
    tone: "playful",
  },
  {
    id: "cal-6",
    title: "48-Hour Brand Sprint Recap",
    hook: "We rebuilt an entire launch identity in one weekend—here is frame one.",
    caption:
      "Tight 45-second YouTube Short unpacking color palette choices, hook pacing, and what we cut before shipping.",
    platform: "youtube",
    format: "reel",
    status: "draft",
    scheduledDate: "2026-11-27",
    scheduledTime: "17:30",
    hashtags: ["#YouTubeShorts", "#BrandSprint", "#BehindTheScenes"],
    visualNotes: "Vertical timeline overlay + bold crimson/coral lower third.",
    createdAt: "2026-11-23T18:30:00.000Z",
    source: "sample",
    tone: "bold",
  },
  {
    id: "cal-7",
    title: "Friday Taste & Cadence Notes",
    hook: "Consistency gets attention. Recognizable taste keeps people coming back.",
    caption:
      "A calm Friday reflection on building a weekly rhythm that leaves room for experimentation.",
    platform: "linkedin",
    format: "carousel",
    status: "draft",
    scheduledDate: "2026-11-28",
    scheduledTime: "08:30",
    hashtags: ["#CreativeDirection", "#AudienceGrowth"],
    visualNotes: "Ultraviolet minimal 4-card visual brief.",
    createdAt: "2026-11-24T08:05:00.000Z",
    source: "sample",
    tone: "minimal",
  },
  {
    id: "cal-8",
    title: "Behind the Packaging Reveal",
    hook: "Watch the unboxing detail our subscribers paused 4 times to screenshot.",
    caption:
      "Playful short-form reveal highlighting textured paper inserts and custom sticker seals.",
    platform: "tiktok",
    format: "reel",
    status: "scheduled",
    scheduledDate: "2026-11-30",
    scheduledTime: "20:00",
    hashtags: ["#PackagingDesign", "#Unboxing", "#Creatorly"],
    visualNotes: "ASMR tap audio + warm cream daylight framing.",
    createdAt: "2026-11-25T12:00:00.000Z",
    source: "sample",
    tone: "playful",
  },
];

/* ------------------ Local Date Utilities (Timezone-safe) ------------------ */

export function parseDateKey(dateKey: string): Date {
  const [y, m, d] = dateKey.split("-").map(Number);
  return new Date(y, (m || 1) - 1, d || 1);
}

export function formatDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function addDays(dateKey: string, days: number): string {
  const date = parseDateKey(dateKey);
  date.setDate(date.getDate() + days);
  return formatDateKey(date);
}

export function addMonths(dateKey: string, months: number): string {
  const date = parseDateKey(dateKey);
  const targetDay = date.getDate();
  date.setDate(1);
  date.setMonth(date.getMonth() + months);
  const lastDay = new Date(
    date.getFullYear(),
    date.getMonth() + 1,
    0
  ).getDate();
  date.setDate(Math.min(targetDay, lastDay));
  return formatDateKey(date);
}

export function getMonthGridDays(anchorDateKey: string): {
  dateKey: string;
  dayNumber: number;
  inCurrentMonth: boolean;
}[] {
  const anchor = parseDateKey(anchorDateKey);
  const firstOfMonth = new Date(anchor.getFullYear(), anchor.getMonth(), 1);
  const startOffset = firstOfMonth.getDay();
  const gridStart = new Date(
    anchor.getFullYear(),
    anchor.getMonth(),
    1 - startOffset
  );

  const cells: {
    dateKey: string;
    dayNumber: number;
    inCurrentMonth: boolean;
  }[] = [];

  for (let i = 0; i < 42; i++) {
    const cellDate = new Date(
      gridStart.getFullYear(),
      gridStart.getMonth(),
      gridStart.getDate() + i
    );
    cells.push({
      dateKey: formatDateKey(cellDate),
      dayNumber: cellDate.getDate(),
      inCurrentMonth: cellDate.getMonth() === anchor.getMonth(),
    });
  }

  return cells;
}

export function getWeekDays(anchorDateKey: string): {
  dateKey: string;
  shortDay: string;
  dayNumber: number;
  monthShort: string;
}[] {
  const anchor = parseDateKey(anchorDateKey);
  const startOfWeek = new Date(
    anchor.getFullYear(),
    anchor.getMonth(),
    anchor.getDate() - anchor.getDay()
  );

  const days: {
    dateKey: string;
    shortDay: string;
    dayNumber: number;
    monthShort: string;
  }[] = [];

  for (let i = 0; i < 7; i++) {
    const d = new Date(
      startOfWeek.getFullYear(),
      startOfWeek.getMonth(),
      startOfWeek.getDate() + i
    );
    days.push({
      dateKey: formatDateKey(d),
      shortDay: d.toLocaleDateString("en-US", { weekday: "short" }),
      dayNumber: d.getDate(),
      monthShort: d.toLocaleDateString("en-US", { month: "short" }),
    });
  }

  return days;
}

export function formatMonthHeading(dateKey: string): string {
  return parseDateKey(dateKey).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}

export function formatWeekHeading(dateKey: string): string {
  const week = getWeekDays(dateKey);
  const first = week[0];
  const last = week[6];
  if (first.monthShort === last.monthShort) {
    return `${first.monthShort} ${first.dayNumber} – ${last.dayNumber}`;
  }
  return `${first.monthShort} ${first.dayNumber} – ${last.monthShort} ${last.dayNumber}`;
}

export function formatReadableDate(dateKey: string): string {
  return parseDateKey(dateKey).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatTimeLabel(time24: string): string {
  const [hStr, mStr] = time24.split(":");
  const h = Number(hStr);
  const m = Number(mStr);
  if (Number.isNaN(h) || Number.isNaN(m)) return time24;
  const suffix = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${String(m).padStart(2, "0")} ${suffix}`;
}

/* ------------------ Unified Local Store (Calendar + Studio + Posts) ------------------ */

const listeners = new Set<() => void>();
let cachedRaw: string | null = null;
let cachedParsed: CalendarPost[] = INITIAL_CALENDAR_POSTS;

function emitChange() {
  listeners.forEach((listener) => listener());
}

function subscribeCalendarStore(listener: () => void): () => void {
  listeners.add(listener);
  const onStorage = (e: StorageEvent) => {
    if (e.key === CALENDAR_STORAGE_KEY) {
      listener();
    }
  };
  if (typeof window !== "undefined") {
    window.addEventListener("storage", onStorage);
  }
  return () => {
    listeners.delete(listener);
    if (typeof window !== "undefined") {
      window.removeEventListener("storage", onStorage);
    }
  };
}

function getCalendarSnapshot(): CalendarPost[] {
  if (typeof window === "undefined") {
    return INITIAL_CALENDAR_POSTS;
  }
  try {
    const raw = window.localStorage.getItem(CALENDAR_STORAGE_KEY);
    if (!raw) {
      cachedRaw = null;
      cachedParsed = INITIAL_CALENDAR_POSTS;
      return INITIAL_CALENDAR_POSTS;
    }
    if (raw === cachedRaw) {
      return cachedParsed;
    }
    const parsed = JSON.parse(raw) as unknown;
    if (Array.isArray(parsed)) {
      cachedRaw = raw;
      cachedParsed = parsed as CalendarPost[];
      return cachedParsed;
    }
  } catch {
    return INITIAL_CALENDAR_POSTS;
  }
  return INITIAL_CALENDAR_POSTS;
}

function getServerSnapshot(): CalendarPost[] {
  return INITIAL_CALENDAR_POSTS;
}

function persistPosts(nextPosts: CalendarPost[]) {
  if (typeof window === "undefined") return;
  const serialized = JSON.stringify(nextPosts);
  cachedRaw = serialized;
  cachedParsed = nextPosts;
  try {
    window.localStorage.setItem(CALENDAR_STORAGE_KEY, serialized);
  } catch {
    // Ignore storage quota errors in restricted environments
  }
  emitChange();
}

export function useCalendarStore() {
  const posts = useSyncExternalStore(
    subscribeCalendarStore,
    getCalendarSnapshot,
    getServerSnapshot
  );

  const createPost = (
    input: Omit<CalendarPost, "id">
  ): CalendarPost => {
    const created: CalendarPost = {
      ...input,
      createdAt: input.createdAt ?? new Date().toISOString(),
      source: input.source ?? "manual",
      id: `cal-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    };
    persistPosts([...posts, created]);
    return created;
  };

  const updatePost = (id: string, patch: Partial<CalendarPost>) => {
    persistPosts(
      posts.map((post) => (post.id === id ? { ...post, ...patch } : post))
    );
  };

  const deletePost = (id: string) => {
    persistPosts(posts.filter((post) => post.id !== id));
  };

  const movePost = (
    id: string,
    scheduledDate: string,
    scheduledTime?: string
  ) => {
    persistPosts(
      posts.map((post) =>
        post.id === id
          ? {
              ...post,
              scheduledDate,
              scheduledTime: scheduledTime ?? post.scheduledTime,
            }
          : post
      )
    );
  };

  /**
   * Saves a Studio draft directly into the unified local post store, or updates
   * an existing post when editing from /posts -> /studio.
   */
  const saveStudioDraft = (
    studioContent: GeneratedStudioContent,
    existingPostId?: string | null
  ): CalendarPost => {
    if (existingPostId) {
      const existing = posts.find((p) => p.id === existingPostId);
      if (existing) {
        const updated: CalendarPost = {
          ...existing,
          title: studioContent.topic,
          hook: studioContent.hook,
          caption: studioContent.caption,
          platform: studioContent.platform,
          format: studioContent.format,
          hashtags: studioContent.hashtags,
          cta: studioContent.cta,
          tone: studioContent.tone,
          visualNotes: studioContent.visualSubtitle,
        };
        persistPosts(
          posts.map((p) => (p.id === existingPostId ? updated : p))
        );
        return updated;
      }
    }

    const created: CalendarPost = {
      id: `studio-post-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      title: studioContent.topic,
      hook: studioContent.hook,
      caption: studioContent.caption,
      platform: studioContent.platform,
      format: studioContent.format,
      status: "draft",
      scheduledDate: CALENDAR_ANCHOR_DATE,
      scheduledTime: "11:30",
      hashtags: studioContent.hashtags,
      visualNotes: studioContent.visualSubtitle,
      createdAt: new Date().toISOString(),
      source: "studio",
      tone: studioContent.tone,
      cta: studioContent.cta,
    };
    persistPosts([created, ...posts]);
    return created;
  };

  const resetSamplePosts = () => {
    if (typeof window !== "undefined") {
      try {
        window.localStorage.removeItem(CALENDAR_STORAGE_KEY);
      } catch {
        // Ignore
      }
    }
    cachedRaw = null;
    cachedParsed = INITIAL_CALENDAR_POSTS;
    emitChange();
  };

  return {
    posts,
    createPost,
    updatePost,
    deletePost,
    movePost,
    saveStudioDraft,
    resetSamplePosts,
  };
}
