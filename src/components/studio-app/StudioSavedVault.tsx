"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, Bookmark, Check, Copy, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { PlatformIcon } from "@/components/ui/PlatformIcon";
import { SPRINGS } from "@/components/motion/MotionPresets";
import { STUDIO_PLATFORMS } from "@/data/studioGenerator";
import { copyToClipboard } from "@/lib/utils";
import type { SavedStudioDraft } from "@/types/studio";

interface StudioSavedVaultProps {
  drafts: SavedStudioDraft[];
  onLoadDraft: (draft: SavedStudioDraft) => void;
  onDeleteDraft: (draftId: string) => void;
}

/**
 * Saved drafts shelf for reloading, copying, or managing crafted studio posts.
 */
export function StudioSavedVault({
  drafts,
  onLoadDraft,
  onDeleteDraft,
}: StudioSavedVaultProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = async (draft: SavedStudioDraft) => {
    const { content } = draft;
    const text = `${content.hook}\n\n${content.caption}\n\n${content.cta}\n${content.hashtags.join(" ")}`;
    await copyToClipboard(text);
    setCopiedId(draft.draftId);
    window.setTimeout(() => {
      setCopiedId((prev) => (prev === draft.draftId ? null : prev));
    }, 1600);
  };

  return (
    <section className="mx-auto mt-14 w-full max-w-6xl px-4 sm:px-6">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-2">
        <div>
          <span className="font-mono text-xs font-semibold uppercase tracking-wider text-ink-muted">
            Studio Vault
          </span>
          <h2 className="mt-1 font-display text-2xl font-extrabold text-ink">
            Saved Drafts ({drafts.length})
          </h2>
        </div>
        <p className="text-xs text-ink-secondary">
          Save any edited variation above to compare hooks or reload it into the
          preview stage.
        </p>
      </div>

      {drafts.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-black/15 bg-white/75 p-8 text-center">
          <Bookmark className="mx-auto h-6 w-6 text-coral" />
          <p className="mt-2 font-display text-base font-bold text-ink">
            Your Studio Vault is empty
          </p>
          <p className="mt-1 text-xs text-ink-muted">
            Click <strong>Save Draft</strong> in the editor to keep a snapshot
            here.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {drafts.map((draft) => {
              const { content } = draft;
              const platformMeta =
                STUDIO_PLATFORMS.find((p) => p.id === content.platform) ??
                STUDIO_PLATFORMS[0];
              const isCopied = copiedId === draft.draftId;

              return (
                <motion.article
                  key={draft.draftId}
                  layout
                  initial={{ opacity: 0, y: 14, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.94 }}
                  transition={SPRINGS.bouncy}
                  className="flex flex-col justify-between rounded-3xl border border-black/[0.08] bg-white p-5 shadow-float"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <Badge variant={content.accent}>
                        <PlatformIcon platform={content.platform} />
                        <span>{platformMeta.label}</span>
                      </Badge>
                      <span className="font-mono text-[11px] text-ink-muted">
                        {content.format} · {draft.savedAtLabel}
                      </span>
                    </div>

                    <h3 className="mt-3 font-display text-base font-bold leading-snug text-ink">
                      “{content.hook}”
                    </h3>
                    <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-ink-secondary">
                      {content.caption}
                    </p>
                  </div>

                  <div className="mt-4 flex items-center justify-between gap-2 border-t border-black/[0.06] pt-3">
                    <button
                      type="button"
                      onClick={() => onLoadDraft(draft)}
                      className="inline-flex items-center gap-1 rounded-full bg-oat px-3 py-1.5 text-xs font-semibold text-ink transition-colors hover:bg-ink hover:text-white cursor-pointer"
                    >
                      <span>Load</span>
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </button>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleCopy(draft)}
                        className="inline-flex items-center gap-1 rounded-full border border-black/[0.08] bg-white px-2.5 py-1.5 text-xs font-semibold text-ink-secondary hover:text-ink cursor-pointer"
                      >
                        {isCopied ? (
                          <>
                            <Check className="h-3.5 w-3.5 text-mint-deep" />
                            <span>Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="h-3.5 w-3.5" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        aria-label="Delete saved draft"
                        onClick={() => onDeleteDraft(draft.draftId)}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-black/[0.08] bg-white text-ink-muted transition-colors hover:border-coral/30 hover:text-coral cursor-pointer"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </section>
  );
}
