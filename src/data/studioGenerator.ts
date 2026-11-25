import type { CardAccent } from "@/types/creatorly";
import type {
  GeneratedStudioContent,
  StudioFormat,
  StudioPlatform,
  StudioTone,
} from "@/types/studio";

export const STUDIO_PLATFORMS: {
  id: StudioPlatform;
  label: string;
  handle: string;
  accent: CardAccent;
  audienceHint: string;
}[] = [
  {
    id: "instagram",
    label: "Instagram",
    handle: "@creatorly.studio",
    accent: "coral",
    audienceHint: "Visual storytelling & saves",
  },
  {
    id: "facebook",
    label: "Facebook",
    handle: "Creatorly Community",
    accent: "indigo",
    audienceHint: "Shareable discussions & drops",
  },
  {
    id: "tiktok",
    label: "TikTok",
    handle: "@creatorly.ai",
    accent: "mint",
    audienceHint: "Fast hooks & high-energy pacing",
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    handle: "Creatorly Labs",
    accent: "violet",
    audienceHint: "Sharp creator & team insights",
  },
  {
    id: "youtube",
    label: "YouTube",
    handle: "Creatorly TV",
    accent: "coral",
    audienceHint: "Retention-first story arcs",
  },
];

export const STUDIO_FORMATS: {
  id: StudioFormat;
  label: string;
  subtitle: string;
}[] = [
  {
    id: "post",
    label: "Post",
    subtitle: "Hero frame + tight story",
  },
  {
    id: "carousel",
    label: "Carousel",
    subtitle: "Swipeable 5-slide deck",
  },
  {
    id: "reel",
    label: "Reel",
    subtitle: "Vertical 35s beat script",
  },
];

export const STUDIO_TONES: {
  id: StudioTone;
  label: string;
  description: string;
  dotClass: string;
  accent: CardAccent;
}[] = [
  {
    id: "bold",
    label: "Bold",
    description: "Unapologetic hooks & high-contrast energy",
    dotClass: "bg-coral",
    accent: "coral",
  },
  {
    id: "editorial",
    label: "Editorial",
    description: "Magazine-grade clarity & sharp POV",
    dotClass: "bg-indigo",
    accent: "indigo",
  },
  {
    id: "playful",
    label: "Playful",
    description: "Warm wit, personality & human rhythm",
    dotClass: "bg-mint",
    accent: "mint",
  },
  {
    id: "minimal",
    label: "Minimal",
    description: "Distilled signal with zero fluff",
    dotClass: "bg-violet",
    accent: "violet",
  },
];

export const STUDIO_STARTER_TOPICS: string[] = [
  "Launching a tactile ceramic espresso mug drop",
  "3 typography tweaks that double carousel saves",
  "How a 2-person studio ships a full week of content in 45 minutes",
  "Behind the scenes of rebranding our creator newsletter",
];

function extractTopicKeywords(topic: string): string[] {
  const stopWords = new Set([
    "a",
    "an",
    "the",
    "of",
    "for",
    "in",
    "to",
    "and",
    "that",
    "how",
    "why",
    "our",
    "your",
    "with",
    "on",
  ]);
  const words = topic
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .split(/\s+/)
    .filter((w) => w.length > 3 && !stopWords.has(w));

  return words.slice(0, 3);
}

/**
 * Generates local mock social media content tailored to topic, platform, format, and tone.
 * Note: Uses local deterministic templates only — no external AI APIs are called.
 */
export function generateMockStudioContent(
  rawTopic: string,
  platform: StudioPlatform,
  format: StudioFormat,
  tone: StudioTone
): GeneratedStudioContent {
  const topic =
    rawTopic.trim() || "Launching a tactile ceramic espresso mug drop";
  const shortTitle =
    topic.length > 54 ? `${topic.slice(0, 52).trim()}…` : topic;

  const platformMeta =
    STUDIO_PLATFORMS.find((p) => p.id === platform) ?? STUDIO_PLATFORMS[0];
  const toneMeta =
    STUDIO_TONES.find((t) => t.id === tone) ?? STUDIO_TONES[0];

  const hookByTone: Record<StudioTone, Record<StudioFormat, string>> = {
    bold: {
      post: `Stop whispering your best work—here is the real story behind ${shortTitle}.`,
      carousel: `Most feeds forget in 2 seconds. Swipe through how we built ${shortTitle} to stick.`,
      reel: `Hold up—watch what changed the second we rethought ${shortTitle}.`,
    },
    editorial: {
      post: `A closer look at craft, restraint, and what actually makes ${shortTitle} resonate.`,
      carousel: `Field notes on taste and pacing: unpacking ${shortTitle} in five frames.`,
      reel: `Three quiet details behind ${shortTitle} that turn casual scrollers into regulars.`,
    },
    playful: {
      post: `Okay, we obsessed a little too much over ${shortTitle}—and it totally paid off.`,
      carousel: `Me: "Let's keep this simple." Also me 4 hours later perfecting ${shortTitle}:`,
      reel: `POV: You finally find the fun, zero-cringe way to share ${shortTitle}.`,
    },
    minimal: {
      post: `Less noise. Sharper craft. Inside ${shortTitle}.`,
      carousel: `Five clean takeaways from ${shortTitle}.`,
      reel: `35 seconds on ${shortTitle}—only the parts that matter.`,
    },
  };

  const captionIntroByPlatform: Record<StudioPlatform, string> = {
    instagram:
      "Built for thumb-stopping saves: open with visual contrast, leave generous breathing room, and let one concrete detail anchor the story.",
    facebook:
      "Sparking real conversation in the feed—share the honest turning point first, then invite your community to weigh in with their own take.",
    tiktok:
      "No slow wind-ups. Pair an immediate visual shift in the first 2 seconds with punchy on-screen captions that reward a full watch.",
    linkedin:
      "Skip generic buzzwords. Lead with a specific creative observation your peers can actually apply inside their own team workflow today.",
    youtube:
      "Structured around curiosity and payoff—set the stakes early, show the real behind-the-scenes craft, and loop cleanly back to frame one.",
  };

  const captionBodyByTone: Record<StudioTone, string> = {
    bold: "We stripped out the safe filler and leaned straight into what makes this moment unmistakable.",
    editorial:
      "When every brand uses the same templates, intentional pacing and honest point of view become your strongest edge.",
    playful:
      "Turns out audiences respond fastest when the post feels like a voice note from a creative friend—not a press release.",
    minimal:
      "One clear idea per frame. Every extra word removed makes the main claim hit twice as hard.",
  };

  const alternateCtas = [
    `Save this ${format} blueprint for your next ${platformMeta.label} drop.`,
    `Which angle fits your feed best—${toneMeta.label} or Editorial? Drop it below.`,
    `Send this to someone building something tactile this week.`,
  ];

  const keywordTags = extractTopicKeywords(topic).map(
    (word) => `#${word.charAt(0).toUpperCase()}${word.slice(1)}`
  );

  const platformTag = `#${platformMeta.label.replace(/\s+/g, "")}`;
  const formatTag = `#${format.charAt(0).toUpperCase()}${format.slice(1)}Craft`;
  const hashtags = Array.from(
    new Set(["#CreatorlyStudio", platformTag, formatTag, ...keywordTags])
  ).slice(0, 5);

  const slides = [
    {
      slideNumber: 1,
      kicker: "01 · THUMB-STOPPER",
      headline: shortTitle,
      body: hookByTone[tone][format],
    },
    {
      slideNumber: 2,
      kicker: "02 · THE TENSION",
      headline: "Why standard templates blend in",
      body: "Crowded layouts and polite openers get skipped before line two ever lands.",
    },
    {
      slideNumber: 3,
      kicker: "03 · THE SHIFT",
      headline: `Dialing into ${toneMeta.label} voice`,
      body: captionBodyByTone[tone],
    },
    {
      slideNumber: 4,
      kicker: "04 · NATIVE FRAMING",
      headline: `Tuned for ${platformMeta.label}`,
      body: captionIntroByPlatform[platform],
    },
    {
      slideNumber: 5,
      kicker: "05 · TAKEAWAY",
      headline: "Ready to remix & ship",
      body: alternateCtas[0],
    },
  ];

  const reelBeats = [
    {
      timecode: "00:00 – 00:04",
      visualCue: "Tight desk close-up + bold kinetic title card",
      spokenLine: hookByTone[tone].reel,
    },
    {
      timecode: "00:04 – 00:15",
      visualCue: "Quick cut showing raw draft vs. styled frame",
      spokenLine: captionBodyByTone[tone],
    },
    {
      timecode: "00:15 – 00:28",
      visualCue: `Native ${platformMeta.label} overlay highlighting key detail`,
      spokenLine: captionIntroByPlatform[platform],
    },
    {
      timecode: "00:28 – 00:35",
      visualCue: "Clean end frame pointing to comments/save icon",
      spokenLine: alternateCtas[0],
    },
  ];

  const scoreBase =
    88 + ((topic.length + platform.length * 2 + tone.length) % 10);

  return {
    id: `studio-${platform}-${format}-${tone}-${topic.length}`,
    topic,
    platform,
    format,
    tone,
    accent: toneMeta.accent,
    hookScore: Math.min(scoreBase, 98),
    hook: hookByTone[tone][format],
    caption: `${captionIntroByPlatform[platform]}\n\n${captionBodyByTone[tone]}`,
    hashtags,
    cta: alternateCtas[0],
    visualTitle: shortTitle,
    visualSubtitle: `${platformMeta.label} · ${
      format.charAt(0).toUpperCase() + format.slice(1)
    } · ${toneMeta.label}`,
    slides,
    reelBeats,
    alternateCtas,
  };
}
