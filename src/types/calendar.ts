import type { CardAccent } from "@/types/creatorly";
import type { StudioFormat, StudioPlatform, StudioTone } from "@/types/studio";

export type CalendarPostStatus = "draft" | "scheduled" | "published";

export type CalendarViewMode = "month" | "week";

export type CalendarPlatformFilter = "all" | StudioPlatform;

export type PostSource = "sample" | "studio" | "manual";

export interface CalendarPost {
  id: string;
  title: string;
  hook: string;
  caption: string;
  platform: StudioPlatform;
  format: StudioFormat;
  status: CalendarPostStatus;
  /** Local ISO calendar day key: YYYY-MM-DD */
  scheduledDate: string;
  /** 24-hour time string: HH:mm */
  scheduledTime: string;
  hashtags: string[];
  visualNotes: string;
  /** Optional ISO timestamp or sortable key for newest/oldest sorting */
  createdAt?: string;
  /** Distinguishes seeded mock data from user-authored Studio/Calendar posts */
  source?: PostSource;
  /** Optional Studio voice tone & CTA preserved across /studio <-> /posts */
  tone?: StudioTone;
  cta?: string;
}

export interface CalendarPlatformTheme {
  id: StudioPlatform;
  label: string;
  handle: string;
  accent: CardAccent;
  chipBg: string;
  chipText: string;
  borderClass: string;
  stripeClass: string;
  gradientClass: string;
}
