"use client";

import { useMemo, useRef, useState } from "react";
import { FloatingNav } from "@/components/layout/FloatingNav";
import { StudioFooter } from "@/components/layout/StudioFooter";
import { ContentConstellation } from "@/components/studio/ContentConstellation";
import { CreativeBento } from "@/components/studio/CreativeBento";
import { HeroStage } from "@/components/studio/HeroStage";
import { PostPreviewModal } from "@/components/studio/PostPreviewModal";
import { PromptSparkBar } from "@/components/studio/PromptSparkBar";
import { SavedSparksTray } from "@/components/studio/SavedSparksTray";
import {
  INITIAL_SPARK_CARDS,
  QUICK_TOPICS,
  generateSparkCards,
} from "@/data/mockStudioData";
import type { PlatformId, SparkCard, ToneId } from "@/types/creatorly";

const TONES: ToneId[] = ["electric", "editorial", "playful", "minimal"];

/**
 * Interactive Phase 1 showcase & live AI playground experience for Creatorly.
 */
export function CreatorlyStudio() {
  const [topic, setTopic] = useState<string>(QUICK_TOPICS[0]);
  const [platform, setPlatform] = useState<PlatformId>("all");
  const [tone, setTone] = useState<ToneId>("electric");
  const [cards, setCards] = useState<SparkCard[]>(INITIAL_SPARK_CARDS);
  const [hasCustomGenerated, setHasCustomGenerated] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [savedIds, setSavedIds] = useState<string[]>(["spark-ig-carousel"]);
  const [inspectState, setInspectState] = useState<{
    card: SparkCard | null;
    variationIndex: number;
  }>({ card: null, variationIndex: 0 });

  const inputRef = useRef<HTMLInputElement | null>(null);

  const visibleCards = useMemo(() => {
    if (platform === "all") return cards;
    const matched = cards.filter((card) => card.platform === platform);
    return matched.length > 0 ? matched : cards;
  }, [cards, platform]);

  const savedCards = useMemo(
    () => cards.filter((card) => savedIds.includes(card.id)),
    [cards, savedIds]
  );

  const runSparkGeneration = (
    nextTopic: string,
    nextPlatform: PlatformId,
    nextTone: ToneId
  ) => {
    setIsGenerating(true);
    window.setTimeout(() => {
      const nextCards = generateSparkCards(nextTopic, nextPlatform, nextTone);
      setCards(nextCards);
      setHasCustomGenerated(true);
      setIsGenerating(false);
    }, 320);
  };

  const handlePlatformChange = (nextPlatform: PlatformId) => {
    setPlatform(nextPlatform);
    if (hasCustomGenerated) {
      setCards(generateSparkCards(topic, nextPlatform, tone));
    }
  };

  const handleToneChange = (nextTone: ToneId) => {
    setTone(nextTone);
    runSparkGeneration(topic, platform, nextTone);
  };

  const handleShuffle = () => {
    const nextTopic =
      QUICK_TOPICS[
        (QUICK_TOPICS.indexOf(topic) + 1) % QUICK_TOPICS.length
      ] ?? QUICK_TOPICS[0];
    const nextTone = TONES[(TONES.indexOf(tone) + 1) % TONES.length] ?? "electric";
    setTopic(nextTopic);
    setTone(nextTone);
    runSparkGeneration(nextTopic, platform, nextTone);
  };

  const handleFocusPrompt = () => {
    const el = document.getElementById("playground");
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
    window.setTimeout(() => {
      inputRef.current?.focus();
    }, 350);
  };

  const handleToggleSave = (id: string) => {
    setSavedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="relative flex min-h-screen flex-col">
      <FloatingNav
        savedCount={savedCards.length}
        onFocusPrompt={handleFocusPrompt}
      />

      <main className="flex-1">
        <HeroStage
          onExplorePlayground={handleFocusPrompt}
          onSurpriseSpark={() => {
            handleShuffle();
            handleFocusPrompt();
          }}
        />

        <PromptSparkBar
          topic={topic}
          onTopicChange={setTopic}
          platform={platform}
          onPlatformChange={handlePlatformChange}
          tone={tone}
          onToneChange={handleToneChange}
          isGenerating={isGenerating}
          onGenerate={() => runSparkGeneration(topic, platform, tone)}
          onShuffle={handleShuffle}
          inputRef={inputRef}
        />

        <ContentConstellation
          cards={visibleCards}
          savedIds={savedIds}
          onToggleSave={handleToggleSave}
          onInspectCard={(card, variationIndex) =>
            setInspectState({ card, variationIndex })
          }
          isGenerating={isGenerating}
        />

        <CreativeBento />
      </main>

      <StudioFooter />

      <SavedSparksTray
        savedCards={savedCards}
        onClearSaved={() => setSavedIds([])}
      />

      <PostPreviewModal
        card={inspectState.card}
        initialVariationIndex={inspectState.variationIndex}
        onClose={() => setInspectState({ card: null, variationIndex: 0 })}
      />
    </div>
  );
}
