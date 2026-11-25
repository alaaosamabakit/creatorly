"use client";

import { motion } from "motion/react";
import { GripVertical } from "lucide-react";
import { PlatformIcon } from "@/components/ui/PlatformIcon";
import { SPRINGS } from "@/components/motion/MotionPresets";
import {
  CALENDAR_PLATFORM_META,
  CALENDAR_STATUS_META,
  formatTimeLabel,
} from "@/data/calendarData";
import { cn } from "@/lib/utils";
import type { CalendarPost } from "@/types/calendar";

interface CalendarPostCardProps {
  post: CalendarPost;
  compact?: boolean;
  onSelect: (post: CalendarPost) => void;
  onDragStartPost: (postId: string) => void;
  onDragEndPost: () => void;
}

/**
 * Tactile, platform-colored draggable post card for Monthly and Weekly calendar views.
 */
export function CalendarPostCard({
  post,
  compact = false,
  onSelect,
  onDragStartPost,
  onDragEndPost,
}: CalendarPostCardProps) {
  const platformMeta = CALENDAR_PLATFORM_META[post.platform];
  const statusMeta = CALENDAR_STATUS_META[post.status];

  return (
    <div
      draggable
      onDragStart={(e) => {
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData("text/plain", post.id);
        onDragStartPost(post.id);
      }}
      onDragEnd={onDragEndPost}
      className="group relative"
    >
      <motion.button
        type="button"
        onClick={() => onSelect(post)}
        whileHover={{ y: -2, scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
        transition={SPRINGS.snappy}
        className={cn(
          "relative w-full overflow-hidden rounded-2xl border bg-white text-left shadow-sm transition-shadow hover:shadow-float cursor-pointer",
          platformMeta.borderClass,
          compact ? "p-2.5" : "p-3"
        )}
      >
        {/* Left distinctive platform color bar */}
        <span
          aria-hidden="true"
          className={cn(
            "absolute inset-y-0 left-0 w-1.5",
            platformMeta.stripeClass
          )}
        />

        <div className="pl-2">
          {/* Platform + Time + Status */}
          <div className="flex items-center justify-between gap-1.5">
            <span
              className={cn(
                "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold",
                platformMeta.chipBg,
                platformMeta.chipText
              )}
            >
              <PlatformIcon platform={post.platform} className="h-3 w-3" />
              {!compact ? <span>{platformMeta.label}</span> : null}
              <span className="uppercase opacity-75">· {post.format}</span>
            </span>

            <div className="flex items-center gap-1">
              <span
                title={statusMeta.label}
                className={cn("h-2 w-2 rounded-full", statusMeta.dotClass)}
              />
              <GripVertical className="h-3 w-3 text-ink-muted/45 opacity-0 transition-opacity group-hover:opacity-100" />
            </div>
          </div>

          {/* Title */}
          <p
            className={cn(
              "mt-1.5 font-display font-bold leading-snug text-ink",
              compact ? "line-clamp-2 text-xs" : "line-clamp-2 text-sm"
            )}
          >
            {post.title}
          </p>

          {/* Visual mini-preview & time */}
          <div className="mt-1.5 flex items-center justify-between gap-1 text-[10px] font-medium text-ink-muted">
            <span className="font-mono">
              {formatTimeLabel(post.scheduledTime)}
            </span>
            <span
              className={cn(
                "rounded-full border px-1.5 py-0.5 text-[9px] font-semibold",
                statusMeta.pillClass
              )}
            >
              {statusMeta.label}
            </span>
          </div>
        </div>
      </motion.button>
    </div>
  );
}
