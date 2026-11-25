import type { CardAccent } from "@/types/creatorly";

export type ReelPlatform = "instagram" | "tiktok" | "youtube";

export type ReelAspectRatio = "9:16" | "4:5" | "1:1";

export type CaptionStyleId = "kinetic" | "editorial" | "coral-pop" | "minimal";

export type ReelGradientId =
  | "coral-sunset"
  | "indigo-electric"
  | "mint-atelier"
  | "violet-pulse"
  | "obsidian-ink";

export interface ReelScene {
  id: string;
  title: string;
  durationSec: number;
  scriptText: string;
  onScreenText: string;
  visualDescription: string;
  gradientId: ReelGradientId;
  mediaAssetId: string | null;
}

export interface ReelProject {
  id: string;
  title: string;
  platform: ReelPlatform;
  aspectRatio: ReelAspectRatio;
  targetDurationSec: number;
  captionStyle: CaptionStyleId;
  status: "local-draft";
  updatedAt: string;
  scenes: ReelScene[];
}

export type MediaAssetKind = "image" | "video";

export interface MediaAssetRecord {
  id: string;
  name: string;
  mimeType: string;
  kind: MediaAssetKind;
  sizeBytes: number;
  createdAt: string;
  blob: Blob;
}

export interface MediaAssetView {
  id: string;
  name: string;
  mimeType: string;
  kind: MediaAssetKind;
  sizeBytes: number;
  createdAt: string;
  objectUrl: string;
}

export interface ReelPlatformConfig {
  id: ReelPlatform;
  label: string;
  shortLabel: string;
  handle: string;
  accent: CardAccent;
}
