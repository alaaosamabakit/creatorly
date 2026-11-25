"use client";

import { useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "motion/react";
import {
  Clapperboard,
  Image as ImageIcon,
  Layers,
  Loader2,
  Shuffle,
  Sparkles,
  Wand2,
} from "lucide-react";
import { FloatingNav } from "@/components/layout/FloatingNav";
import { StudioFooter } from "@/components/layout/StudioFooter";
import { Reveal } from "@/components/motion/Reveal";
import { SPRINGS } from "@/components/motion/MotionPresets";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Pill } from "@/components/ui/Pill";
import { PlatformIcon } from "@/components/ui/PlatformIcon";
import { StudioLivePreview } from "@/components/studio-app/StudioLivePreview";
import { StudioResultEditor } from "@/components/studio-app/StudioResultEditor";
import { StudioSavedVault } from "@/components/studio-app/StudioSavedVault";
import {
  STUDIO_FORMATS,
  STUDIO_PLATFORMS,
  STUDIO_STARTER_TOPICS,
  STUDIO_TONES,
  generateMockStudioContent,
} from "@/data/studioGenerator";
import { useCalendarStore } from "@/data/calendarData";
import { cn } from "@/lib/utils";
import type { CalendarPost } from "@/types/calendar";
import type {
  GeneratedStudioContent,
  SavedStudioDraft,
  StudioFormat,
  StudioPlatform,
  StudioTone,
} from "@/types/studio";

function FormatIcon({ format }: { format: StudioFormat }) {
  switch (format) {
    case "carousel":
      return <Layers className="h-4 w-4 shrink-0" />;
    case "reel":
      return <Clapperboard className="h-4 w-4 shrink-0" />;
    default:
      return <ImageIcon className="h-4 w-4 shrink-0" />;
  }
}

function buildStudioContentFromPost(
  post: CalendarPost
): GeneratedStudioContent {
  const base = generateMockStudioContent(
    post.title,
    post.platform,
    post.format,
    post.tone ?? "bold"
  );
  return {
    ...base,
    id: post.id,
    topic: post.title,
    hook: post.hook,
    caption: post.caption,
    hashtags: post.hashtags.length > 0 ? post.hashtags : base.hashtags,
    cta: post.cta ?? base.cta,
    visualSubtitle: post.visualNotes || base.visualSubtitle,
  };
}

/**
 * Interactive AI Content Studio workspace for /studio (local mock generation).
 */
export function StudioWorkspace() {
  const searchParams = useSearchParams();
  const requestedPostId = searchParams.get("postId");
  const { posts, saveStudioDraft, deletePost } = useCalendarStore();

  const linkedPost = useMemo(
    () =>
      requestedPostId
        ? posts.find((p) => p.id === requestedPostId) ?? null
        : null,
    [posts, requestedPostId]
  );

  return (
    <StudioWorkspaceInner
      key={linkedPost?.id ?? "fresh-studio"}
      linkedPost={linkedPost}
      posts={posts}
      onPersistStudioDraft={saveStudioDraft}
      onDeleteStoredDraft={deletePost}
    />
  );
}

function StudioWorkspaceInner({
  linkedPost,
  posts,
  onPersistStudioDraft,
  onDeleteStoredDraft,
}: {
  linkedPost: CalendarPost | null;
  posts: CalendarPost[];
  onPersistStudioDraft: (
    content: GeneratedStudioContent,
    existingId?: string | null
  ) => CalendarPost;
  onDeleteStoredDraft: (id: string) => void;
}) {
  const initialContent = linkedPost
    ? buildStudioContentFromPost(linkedPost)
    : generateMockStudioContent(
        STUDIO_STARTER_TOPICS[0],
        "instagram",
        "carousel",
        "bold"
      );

  const [editingPostId, setEditingPostId] = useState<string | null>(
    linkedPost?.id ?? null
  );
  const [topic, setTopic] = useState<string>(initialContent.topic);
  const [platform, setPlatform] = useState<StudioPlatform>(
    initialContent.platform
  );
  const [format, setFormat] = useState<StudioFormat>(initialContent.format);
  const [tone, setTone] = useState<StudioTone>(initialContent.tone);

  const [generatedSnapshot, setGeneratedSnapshot] =
    useState<GeneratedStudioContent>(initialContent);
  const [draftContent, setDraftContent] =
    useState<GeneratedStudioContent>(initialContent);
  const [isGenerating, setIsGenerating] = useState(false);
  const [justSaved, setJustSaved] = useState(false);

  const savedDrafts = useMemo<SavedStudioDraft[]>(
    () =>
      posts
        .filter((p) => p.status === "draft")
        .map((post) => ({
          draftId: post.id,
          savedAtLabel:
            post.source === "studio" ? "Studio Draft" : "Calendar Draft",
          content: buildStudioContentFromPost(post),
        })),
    [posts]
  );

  const topicInputRef = useRef<HTMLTextAreaElement | null>(null);
  const timerRef = useRef<number | null>(null);

  const triggerGeneration = (
    nextTopic: string,
    nextPlatform: StudioPlatform,
    nextFormat: StudioFormat,
    nextTone: StudioTone
  ) => {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
    }

    setIsGenerating(true);
    timerRef.current = window.setTimeout(() => {
      const next = generateMockStudioContent(
        nextTopic,
        nextPlatform,
        nextFormat,
        nextTone
      );
      setGeneratedSnapshot(next);
      setDraftContent(next);
      setIsGenerating(false);
    }, 450);
  };

  const handlePlatformSelect = (nextPlatform: StudioPlatform) => {
    setPlatform(nextPlatform);
    triggerGeneration(topic, nextPlatform, format, tone);
  };

  const handleFormatSelect = (nextFormat: StudioFormat) => {
    setFormat(nextFormat);
    triggerGeneration(topic, platform, nextFormat, tone);
  };

  const handleToneSelect = (nextTone: StudioTone) => {
    setTone(nextTone);
    triggerGeneration(topic, platform, format, nextTone);
  };

  const handleSurpriseIdea = () => {
    const nextTopic =
      STUDIO_STARTER_TOPICS[
        (STUDIO_STARTER_TOPICS.indexOf(topic) + 1) %
          STUDIO_STARTER_TOPICS.length
      ] ?? STUDIO_STARTER_TOPICS[0];
    setTopic(nextTopic);
    triggerGeneration(nextTopic, platform, format, tone);
  };

  const handleSaveDraft = () => {
    const saved = onPersistStudioDraft(draftContent, editingPostId);
    setEditingPostId(saved.id);
    setJustSaved(true);
    window.setTimeout(() => setJustSaved(false), 1600);
  };

  const handleLoadDraft = (draft: SavedStudioDraft) => {
    setEditingPostId(draft.draftId);
    setTopic(draft.content.topic);
    setPlatform(draft.content.platform);
    setFormat(draft.content.format);
    setTone(draft.content.tone);
    setGeneratedSnapshot(draft.content);
    setDraftContent(draft.content);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleFocusTopic = () => {
    topicInputRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
    window.setTimeout(() => {
      topicInputRef.current?.focus();
    }, 280);
  };

  return (
    <div className="relative flex min-h-screen flex-col">
      {/* Ambient background glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[520px] bg-studio-dots opacity-45 [mask-image:radial-gradient(ellipse_at_center,black_25%,transparent_78%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 top-20 -z-10 h-80 w-80 rounded-full bg-coral/15 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-0 top-12 -z-10 h-96 w-96 rounded-full bg-indigo/12 blur-3xl"
      />

      <FloatingNav
        savedCount={savedDrafts.length}
        savedLabel="drafts"
        ctaLabel="New Idea"
        onFocusPrompt={handleFocusTopic}
      />

      <main className="flex-1 pt-8 pb-10 sm:pt-12">
        {/* Editorial Studio Masthead */}
        <section className="mx-auto max-w-6xl px-4 sm:px-6">
          <Reveal immediate>
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <div>
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <Badge variant="coral" pulse>
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>AI Content Studio</span>
                  </Badge>
                  <Badge variant="cream" className="font-mono text-[11px]">
                    Local Mock Studio Engine
                  </Badge>
                </div>
                <h1 className="font-display text-[clamp(2rem,4.5vw,3.4rem)] font-extrabold leading-[1.02] tracking-tight text-ink">
                  Craft, shape & preview{" "}
                  <span className="text-indigo">every drop</span> in one studio.
                </h1>
              </div>

              <p className="max-w-md text-sm leading-relaxed text-ink-secondary">
                Choose your channel, format, and voice tone below. Edit any
                generated hook, caption, hashtag, or CTA and watch the live
                platform preview update instantly.
              </p>
            </div>
          </Reveal>

          {/* Creative Brief & Controls Canvas */}
          <Reveal immediate delay={0.08}>
            <div className="mt-8 rounded-[2.2rem] border border-black/[0.08] bg-white p-5 shadow-float-lg sm:p-7">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  triggerGeneration(topic, platform, format, tone);
                }}
                className="space-y-6"
              >
                {/* Topic / Idea Prompt Area */}
                <div>
                  <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                    <label
                      htmlFor="studio-topic-textarea"
                      className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold uppercase tracking-wider text-ink-muted"
                    >
                      <Wand2 className="h-3.5 w-3.5 text-coral" />
                      Content Topic or Rough Idea
                    </label>
                    <span className="font-mono text-[11px] text-ink-muted">
                      {topic.length} characters
                    </span>
                  </div>

                  <textarea
                    ref={topicInputRef}
                    id="studio-topic-textarea"
                    rows={2}
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="What story, product launch, or creative insight are you shaping today?"
                    className="w-full resize-none rounded-2xl border border-black/[0.09] bg-cream/75 px-4 py-3 text-sm font-medium text-ink placeholder:text-ink-muted focus:border-coral focus:bg-white focus:outline-none sm:text-base"
                  />

                  <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
                    <span className="mr-1 font-mono text-[11px] font-semibold uppercase tracking-wider text-ink-muted">
                      Starters:
                    </span>
                    {STUDIO_STARTER_TOPICS.map((starter) => (
                      <button
                        key={starter}
                        type="button"
                        onClick={() => {
                          setTopic(starter);
                          triggerGeneration(starter, platform, format, tone);
                        }}
                        className={cn(
                          "rounded-full border px-3 py-1 text-xs font-medium transition-colors cursor-pointer",
                          topic === starter
                            ? "border-coral/40 bg-coral-soft text-[#c93714]"
                            : "border-black/[0.07] bg-oat/60 text-ink-secondary hover:bg-oat hover:text-ink"
                        )}
                      >
                        {starter}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Platform + Format + Tone Controls Grid */}
                <div className="grid gap-5 border-t border-black/[0.06] pt-5 lg:grid-cols-12">
                  {/* Platform selection */}
                  <div className="lg:col-span-6">
                    <span className="mb-2.5 block font-mono text-[11px] font-semibold uppercase tracking-wider text-ink-muted">
                      01 · Platform
                    </span>
                    <div className="flex flex-wrap gap-1.5 rounded-2xl border border-black/[0.06] bg-oat/70 p-1.5">
                      {STUDIO_PLATFORMS.map((item) => (
                        <Pill
                          key={item.id}
                          layoutId="studio-platform-pill"
                          active={platform === item.id}
                          onClick={() => handlePlatformSelect(item.id)}
                          activeClassName="bg-ink text-white shadow-sm"
                        >
                          <PlatformIcon platform={item.id} />
                          <span>{item.label}</span>
                        </Pill>
                      ))}
                    </div>
                  </div>

                  {/* Format selection */}
                  <div className="lg:col-span-6">
                    <span className="mb-2.5 block font-mono text-[11px] font-semibold uppercase tracking-wider text-ink-muted">
                      02 · Content Format
                    </span>
                    <div className="grid grid-cols-3 gap-2">
                      {STUDIO_FORMATS.map((item) => {
                        const isSelected = format === item.id;
                        return (
                          <motion.button
                            key={item.id}
                            type="button"
                            whileTap={{ scale: 0.96 }}
                            transition={SPRINGS.snappy}
                            onClick={() => handleFormatSelect(item.id)}
                            className={cn(
                              "flex flex-col items-start rounded-2xl border p-3 text-left transition-all cursor-pointer",
                              isSelected
                                ? "border-indigo bg-indigo-soft/75 text-ink shadow-sm"
                                : "border-black/[0.08] bg-cream/60 text-ink-secondary hover:bg-oat/60 hover:text-ink"
                            )}
                          >
                            <div className="flex items-center gap-1.5 text-xs font-bold text-ink">
                              <FormatIcon format={item.id} />
                              <span>{item.label}</span>
                            </div>
                            <span className="mt-1 hidden text-[11px] leading-tight text-ink-muted sm:block">
                              {item.subtitle}
                            </span>
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Tone selection + Generate button */}
                  <div className="flex flex-col justify-between gap-4 border-t border-black/[0.06] pt-4 sm:flex-row sm:items-center lg:col-span-12">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="mr-1 font-mono text-[11px] font-semibold uppercase tracking-wider text-ink-muted">
                        03 · Voice Tone:
                      </span>
                      {STUDIO_TONES.map((item) => {
                        const isSelected = tone === item.id;
                        return (
                          <motion.button
                            key={item.id}
                            type="button"
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleToneSelect(item.id)}
                            title={item.description}
                            className={cn(
                              "inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-all cursor-pointer",
                              isSelected
                                ? "border-ink bg-ink text-white shadow-sm"
                                : "border-black/[0.08] bg-white text-ink-secondary hover:border-black/20 hover:text-ink"
                            )}
                          >
                            <span
                              className={cn(
                                "h-2 w-2 rounded-full",
                                item.dotClass
                              )}
                            />
                            <span>{item.label}</span>
                          </motion.button>
                        );
                      })}
                    </div>

                    <div className="flex items-center gap-2.5">
                      <Button
                        type="button"
                        variant="outline"
                        size="md"
                        onClick={handleSurpriseIdea}
                        disabled={isGenerating}
                      >
                        <Shuffle className="h-4 w-4 text-indigo" />
                        <span>Surprise Idea</span>
                      </Button>

                      <Button
                        type="submit"
                        variant="coral"
                        size="md"
                        disabled={isGenerating}
                      >
                        {isGenerating ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span>Generating…</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="h-4 w-4" />
                            <span>Generate Content</span>
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </Reveal>

          {/* Split Creative Stage: Live Preview + Editable Result Atelier */}
          <div className="mt-8 grid items-start gap-6 lg:grid-cols-12">
            <div className="lg:col-span-6">
              <StudioResultEditor
                content={draftContent}
                isGenerating={isGenerating}
                onUpdate={(patch) =>
                  setDraftContent((prev) => ({ ...prev, ...patch }))
                }
                onResetToGenerated={() => setDraftContent(generatedSnapshot)}
                onSaveDraft={handleSaveDraft}
                justSaved={justSaved}
              />
            </div>

            <div className="lg:sticky lg:top-24 lg:col-span-6">
              <StudioLivePreview
                content={draftContent}
                isGenerating={isGenerating}
              />
            </div>
          </div>
        </section>

        {/* Saved Drafts Vault */}
        <StudioSavedVault
          drafts={savedDrafts}
          onLoadDraft={handleLoadDraft}
          onDeleteDraft={onDeleteStoredDraft}
        />
      </main>

      <StudioFooter />
    </div>
  );
}
