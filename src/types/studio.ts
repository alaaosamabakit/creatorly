import type { CardAccent } from "@/types/creatorly";

export type StudioPlatform =
  | "instagram"
  | "facebook"
  | "tiktok"
  | "linkedin"
  | "youtube";

export type StudioFormat = "post" | "carousel" | "reel";

export type StudioTone = "bold" | "editorial" | "playful" | "minimal";

export interface CarouselSlide {
  slideNumber: number;
  kicker: string;
  headline: string;
  body: string;
}

export interface ReelBeat {
  timecode: string;
  visualCue: string;
  spokenLine: string;
}

export interface GeneratedStudioContent {
  id: string;
  topic: string;
  platform: StudioPlatform;
  format: StudioFormat;
  tone: StudioTone;
  accent: CardAccent;
  hookScore: number;
  hook: string;
  caption: string;
  hashtags: string[];
  cta: string;
  visualTitle: string;
  visualSubtitle: string;
  slides: CarouselSlide[];
  reelBeats: ReelBeat[];
  alternateCtas: string[];
}

export interface SavedStudioDraft {
  draftId: string;
  savedAtLabel: string;
  content: GeneratedStudioContent;
}
