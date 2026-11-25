export type PlatformId =
  | "all"
  | "instagram"
  | "tiktok"
  | "x"
  | "linkedin"
  | "youtube";

export type SocialChannel = Exclude<PlatformId, "all">;

export type ToneId = "electric" | "editorial" | "playful" | "minimal";

export type CardAccent = "coral" | "indigo" | "mint" | "violet";

export interface SparkVariation {
  hook: string;
  caption: string;
  cta: string;
  hookScore: number;
}

export interface SparkCard {
  id: string;
  platform: SocialChannel;
  formatLabel: string;
  tone: ToneId;
  accent: CardAccent;
  topicTag: string;
  visualHeadline: string;
  visualSubline: string;
  durationOrSlides: string;
  tags: string[];
  estimatedReach: string;
  bestTime: string;
  slidesOrBeats: string[];
  variations: SparkVariation[];
}

export interface HookLabOption {
  id: string;
  styleLabel: string;
  hookText: string;
  score: number;
  retentionBoost: string;
  accent: CardAccent;
  breakdown: string;
}

export interface CadenceDay {
  day: string;
  shortDay: string;
  platform: SocialChannel;
  title: string;
  time: string;
  accent: CardAccent;
  energy: number;
}
