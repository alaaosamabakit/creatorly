"use client";

import { useState } from "react";
import { motion } from "motion/react";
import {
  Bookmark,
  Check,
  Copy,
  Hash,
  Megaphone,
  Pencil,
  Plus,
  RotateCcw,
  Sparkles,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { SPRINGS } from "@/components/motion/MotionPresets";
import { cn, copyToClipboard } from "@/lib/utils";
import type { GeneratedStudioContent } from "@/types/studio";

interface StudioResultEditorProps {
  content: GeneratedStudioContent;
  isGenerating: boolean;
  onUpdate: (patch: Partial<GeneratedStudioContent>) => void;
  onResetToGenerated: () => void;
  onSaveDraft: () => void;
  justSaved: boolean;
}

/**
 * Editable editorial cards for Hook, Caption, Hashtags, and Call to Action.
 */
export function StudioResultEditor({
  content,
  isGenerating,
  onUpdate,
  onResetToGenerated,
  onSaveDraft,
  justSaved,
}: StudioResultEditorProps) {
  const [newTag, setNewTag] = useState("");
  const [copiedAll, setCopiedAll] = useState(false);

  const handleAddTag = () => {
    const cleaned = newTag.trim().replace(/^#+/, "").replace(/\s+/g, "");
    if (!cleaned) return;
    const formatted = `#${cleaned}`;
    if (!content.hashtags.includes(formatted)) {
      onUpdate({ hashtags: [...content.hashtags, formatted] });
    }
    setNewTag("");
  };

  const handleRemoveTag = (tagToRemove: string) => {
    onUpdate({
      hashtags: content.hashtags.filter((t) => t !== tagToRemove),
    });
  };

  const handleCopyAll = async () => {
    const fullPost = [
      content.hook,
      "",
      content.caption,
      "",
      content.cta,
      content.hashtags.join(" "),
    ].join("\n");

    await copyToClipboard(fullPost);
    setCopiedAll(true);
    window.setTimeout(() => setCopiedAll(false), 1800);
  };

  const handleCycleCta = () => {
    const idx = content.alternateCtas.indexOf(content.cta);
    const next =
      content.alternateCtas[(idx + 1) % content.alternateCtas.length] ??
      content.cta;
    onUpdate({ cta: next });
  };

  if (isGenerating) {
    return (
      <div className="space-y-4 rounded-[2.1rem] border border-black/[0.08] bg-white p-6 shadow-float">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 animate-pulse text-coral" />
          <span className="font-mono text-xs font-semibold uppercase tracking-wider text-ink-muted">
            Crafting Hook, Caption, Hashtags & CTA…
          </span>
        </div>
        {[1, 2, 3, 4].map((row) => (
          <div
            key={row}
            className="animate-pulse rounded-2xl bg-oat/70 p-5"
          >
            <div className="h-3 w-24 rounded-full bg-black/10" />
            <div className="mt-3 h-4 w-full rounded-full bg-black/10" />
            <div className="mt-2 h-4 w-3/4 rounded-full bg-black/10" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={SPRINGS.gentle}
      className="space-y-4 rounded-[2.1rem] border border-black/[0.08] bg-white p-5 shadow-float sm:p-6"
    >
      {/* Top Action Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-black/[0.06] pb-4">
        <div className="flex items-center gap-2">
          <Badge variant="mint" className="font-mono">
            {content.hookScore}% Hook Score
          </Badge>
          <span className="inline-flex items-center gap-1 text-xs font-medium text-ink-muted">
            <Pencil className="h-3 w-3" />
            All fields edit live in preview
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onResetToGenerated}
            title="Restore original generated draft"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset</span>
          </Button>

          <Button variant="outline" size="sm" onClick={handleCopyAll}>
            {copiedAll ? (
              <>
                <Check className="h-3.5 w-3.5 text-mint-deep" />
                <span>Copied</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                <span>Copy Post</span>
              </>
            )}
          </Button>

          <Button
            variant={justSaved ? "indigo" : "ink"}
            size="sm"
            onClick={onSaveDraft}
          >
            {justSaved ? (
              <>
                <Check className="h-3.5 w-3.5" />
                <span>Saved</span>
              </>
            ) : (
              <>
                <Bookmark className="h-3.5 w-3.5" />
                <span>Save Draft</span>
              </>
            )}
          </Button>
        </div>
      </div>

      {/* 1. Content Hook */}
      <div className="rounded-2xl border border-coral/20 bg-coral-soft/45 p-4">
        <label
          htmlFor="studio-hook-input"
          className="mb-2 flex items-center justify-between font-mono text-[11px] font-semibold uppercase tracking-wider text-[#c93714]"
        >
          <span>01 · Content Hook</span>
          <span>{content.hook.length} chars</span>
        </label>
        <textarea
          id="studio-hook-input"
          rows={2}
          value={content.hook}
          onChange={(e) => onUpdate({ hook: e.target.value })}
          className="w-full resize-none rounded-xl border border-black/[0.07] bg-white px-3.5 py-2.5 font-display text-base font-bold text-ink focus:border-coral focus:outline-none"
        />
      </div>

      {/* 2. Caption */}
      <div className="rounded-2xl border border-black/[0.07] bg-cream/70 p-4">
        <label
          htmlFor="studio-caption-input"
          className="mb-2 flex items-center justify-between font-mono text-[11px] font-semibold uppercase tracking-wider text-ink-muted"
        >
          <span>02 · Caption</span>
          <span>{content.caption.split(/\s+/).filter(Boolean).length} words</span>
        </label>
        <textarea
          id="studio-caption-input"
          rows={4}
          value={content.caption}
          onChange={(e) => onUpdate({ caption: e.target.value })}
          className="w-full resize-y rounded-xl border border-black/[0.07] bg-white px-3.5 py-2.5 text-sm leading-relaxed text-ink focus:border-indigo focus:outline-none"
        />
      </div>

      {/* 3. Hashtags */}
      <div className="rounded-2xl border border-black/[0.07] bg-cream/70 p-4">
        <div className="mb-2.5 flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 font-mono text-[11px] font-semibold uppercase tracking-wider text-ink-muted">
            <Hash className="h-3.5 w-3.5 text-indigo" />
            03 · Hashtags ({content.hashtags.length})
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          {content.hashtags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1.5 rounded-full border border-indigo/20 bg-indigo-soft/75 px-3 py-1 font-mono text-xs font-semibold text-indigo"
            >
              <span>{tag}</span>
              <button
                type="button"
                onClick={() => handleRemoveTag(tag)}
                aria-label={`Remove ${tag}`}
                className="rounded-full p-0.5 hover:bg-indigo/15 cursor-pointer"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>

        <div className="mt-3 flex items-center gap-2">
          <input
            type="text"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddTag();
              }
            }}
            placeholder="Add hashtag (e.g. EspressoRitual)"
            className="flex-1 rounded-full border border-black/[0.08] bg-white px-3.5 py-1.5 text-xs text-ink placeholder:text-ink-muted focus:border-indigo focus:outline-none"
          />
          <button
            type="button"
            onClick={handleAddTag}
            className="inline-flex items-center gap-1 rounded-full bg-ink px-3 py-1.5 text-xs font-semibold text-white transition-transform active:scale-95 cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add</span>
          </button>
        </div>
      </div>

      {/* 4. Call to Action */}
      <div className="rounded-2xl border border-violet/20 bg-violet-soft/45 p-4">
        <div className="mb-2 flex items-center justify-between gap-2">
          <label
            htmlFor="studio-cta-input"
            className="inline-flex items-center gap-1.5 font-mono text-[11px] font-semibold uppercase tracking-wider text-[#7e22ce]"
          >
            <Megaphone className="h-3.5 w-3.5" />
            04 · Call to Action
          </label>
          <button
            type="button"
            onClick={handleCycleCta}
            className={cn(
              "rounded-full bg-white px-2.5 py-0.5 text-[11px] font-semibold text-[#7e22ce] border border-violet/20 hover:bg-violet-soft transition-colors cursor-pointer"
            )}
          >
            Swap CTA Angle
          </button>
        </div>
        <input
          id="studio-cta-input"
          type="text"
          value={content.cta}
          onChange={(e) => onUpdate({ cta: e.target.value })}
          className="w-full rounded-xl border border-black/[0.07] bg-white px-3.5 py-2 text-sm font-semibold text-ink focus:border-violet focus:outline-none"
        />
      </div>
    </motion.div>
  );
}
