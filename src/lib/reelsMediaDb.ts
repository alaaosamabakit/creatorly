"use client";

import { useEffect, useSyncExternalStore } from "react";
import type {
  MediaAssetKind,
  MediaAssetRecord,
  MediaAssetView,
} from "@/types/reels";

const DB_NAME = "creatorly-reels-media-db";
const DB_VERSION = 1;
const STORE_NAME = "assets";
const MAX_FILE_BYTES = 120 * 1024 * 1024; // 120 MB safety cap for browser memory

const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
]);

const ALLOWED_VIDEO_TYPES = new Set([
  "video/mp4",
  "video/webm",
  "video/quicktime",
  "video/ogg",
]);

const listeners = new Set<() => void>();
let assetsState: MediaAssetView[] = [];
const EMPTY_ASSETS: MediaAssetView[] = [];
let hasAttemptedLoad = false;
let storageModeState: "indexeddb" | "memory" = "indexeddb";

function emitMediaChange() {
  listeners.forEach((listener) => listener());
}

function subscribeMedia(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getMediaSnapshot(): MediaAssetView[] {
  return assetsState;
}

function getServerMediaSnapshot(): MediaAssetView[] {
  return EMPTY_ASSETS;
}

function openMediaDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined" || !("indexedDB" in window)) {
      reject(new Error("IndexedDB is unavailable in this browser."));
      return;
    }

    const req = window.indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () =>
      reject(req.error ?? new Error("Failed to open IndexedDB."));
  });
}

async function readAllRecordsFromDb(): Promise<MediaAssetRecord[]> {
  const db = await openMediaDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readonly");
    const store = tx.objectStore(STORE_NAME);
    const req = store.getAll();
    req.onsuccess = () => resolve((req.result as MediaAssetRecord[]) ?? []);
    req.onerror = () =>
      reject(req.error ?? new Error("Failed to read media assets."));
  });
}

async function putRecordInDb(record: MediaAssetRecord): Promise<void> {
  const db = await openMediaDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    const req = store.put(record);
    req.onsuccess = () => resolve();
    req.onerror = () =>
      reject(req.error ?? new Error("Failed to save media asset."));
  });
}

async function deleteRecordFromDb(id: string): Promise<void> {
  const db = await openMediaDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    const req = store.delete(id);
    req.onsuccess = () => resolve();
    req.onerror = () =>
      reject(req.error ?? new Error("Failed to remove media asset."));
  });
}

function recordToView(record: MediaAssetRecord): MediaAssetView {
  return {
    id: record.id,
    name: record.name,
    mimeType: record.mimeType,
    kind: record.kind,
    sizeBytes: record.sizeBytes,
    createdAt: record.createdAt,
    objectUrl: URL.createObjectURL(record.blob),
  };
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  return `${(kb / 1024).toFixed(1)} MB`;
}

function classifyFile(file: File): MediaAssetKind | null {
  if (ALLOWED_IMAGE_TYPES.has(file.type)) return "image";
  if (ALLOWED_VIDEO_TYPES.has(file.type)) return "video";

  const lower = file.name.toLowerCase();
  if (/\.(jpe?g|png|webp|gif|avif)$/.test(lower)) return "image";
  if (/\.(mp4|webm|mov|m4v|ogv)$/.test(lower)) return "video";
  return null;
}

export interface MediaUploadResult {
  added: MediaAssetView[];
  errors: string[];
}

export function useReelsMediaLibrary() {
  const assets = useSyncExternalStore(
    subscribeMedia,
    getMediaSnapshot,
    getServerMediaSnapshot
  );

  useEffect(() => {
    if (hasAttemptedLoad) return;
    hasAttemptedLoad = true;

    readAllRecordsFromDb()
      .then((records) => {
        const sorted = [...records].sort((a, b) =>
          b.createdAt.localeCompare(a.createdAt)
        );
        assetsState = sorted.map(recordToView);
        storageModeState = "indexeddb";
        emitMediaChange();
      })
      .catch(() => {
        storageModeState = "memory";
      });
  }, []);

  const uploadFiles = async (
    fileList: FileList | File[]
  ): Promise<MediaUploadResult> => {
    const files = Array.from(fileList);
    const added: MediaAssetView[] = [];
    const errors: string[] = [];

    for (const file of files) {
      const kind = classifyFile(file);
      if (!kind) {
        errors.push(
          `"${file.name}" is not a supported image (JPG, PNG, WebP, GIF) or video (MP4, WebM, MOV).`
        );
        continue;
      }

      if (file.size === 0) {
        errors.push(`"${file.name}" appears to be empty.`);
        continue;
      }

      if (file.size > MAX_FILE_BYTES) {
        errors.push(
          `"${file.name}" (${formatBytes(file.size)}) exceeds the 120 MB browser limit.`
        );
        continue;
      }

      const record: MediaAssetRecord = {
        id: `media-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        name: file.name,
        mimeType: file.type || (kind === "image" ? "image/png" : "video/mp4"),
        kind,
        sizeBytes: file.size,
        createdAt: new Date().toISOString(),
        blob: file,
      };

      try {
        await putRecordInDb(record);
      } catch {
        storageModeState = "memory";
      }

      const view = recordToView(record);
      assetsState = [view, ...assetsState];
      added.push(view);
      emitMediaChange();
    }

    return { added, errors };
  };

  const removeAsset = async (id: string) => {
    const existing = assetsState.find((a) => a.id === id);
    if (existing) {
      URL.revokeObjectURL(existing.objectUrl);
    }
    assetsState = assetsState.filter((a) => a.id !== id);
    emitMediaChange();

    try {
      await deleteRecordFromDb(id);
    } catch {
      // Already removed from active view
    }
  };

  return {
    assets,
    storageMode: storageModeState,
    uploadFiles,
    removeAsset,
  };
}
