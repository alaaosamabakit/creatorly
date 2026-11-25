"use client";

import { useSyncExternalStore } from "react";
import type {
  CaptionStyleId,
  ReelAspectRatio,
  ReelGradientId,
  ReelPlatform,
  ReelPlatformConfig,
  ReelProject,
  ReelScene,
} from "@/types/reels";

export const REELS_STORAGE_KEY = "creatorly.reels.projects.v1";

export const REEL_PLATFORMS: ReelPlatformConfig[] = [
  {
    id: "instagram",
    label: "Instagram Reels",
    shortLabel: "IG Reels",
    handle: "@creatorly.studio",
    accent: "coral",
  },
  {
    id: "tiktok",
    label: "TikTok",
    shortLabel: "TikTok",
    handle: "@creatorly.ai",
    accent: "mint",
  },
  {
    id: "youtube",
    label: "YouTube Shorts",
    shortLabel: "YT Shorts",
    handle: "Creatorly TV",
    accent: "indigo",
  },
];

export const REEL_ASPECT_RATIOS: {
  id: ReelAspectRatio;
  label: string;
  hint: string;
}[] = [
  { id: "9:16", label: "9:16", hint: "Full Vertical" },
  { id: "4:5", label: "4:5", hint: "Tall Feed" },
  { id: "1:1", label: "1:1", hint: "Square Cut" },
];

export const REEL_GRADIENTS: {
  id: ReelGradientId;
  label: string;
  bgClass: string;
  swatchHex: string;
}[] = [
  {
    id: "coral-sunset",
    label: "Electric Coral",
    bgClass: "from-[#FF5C35] via-[#FF7A45] to-[#FFA96B]",
    swatchHex: "#FF5C35",
  },
  {
    id: "indigo-electric",
    label: "Cobalt Indigo",
    bgClass: "from-[#4F46E5] via-[#6366F1] to-[#8B5CF6]",
    swatchHex: "#4F46E5",
  },
  {
    id: "mint-atelier",
    label: "Acid Mint",
    bgClass: "from-[#06744C] via-[#10D98E] to-[#5EEAD4]",
    swatchHex: "#10D98E",
  },
  {
    id: "violet-pulse",
    label: "Ultraviolet",
    bgClass: "from-[#7E22CE] via-[#A855F7] to-[#EC4899]",
    swatchHex: "#A855F7",
  },
  {
    id: "obsidian-ink",
    label: "Studio Ink",
    bgClass: "from-[#111116] via-[#272736] to-[#4338CA]",
    swatchHex: "#111116",
  },
];

export const CAPTION_STYLES: {
  id: CaptionStyleId;
  label: string;
  description: string;
}[] = [
  {
    id: "kinetic",
    label: "Kinetic Pill",
    description: "Crisp white pill sticker with high contrast",
  },
  {
    id: "editorial",
    label: "Editorial Display",
    description: "Bold oversized type directly on frame",
  },
  {
    id: "coral-pop",
    label: "Coral Pop",
    description: "Vibrant Electric Coral highlight ribbon",
  },
  {
    id: "minimal",
    label: "Minimal Sub",
    description: "Subtle dark glass lower-third subtitle",
  },
];

export const INITIAL_REEL_PROJECTS: ReelProject[] = [
  {
    id: "reel-proj-1",
    title: "Tactile Ceramic Mug Launch",
    platform: "instagram",
    aspectRatio: "9:16",
    targetDurationSec: 30,
    captionStyle: "kinetic",
    status: "local-draft",
    updatedAt: "2026-11-25T10:30:00.000Z",
    scenes: [
      {
        id: "scene-1",
        title: "01 · Pattern-Interrupt Opener",
        durationSec: 4,
        scriptText:
          "Stop scrolling—watch how one stoneware pour turns morning coffee into a tactile studio ritual.",
        onScreenText: "Why we sculpted a slower morning ☕",
        visualDescription:
          "Tight macro shot of espresso crema swirling inside warm cream ceramic.",
        gradientId: "coral-sunset",
        mediaAssetId: null,
      },
      {
        id: "scene-2",
        title: "02 · Raw Craft Process",
        durationSec: 8,
        scriptText:
          "We tested fourteen matte glazes before landing on a finish that feels warm straight out of the kiln.",
        onScreenText: "14 glaze tests. 1 unmistakable texture.",
        visualDescription:
          "Quick 2-frame cuts across sketchpad notes, clay wheel, and kiln shelf.",
        gradientId: "indigo-electric",
        mediaAssetId: null,
      },
      {
        id: "scene-3",
        title: "03 · Studio Desk Styling",
        durationSec: 10,
        scriptText:
          "Designed to sit beside your notebook and camera—not buried inside a kitchen cabinet.",
        onScreenText: "Built for creative desks & calm mornings",
        visualDescription:
          "Overhead natural daylight pan across desk setup and packaging box.",
        gradientId: "mint-atelier",
        mediaAssetId: null,
      },
      {
        id: "scene-4",
        title: "04 · Loop & Drop Callout",
        durationSec: 6,
        scriptText:
          "First small-batch drop opens Friday at 11 AM. Save this reel so you don't miss the link.",
        onScreenText: "Small batch drops Friday · Save for later",
        visualDescription:
          "Clean top-down shot matching Frame 1 for a seamless video loop.",
        gradientId: "violet-pulse",
        mediaAssetId: null,
      },
    ],
  },
  {
    id: "reel-proj-2",
    title: "3 Carousel Spacing Fixes",
    platform: "tiktok",
    aspectRatio: "9:16",
    targetDurationSec: 25,
    captionStyle: "coral-pop",
    status: "local-draft",
    updatedAt: "2026-11-24T16:15:00.000Z",
    scenes: [
      {
        id: "scene-2-1",
        title: "01 · Bold Hook",
        durationSec: 4,
        scriptText:
          "Your carousel isn't boring—your margins are just suffocating the headline.",
        onScreenText: "Give Slide 1 room to breathe ✨",
        visualDescription:
          "Screen recording toggle showing cramped slide vs. spacious editorial layout.",
        gradientId: "obsidian-ink",
        mediaAssetId: null,
      },
      {
        id: "scene-2-2",
        title: "02 · Contrast Rule",
        durationSec: 9,
        scriptText:
          "Cut body copy by half, bump your display scale, and anchor one accent color.",
        onScreenText: "1 accent color + 40% whitespace",
        visualDescription:
          "Rapid highlight sweep across Electric Coral typography.",
        gradientId: "coral-sunset",
        mediaAssetId: null,
      },
      {
        id: "scene-2-3",
        title: "03 · Save Prompt",
        durationSec: 6,
        scriptText:
          "Try this grid on your next drop and watch your save rate climb.",
        onScreenText: "Steal this layout for tonight's post",
        visualDescription: "Final before/after split card.",
        gradientId: "indigo-electric",
        mediaAssetId: null,
      },
    ],
  },
];

/* ------------------ LocalStorage Store (useSyncExternalStore) ------------------ */

const listeners = new Set<() => void>();
let cachedRaw: string | null = null;
let cachedParsed: ReelProject[] = INITIAL_REEL_PROJECTS;

function emitChange() {
  listeners.forEach((l) => l());
}

function subscribeProjects(listener: () => void): () => void {
  listeners.add(listener);
  const onStorage = (e: StorageEvent) => {
    if (e.key === REELS_STORAGE_KEY) listener();
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

function getProjectsSnapshot(): ReelProject[] {
  if (typeof window === "undefined") return INITIAL_REEL_PROJECTS;
  try {
    const raw = window.localStorage.getItem(REELS_STORAGE_KEY);
    if (!raw) {
      cachedRaw = null;
      cachedParsed = INITIAL_REEL_PROJECTS;
      return INITIAL_REEL_PROJECTS;
    }
    if (raw === cachedRaw) return cachedParsed;
    const parsed = JSON.parse(raw) as unknown;
    if (Array.isArray(parsed) && parsed.length > 0) {
      cachedRaw = raw;
      cachedParsed = parsed as ReelProject[];
      return cachedParsed;
    }
  } catch {
    return INITIAL_REEL_PROJECTS;
  }
  return INITIAL_REEL_PROJECTS;
}

function getServerSnapshot(): ReelProject[] {
  return INITIAL_REEL_PROJECTS;
}

function persistProjects(next: ReelProject[]) {
  if (typeof window === "undefined") return;
  const serialized = JSON.stringify(next);
  cachedRaw = serialized;
  cachedParsed = next;
  try {
    window.localStorage.setItem(REELS_STORAGE_KEY, serialized);
  } catch {
    // Ignore storage quota issues
  }
  emitChange();
}

export function createBlankScene(index: number): ReelScene {
  const gradient = REEL_GRADIENTS[index % REEL_GRADIENTS.length].id;
  return {
    id: `scene-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    title: `${String(index + 1).padStart(2, "0")} · New Scene`,
    durationSec: 5,
    scriptText: "Write your voiceover beat or talking point here.",
    onScreenText: "Punchy on-screen hook",
    visualDescription: "Describe framing, motion, or B-roll cut.",
    gradientId: gradient,
    mediaAssetId: null,
  };
}

export function useReelsProjectsStore() {
  const projects = useSyncExternalStore(
    subscribeProjects,
    getProjectsSnapshot,
    getServerSnapshot
  );

  const updateProject = (
    projectId: string,
    patch: Partial<ReelProject>
  ) => {
    const now = new Date().toISOString();
    persistProjects(
      projects.map((proj) =>
        proj.id === projectId ? { ...proj, ...patch, updatedAt: now } : proj
      )
    );
  };

  const createProject = (title?: string): ReelProject => {
    const id = `reel-proj-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`;
    const created: ReelProject = {
      id,
      title: title?.trim() || `Untitled Reel #${projects.length + 1}`,
      platform: "instagram",
      aspectRatio: "9:16",
      targetDurationSec: 30,
      captionStyle: "kinetic",
      status: "local-draft",
      updatedAt: new Date().toISOString(),
      scenes: [
        {
          id: `scene-${Date.now()}-1`,
          title: "01 · Hook Frame",
          durationSec: 4,
          scriptText: "Open with a bold question or visual pattern interrupt.",
          onScreenText: "Wait until you see frame 3 👀",
          visualDescription: "Close-up studio shot with natural light.",
          gradientId: "coral-sunset",
          mediaAssetId: null,
        },
        {
          id: `scene-${Date.now()}-2`,
          title: "02 · Core Story",
          durationSec: 8,
          scriptText: "Deliver the main insight or reveal with crisp pacing.",
          onScreenText: "Here's the simple studio trick",
          visualDescription: "Medium shot + quick detail cut.",
          gradientId: "indigo-electric",
          mediaAssetId: null,
        },
      ],
    };
    persistProjects([created, ...projects]);
    return created;
  };

  const duplicateProject = (projectId: string): ReelProject | null => {
    const source = projects.find((p) => p.id === projectId);
    if (!source) return null;
    const copy: ReelProject = {
      ...source,
      id: `reel-proj-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
      title: `${source.title} (Copy)`,
      updatedAt: new Date().toISOString(),
      scenes: source.scenes.map((scene, idx) => ({
        ...scene,
        id: `scene-${Date.now()}-${idx}-${Math.random().toString(36).slice(2, 5)}`,
      })),
    };
    persistProjects([copy, ...projects]);
    return copy;
  };

  const deleteProject = (projectId: string): string | null => {
    const remaining = projects.filter((p) => p.id !== projectId);
    if (remaining.length === 0) {
      const fallback = createBlankProjectFallback();
      persistProjects([fallback]);
      return fallback.id;
    }
    persistProjects(remaining);
    return remaining[0].id;
  };

  const clearMediaReferenceEverywhere = (assetId: string) => {
    persistProjects(
      projects.map((proj) => ({
        ...proj,
        scenes: proj.scenes.map((scene) =>
          scene.mediaAssetId === assetId
            ? { ...scene, mediaAssetId: null }
            : scene
        ),
      }))
    );
  };

  const resetSampleProjects = () => {
    if (typeof window !== "undefined") {
      try {
        window.localStorage.removeItem(REELS_STORAGE_KEY);
      } catch {
        // Ignore
      }
    }
    cachedRaw = null;
    cachedParsed = INITIAL_REEL_PROJECTS;
    emitChange();
  };

  return {
    projects,
    updateProject,
    createProject,
    duplicateProject,
    deleteProject,
    clearMediaReferenceEverywhere,
    resetSampleProjects,
  };
}

function createBlankProjectFallback(): ReelProject {
  return {
    id: `reel-proj-${Date.now()}`,
    title: "Fresh Reel Draft",
    platform: "instagram",
    aspectRatio: "9:16",
    targetDurationSec: 30,
    captionStyle: "kinetic",
    status: "local-draft",
    updatedAt: new Date().toISOString(),
    scenes: [createBlankScene(0)],
  };
}
