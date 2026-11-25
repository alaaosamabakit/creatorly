"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import {
  AlertCircle,
  Check,
  Film,
  Image as ImageIcon,
  Plus,
  Trash2,
  UploadCloud,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { formatBytes } from "@/lib/reelsMediaDb";
import { cn } from "@/lib/utils";
import type { MediaAssetView } from "@/types/reels";

interface ReelsMediaLibraryProps {
  assets: MediaAssetView[];
  storageMode: "indexeddb" | "memory";
  activeSceneMediaId: string | null;
  activeSceneTitle: string;
  onUploadFiles: (
    files: FileList | File[]
  ) => Promise<{ addedCount: number; errors: string[] }>;
  onAssignAsset: (assetId: string) => void;
  onUnassignAsset: () => void;
  onRemoveAsset: (assetId: string) => void;
}

/**
 * Local browser Media Library backed by IndexedDB with graceful file validation.
 */
export function ReelsMediaLibrary({
  assets,
  storageMode,
  activeSceneMediaId,
  activeSceneTitle,
  onUploadFiles,
  onAssignAsset,
  onUnassignAsset,
  onRemoveAsset,
}: ReelsMediaLibraryProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [uploadErrors, setUploadErrors] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFiles = async (files: FileList | File[] | null) => {
    if (!files || files.length === 0) return;
    setIsProcessing(true);
    setUploadErrors([]);
    const result = await onUploadFiles(files);
    if (result.errors.length > 0) {
      setUploadErrors(result.errors);
    }
    setIsProcessing(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="rounded-[2.1rem] border border-black/[0.08] bg-white p-5 shadow-float sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-ink-muted">
              Local Media Library
            </span>
            <Badge variant="cream" className="font-mono text-[10px]">
              {storageMode === "indexeddb"
                ? "IndexedDB Local Storage"
                : "Session Memory Fallback"}
            </Badge>
          </div>
          <h3 className="mt-1 font-display text-lg font-extrabold text-ink">
            Clips & Stills ({assets.length})
          </h3>
          <p className="text-xs text-ink-secondary">
            Assign local images or videos directly to{" "}
            <strong className="text-ink">{activeSceneTitle}</strong>. Files stay
            in your browser only.
          </p>
        </div>

        <div>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/jpeg,image/png,image/webp,image/gif,image/avif,video/mp4,video/webm,video/quicktime"
            className="hidden"
            onChange={(e) => void handleFiles(e.target.files)}
          />
          <Button
            variant="indigo"
            size="sm"
            disabled={isProcessing}
            onClick={() => fileInputRef.current?.click()}
          >
            <Plus className="h-3.5 w-3.5" />
            <span>{isProcessing ? "Importing…" : "Upload Media"}</span>
          </Button>
        </div>
      </div>

      {/* Dropzone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDraggingOver(true);
        }}
        onDragLeave={() => setIsDraggingOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDraggingOver(false);
          void handleFiles(e.dataTransfer.files);
        }}
        onClick={() => fileInputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            fileInputRef.current?.click();
          }
        }}
        className={cn(
          "mt-4 flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed p-5 text-center transition-colors",
          isDraggingOver
            ? "border-indigo bg-indigo-soft/60"
            : "border-black/15 bg-cream/65 hover:border-coral/45 hover:bg-coral-soft/25"
        )}
      >
        <UploadCloud className="h-6 w-6 text-indigo" />
        <p className="mt-2 text-xs font-semibold text-ink">
          Drop local images or short video clips here, or click to browse
        </p>
        <p className="mt-0.5 font-mono text-[10px] text-ink-muted">
          Supports JPG, PNG, WebP, GIF, MP4, WebM, MOV (max 120 MB · no external
          upload)
        </p>
      </div>

      {/* Graceful upload errors */}
      {uploadErrors.length > 0 ? (
        <div className="mt-3 rounded-2xl border border-coral/35 bg-coral-soft/75 p-3 text-xs text-[#b52b0a]">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-start gap-2">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <ul className="space-y-1">
                {uploadErrors.map((err) => (
                  <li key={err}>{err}</li>
                ))}
              </ul>
            </div>
            <button
              type="button"
              onClick={() => setUploadErrors([])}
              aria-label="Dismiss error"
              className="rounded-full p-0.5 hover:bg-white/60 cursor-pointer"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      ) : null}

      {/* Uploaded thumbnails */}
      {assets.length > 0 ? (
        <div className="mt-4 grid gap-3 sm:grid-cols-2 md:grid-cols-3">
          {assets.map((asset) => {
            const isAssigned = activeSceneMediaId === asset.id;
            return (
              <div
                key={asset.id}
                className={cn(
                  "overflow-hidden rounded-2xl border bg-cream/65 transition-all",
                  isAssigned
                    ? "border-mint ring-2 ring-mint/40"
                    : "border-black/[0.08]"
                )}
              >
                <div className="relative h-28 w-full bg-ink/90">
                  {asset.kind === "image" ? (
                    <Image
                      src={asset.objectUrl}
                      alt={asset.name}
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  ) : (
                    <video
                      src={asset.objectUrl}
                      muted
                      playsInline
                      preload="metadata"
                      className="h-full w-full object-cover"
                    />
                  )}

                  <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-black/55 px-2 py-0.5 font-mono text-[10px] font-semibold text-white backdrop-blur-xs">
                    {asset.kind === "image" ? (
                      <ImageIcon className="h-3 w-3" />
                    ) : (
                      <Film className="h-3 w-3" />
                    )}
                    {asset.kind}
                  </span>

                  <button
                    type="button"
                    aria-label={`Remove ${asset.name}`}
                    onClick={() => onRemoveAsset(asset.id)}
                    className="absolute right-2 top-2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-black/55 text-white transition-colors hover:bg-coral cursor-pointer"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>

                <div className="p-2.5">
                  <p className="truncate text-xs font-bold text-ink">
                    {asset.name}
                  </p>
                  <p className="font-mono text-[10px] text-ink-muted">
                    {formatBytes(asset.sizeBytes)}
                  </p>

                  <button
                    type="button"
                    onClick={() =>
                      isAssigned ? onUnassignAsset() : onAssignAsset(asset.id)
                    }
                    className={cn(
                      "mt-2 inline-flex w-full items-center justify-center gap-1 rounded-full py-1.5 text-[11px] font-bold transition-colors cursor-pointer",
                      isAssigned
                        ? "bg-mint-soft text-mint-deep"
                        : "bg-ink text-white hover:bg-coral"
                    )}
                  >
                    {isAssigned ? (
                      <>
                        <Check className="h-3 w-3" />
                        <span>Assigned (Click to Clear)</span>
                      </>
                    ) : (
                      <span>Assign to Scene</span>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
