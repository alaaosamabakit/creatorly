import type {
  CadenceDay,
  CardAccent,
  HookLabOption,
  PlatformId,
  SocialChannel,
  SparkCard,
  ToneId,
} from "@/types/creatorly";

export const PLATFORM_META: Record<
  PlatformId,
  { label: string; handle: string; badgeAccent: CardAccent }
> = {
  all: { label: "All Formats", handle: "Studio Mix", badgeAccent: "indigo" },
  instagram: {
    label: "Instagram",
    handle: "@creatorly.studio",
    badgeAccent: "coral",
  },
  tiktok: { label: "TikTok", handle: "@creatorly.ai", badgeAccent: "mint" },
  x: { label: "X / Threads", handle: "@creatorly", badgeAccent: "indigo" },
  linkedin: {
    label: "LinkedIn",
    handle: "Creatorly Labs",
    badgeAccent: "violet",
  },
  youtube: {
    label: "YouTube",
    handle: "Creatorly TV",
    badgeAccent: "coral",
  },
};

export const TONE_META: Record<
  ToneId,
  { label: string; description: string; dotClass: string; accent: CardAccent }
> = {
  electric: {
    label: "Electric",
    description: "High-energy hooks with punchy rhythm",
    dotClass: "bg-coral",
    accent: "coral",
  },
  editorial: {
    label: "Editorial",
    description: "Sharp, story-driven cultural commentary",
    dotClass: "bg-indigo",
    accent: "indigo",
  },
  playful: {
    label: "Playful",
    description: "Witty, human, scroll-stopping warmth",
    dotClass: "bg-mint",
    accent: "mint",
  },
  minimal: {
    label: "Minimal",
    description: "Crisp one-liners with calm authority",
    dotClass: "bg-violet",
    accent: "violet",
  },
};

export const QUICK_TOPICS: string[] = [
  "Launching a tactile coffee ritual brand",
  "5 Figma micro-details designers miss",
  "Why solo creators beat big media teams",
  "Behind the scenes of a 48-hour product sprint",
];

export const INITIAL_SPARK_CARDS: SparkCard[] = [
  {
    id: "spark-ig-carousel",
    platform: "instagram",
    formatLabel: "7-Slide Carousel",
    tone: "electric",
    accent: "coral",
    topicTag: "Visual Storytelling",
    visualHeadline: "Stop designing for feeds. Design for pauses.",
    visualSubline: "Frame 01 / 07 — Contrast + Rhythm",
    durationOrSlides: "7 slides",
    tags: ["#CreativeDirection", "#CarouselCraft", "#CreatorlyAI"],
    estimatedReach: "42.8K",
    bestTime: "Tue · 11:30 AM",
    slidesOrBeats: [
      "Slide 1: Oversized bold hook on warm cream canvas",
      "Slide 2–3: Side-by-side before/after pacing breakdown",
      "Slide 4–6: 3 tactile typography rules you can steal today",
      "Slide 7: Save-worthy checklist + remix prompt",
    ],
    variations: [
      {
        hook: "Most carousels fail on Slide 1 because they whisper when they should spark.",
        caption:
          "Your first frame isn't a title slide—it's a billboard moving at thumb-speed. Pair high-contrast type with one clear visual tension, then earn the swipe on Slide 2.",
        cta: "Save this 7-slide blueprint for your next drop.",
        hookScore: 95,
      },
      {
        hook: "3 visual rhythm shifts that doubled our carousel saves this week.",
        caption:
          "We stripped out generic template clutter, oversized the opening claim, and gave every slide room to breathe. Clarity beats density every single time.",
        cta: "Drop 'SPARK' if you want the exact grid ratios.",
        hookScore: 92,
      },
    ],
  },
  {
    id: "spark-tiktok-reel",
    platform: "tiktok",
    formatLabel: "Vertical Reel · 38s",
    tone: "playful",
    accent: "mint",
    topicTag: "Creator Workflow",
    visualHeadline: "POV: Your AI studio writes in your actual voice.",
    visualSubline: "Beat 01 · Fast Cut · 00:38",
    durationOrSlides: "0:38",
    tags: ["#CreatorFlow", "#ShortForm", "#StudioVibes"],
    estimatedReach: "68.4K",
    bestTime: "Wed · 6:15 PM",
    slidesOrBeats: [
      "00:00–00:04: Desk coffee pour + bold on-screen hook",
      "00:04–00:16: Prompt one rough voice note into 4 platform angles",
      "00:16–00:30: Live remix from stiff corporate to punchy creator tone",
      "00:30–00:38: Final export + playful sign-off",
    ],
    variations: [
      {
        hook: "I stopped staring at blank captions at midnight—here's the 40-second studio loop.",
        caption:
          "Drop one messy idea, pick your vibe, and watch it spin into a Reel script, carousel deck, and thread without sounding like a robot.",
        cta: "Which tone fits your feed best: Electric or Editorial?",
        hookScore: 96,
      },
      {
        hook: "Nobody wants another robotic post. Here's how to keep the spark human.",
        caption:
          "The secret isn't generating more noise—it's remixing your sharpest real-life moment into three native formats in under a minute.",
        cta: "Tag a creator friend who still writes captions at 1 AM.",
        hookScore: 93,
      },
    ],
  },
  {
    id: "spark-x-thread",
    platform: "x",
    formatLabel: "Punchy Thread",
    tone: "editorial",
    accent: "indigo",
    topicTag: "Audience Growth",
    visualHeadline: "Taste is the new distribution moat.",
    visualSubline: "Thread · 6 Connected Notes",
    durationOrSlides: "6 posts",
    tags: ["#BuildInPublic", "#CreatorEconomy", "#Taste"],
    estimatedReach: "29.1K",
    bestTime: "Thu · 9:00 AM",
    slidesOrBeats: [
      "Post 1: Contrarian thesis on why polish alone blends in",
      "Post 2–4: Three mini case studies from breakout indie studios",
      "Post 5: Visual cadence formula (2 sparks, 1 deep dive)",
      "Post 6: Open question that sparks replies",
    ],
    variations: [
      {
        hook: "When everyone has the same tools, taste becomes your loudest unfair advantage.",
        caption:
          "Audiences don't follow consistency alone—they follow unmistakable point of view. Here are 5 micro-habits that sharpen your creative signature every week:",
        cta: "Read the 6-part breakdown and bookmark for Friday.",
        hookScore: 94,
      },
      {
        hook: "The best creator accounts feel like an independent magazine, not a content calendar.",
        caption:
          "Stop filling slots just to hit a quota. Ship fewer, bolder ideas with recognizable pacing, color, and voice.",
        cta: "What's one creator account whose taste you'd recognize blindfolded?",
        hookScore: 91,
      },
    ],
  },
  {
    id: "spark-linkedin-essay",
    platform: "linkedin",
    formatLabel: "Visual Brief",
    tone: "minimal",
    accent: "violet",
    topicTag: "Brand Strategy",
    visualHeadline: "Small creative teams are moving like studios.",
    visualSubline: "Card Deck · 4 Sharp Takeaways",
    durationOrSlides: "4 cards",
    tags: ["#BrandDesign", "#CreativeOps", "#ModernTeams"],
    estimatedReach: "31.5K",
    bestTime: "Mon · 8:45 AM",
    slidesOrBeats: [
      "Opener: One clean observation from recent studio launches",
      "Insight 1: Replace approval spreadsheets with live visual cards",
      "Insight 2: Keep voice guidelines inside the composer itself",
      "Closer: Invite teams to share their favorite creative ritual",
    ],
    variations: [
      {
        hook: "The fastest-growing brands this year don't have larger social teams—they have tighter creative loops.",
        caption:
          "When ideation, visual framing, and hook testing happen on one tactile canvas, good ideas don't die in doc comments.",
        cta: "How does your team turn rough sparks into shipped stories?",
        hookScore: 90,
      },
      {
        hook: "Your social workflow shouldn't feel like filing taxes.",
        caption:
          "Great content comes from momentum. Give creators a playground that rewards experimentation, and quality rises naturally.",
        cta: "Curious how other leads structure weekly creative sprints.",
        hookScore: 89,
      },
    ],
  },
  {
    id: "spark-youtube-short",
    platform: "youtube",
    formatLabel: "YouTube Short",
    tone: "electric",
    accent: "coral",
    topicTag: "Launch Playbook",
    visualHeadline: "How we turned one idea into 5 native drops.",
    visualSubline: "Short Script · 52s · Retention Map",
    durationOrSlides: "0:52",
    tags: ["#YouTubeShorts", "#ContentSystem", "#LaunchDay"],
    estimatedReach: "54.2K",
    bestTime: "Fri · 4:00 PM",
    slidesOrBeats: [
      "00:00: Pattern-interrupt opener with live card flip",
      "00:08: Show the core prompt & tone dial",
      "00:26: Compare Instagram vs. TikTok pacing side-by-side",
      "00:44: High-energy loop back to frame one",
    ],
    variations: [
      {
        hook: "One creative spark. Five completely native posts. Zero copy-paste fatigue.",
        caption:
          "Watch how shifting tone from Editorial on LinkedIn to Playful on TikTok turns a single product story into a full-week launch wave.",
        cta: "Subscribe for the full studio breakdown dropping Sunday.",
        hookScore: 94,
      },
      {
        hook: "Cross-posting the exact same caption everywhere is quietly killing your reach.",
        caption:
          "Each feed has its own native heartbeat. Keep the core idea intact, then adapt the hook and visual rhythm for every stage.",
        cta: "Try remixing your top post with this 3-beat loop.",
        hookScore: 91,
      },
    ],
  },
];

const ACCENTS: CardAccent[] = ["coral", "indigo", "mint", "violet"];
const CHANNELS: SocialChannel[] = [
  "instagram",
  "tiktok",
  "x",
  "linkedin",
  "youtube",
];

/**
 * Generates tailored client-side Spark cards from any user topic, platform filter, and tone
 * for the Phase 1 interactive AI playground.
 */
export function generateSparkCards(
  topic: string,
  platform: PlatformId,
  tone: ToneId
): SparkCard[] {
  const cleanTopic = topic.trim() || "Launching a tactile coffee ritual brand";
  const shortTopic =
    cleanTopic.length > 46 ? `${cleanTopic.slice(0, 44).trim()}…` : cleanTopic;

  const targetChannels: SocialChannel[] =
    platform === "all" ? CHANNELS : [platform, ...CHANNELS.filter((c) => c !== platform).slice(0, 3)];

  const toneHookPrefix: Record<ToneId, string[]> = {
    electric: [
      "Stop scrolling—here's the real story behind",
      "The 60-second breakdown nobody shared about",
      "Why everyone is rethinking",
      "Watch this angle flip on",
    ],
    editorial: [
      "A closer look at why taste matters in",
      "What the sharpest studios understand about",
      "Inside the quiet shift reshaping",
      "Notes from a week spent obsessing over",
    ],
    playful: [
      "Okay, let's talk honestly about",
      "POV: You finally crack the fun side of",
      "Me saying 'just one quick draft' about",
      "Tiny creative obsession of the week:",
    ],
    minimal: [
      "One clean rule for",
      "Less noise, sharper signal:",
      "What actually moves the needle in",
      "Four calm takeaways on",
    ],
  };

  const formatByChannel: Record<
    SocialChannel,
    { label: string; duration: string; time: string; reach: string }
  > = {
    instagram: {
      label: "6-Slide Carousel",
      duration: "6 slides",
      time: "Tue · 11:30 AM",
      reach: "46.2K",
    },
    tiktok: {
      label: "Vertical Reel · 34s",
      duration: "0:34",
      time: "Wed · 6:45 PM",
      reach: "71.9K",
    },
    x: {
      label: "Punchy Thread",
      duration: "5 posts",
      time: "Thu · 9:15 AM",
      reach: "33.4K",
    },
    linkedin: {
      label: "Visual Brief",
      duration: "4 cards",
      time: "Mon · 8:30 AM",
      reach: "28.7K",
    },
    youtube: {
      label: "YouTube Short",
      duration: "0:48",
      time: "Fri · 4:30 PM",
      reach: "58.1K",
    },
  };

  return targetChannels.map((channel, index) => {
    const meta = formatByChannel[channel];
    const accent = ACCENTS[(index + (tone.length % 4)) % ACCENTS.length];
    const prefixA = toneHookPrefix[tone][index % toneHookPrefix[tone].length];
    const prefixB =
      toneHookPrefix[tone][(index + 1) % toneHookPrefix[tone].length];

    return {
      id: `generated-${channel}-${tone}-${index}`,
      platform: channel,
      formatLabel: meta.label,
      tone,
      accent,
      topicTag: `${TONE_META[tone].label} Spark`,
      visualHeadline: shortTopic,
      visualSubline: `${PLATFORM_META[channel].label} · ${TONE_META[tone].label} Cut`,
      durationOrSlides: meta.duration,
      tags: [
        "#CreatorlyAI",
        `#${TONE_META[tone].label}Mode`,
        `#${channel === "x" ? "Threads" : PLATFORM_META[channel].label}`,
      ],
      estimatedReach: meta.reach,
      bestTime: meta.time,
      slidesOrBeats: [
        `Beat 1: Open with high-contrast claim around "${shortTopic}"`,
        `Beat 2: Show the unexpected detail or tactile process`,
        `Beat 3: Deliver 3 crisp takeaways in ${TONE_META[tone].label.toLowerCase()} voice`,
        `Beat 4: Close with a saveable prompt or community question`,
      ],
      variations: [
        {
          hook: `${prefixA} ${cleanTopic.charAt(0).toLowerCase() + cleanTopic.slice(1)}.`,
          caption: `Built for ${PLATFORM_META[channel].label} in ${TONE_META[tone].label} mode: lead with tension in line one, show the real behind-the-scenes proof in beat two, and end on a human question.`,
          cta: "Save & remix this spark for your next scheduled slot.",
          hookScore: 91 + ((index * 3 + tone.length) % 8),
        },
        {
          hook: `${prefixB} ${cleanTopic.charAt(0).toLowerCase() + cleanTopic.slice(1)}.`,
          caption: `Alternate AI cut: tighter opening sentence, sharper visual rhythm, and an effortless bridge to comments so the post sparks genuine conversation.`,
          cta: "Drop your take below—would you run Cut A or Cut B?",
          hookScore: 89 + ((index * 2 + tone.length) % 9),
        },
      ],
    };
  });
}

export const HOOK_LAB_OPTIONS: HookLabOption[] = [
  {
    id: "curiosity",
    styleLabel: "Curiosity Gap",
    hookText:
      "We changed one 3-second intro frame—and saves jumped 2.4x overnight.",
    score: 96,
    retentionBoost: "+41% 3s Hold",
    accent: "coral",
    breakdown:
      "Pairs a specific micro-change with an immediate, measurable curiosity payoff.",
  },
  {
    id: "contrarian",
    styleLabel: "Contrarian",
    hookText:
      "Stop posting daily. Ship three unforgettable stories a week instead.",
    score: 93,
    retentionBoost: "+34% Shares",
    accent: "indigo",
    breakdown:
      "Challenges autopilot hustle advice with a calmer, high-craft studio thesis.",
  },
  {
    id: "story",
    styleLabel: "Story Opener",
    hookText:
      "At 11:40 PM with cold espresso, we scrapped our whole launch deck and built this.",
    score: 91,
    retentionBoost: "+29% Replies",
    accent: "mint",
    breakdown:
      "Grounds the post in sensory time and place before revealing the creative lesson.",
  },
];

export const WEEKLY_CADENCE: CadenceDay[] = [
  {
    day: "Monday",
    shortDay: "Mon",
    platform: "linkedin",
    title: "Founder Visual Brief",
    time: "8:45 AM",
    accent: "violet",
    energy: 78,
  },
  {
    day: "Tuesday",
    shortDay: "Tue",
    platform: "instagram",
    title: "7-Slide Craft Carousel",
    time: "11:30 AM",
    accent: "coral",
    energy: 95,
  },
  {
    day: "Wednesday",
    shortDay: "Wed",
    platform: "tiktok",
    title: "Behind-the-Scenes Cut",
    time: "6:15 PM",
    accent: "mint",
    energy: 92,
  },
  {
    day: "Thursday",
    shortDay: "Thu",
    platform: "x",
    title: "Taste & Distribution Thread",
    time: "9:00 AM",
    accent: "indigo",
    energy: 86,
  },
  {
    day: "Friday",
    shortDay: "Fri",
    platform: "youtube",
    title: "Launch Playbook Short",
    time: "4:00 PM",
    accent: "coral",
    energy: 89,
  },
];
