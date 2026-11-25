"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import {
  Calendar,
  Clapperboard,
  FolderKanban,
  Menu,
  Sparkles,
  Wand2,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { SPRINGS } from "@/components/motion/MotionPresets";
import { cn } from "@/lib/utils";

const SHOWCASE_LINKS = [
  { id: "playground", label: "AI Playground", href: "#playground" },
  { id: "constellation", label: "Spark Feed", href: "#constellation" },
  { id: "studio-lab", label: "Studio Lab", href: "#studio-lab" },
];

const APP_ROUTES = [
  { href: "/", label: "Showcase" },
  { href: "/studio", label: "AI Studio" },
  { href: "/calendar", label: "Calendar" },
  { href: "/posts", label: "Posts" },
  { href: "/reels", label: "Reels Lab" },
];

interface FloatingNavProps {
  savedCount: number;
  onFocusPrompt?: () => void;
  savedLabel?: string;
  ctaLabel?: string;
}

/**
 * Floating glassmorphic studio dock navigation supporting /, /studio, /calendar, and /posts.
 */
export function FloatingNav({
  savedCount,
  onFocusPrompt,
  savedLabel = "saved",
  ctaLabel = "Create Spark",
}: FloatingNavProps) {
  const pathname = usePathname();
  const isAppSubpage =
    pathname === "/studio" ||
    pathname === "/calendar" ||
    pathname === "/posts" ||
    pathname === "/reels";
  const [activeId, setActiveId] = useState<string>("playground");
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-4 z-40 mx-auto w-full max-w-6xl px-4 sm:px-6">
      <motion.nav
        initial={{ opacity: 0, y: -14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={SPRINGS.gentle}
        aria-label="Primary navigation"
        className="flex items-center justify-between rounded-full border border-black/[0.08] bg-white/85 px-3 py-2 shadow-float backdrop-blur-xl sm:px-4"
      >
        {/* Brand mark */}
        <Link
          href="/"
          className="group inline-flex items-center gap-2.5 rounded-full pl-1 pr-2 py-0.5"
        >
          <span className="relative flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-coral via-violet to-indigo text-white shadow-sm transition-transform duration-300 group-hover:rotate-12 group-hover:scale-105">
            <Sparkles className="h-4 w-4" />
          </span>
          <span className="font-display text-lg font-extrabold tracking-tight text-ink">
            Creatorly
          </span>
          <span className="hidden rounded-full bg-mint-soft px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-mint-deep sm:inline-block">
            Studio
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden items-center gap-1 rounded-full bg-oat/70 p-1 md:flex">
          {isAppSubpage ? (
            APP_ROUTES.map((route) => {
              const isActive = pathname === route.href;
              return (
                <Link
                  key={route.href}
                  href={route.href}
                  className={cn(
                    "relative rounded-full px-4 py-1.5 text-sm font-semibold transition-colors",
                    isActive
                      ? "text-ink"
                      : "text-ink-secondary hover:text-ink"
                  )}
                >
                  {isActive ? (
                    <motion.span
                      layoutId="nav-active-pill"
                      transition={SPRINGS.snappy}
                      className="absolute inset-0 rounded-full bg-white shadow-sm"
                    />
                  ) : null}
                  <span className="relative z-10 inline-flex items-center gap-1.5">
                    {isActive ? (
                      <span className="h-1.5 w-1.5 rounded-full bg-coral" />
                    ) : null}
                    {route.label}
                  </span>
                </Link>
              );
            })
          ) : (
            <>
              {SHOWCASE_LINKS.map((item) => {
                const isActive = activeId === item.id;
                return (
                  <a
                    key={item.id}
                    href={item.href}
                    onClick={() => setActiveId(item.id)}
                    className={cn(
                      "relative rounded-full px-3.5 py-1.5 text-sm font-semibold transition-colors",
                      isActive ? "text-ink" : "text-ink-secondary hover:text-ink"
                    )}
                  >
                    {isActive ? (
                      <motion.span
                        layoutId="nav-active-pill"
                        transition={SPRINGS.snappy}
                        className="absolute inset-0 rounded-full bg-white shadow-sm"
                      />
                    ) : null}
                    <span className="relative z-10">{item.label}</span>
                  </a>
                );
              })}
              <Link
                href="/studio"
                className="relative rounded-full px-3 py-1.5 text-sm font-semibold text-indigo transition-colors hover:bg-white/70"
              >
                AI Studio
              </Link>
              <Link
                href="/calendar"
                className="relative inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-sm font-semibold text-coral transition-colors hover:bg-white/70"
              >
                <Calendar className="h-3.5 w-3.5" />
                <span>Calendar</span>
              </Link>
              <Link
                href="/posts"
                className="relative inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-sm font-semibold text-[#7e22ce] transition-colors hover:bg-white/70"
              >
                <FolderKanban className="h-3.5 w-3.5" />
                <span>Posts</span>
              </Link>
              <Link
                href="/reels"
                className="relative inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-sm font-semibold text-mint-deep transition-colors hover:bg-white/70"
              >
                <Clapperboard className="h-3.5 w-3.5" />
                <span>Reels</span>
              </Link>
            </>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <div className="hidden items-center gap-1.5 rounded-full border border-black/[0.07] bg-oat/75 px-3 py-1.5 text-xs font-semibold text-ink-secondary sm:inline-flex">
            <span className="h-2 w-2 rounded-full bg-mint" />
            <span>
              {savedCount} {savedLabel}
            </span>
          </div>

          {onFocusPrompt ? (
            <Button
              variant="coral"
              size="sm"
              onClick={onFocusPrompt}
              className="hidden sm:inline-flex"
            >
              <Wand2 className="h-3.5 w-3.5" />
              <span>{ctaLabel}</span>
            </Button>
          ) : (
            <Link href="/studio" className="hidden sm:inline-flex">
              <Button variant="coral" size="sm">
                <Wand2 className="h-3.5 w-3.5" />
                <span>Open Studio</span>
              </Button>
            </Link>
          )}

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-black/[0.08] bg-oat/80 text-ink md:hidden"
          >
            {mobileOpen ? (
              <X className="h-4 w-4" />
            ) : (
              <Menu className="h-4 w-4" />
            )}
          </button>
        </div>
      </motion.nav>

      {/* Mobile animated drawer */}
      <AnimatePresence>
        {mobileOpen ? (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 8, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={SPRINGS.snappy}
            className="mt-2 rounded-3xl border border-black/[0.08] bg-white/95 p-4 shadow-float-lg backdrop-blur-xl md:hidden"
          >
            <div className="flex flex-col gap-1.5">
              {isAppSubpage ? (
                APP_ROUTES.map((route) => {
                  const isActive = pathname === route.href;
                  return (
                    <Link
                      key={route.href}
                      href={route.href}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        "flex items-center justify-between rounded-2xl px-3.5 py-2.5 text-sm font-semibold transition-colors",
                        isActive
                          ? "bg-oat/85 text-ink"
                          : "text-ink hover:bg-oat/60"
                      )}
                    >
                      <span>{route.label}</span>
                      {isActive ? (
                        <span className="h-2 w-2 rounded-full bg-coral" />
                      ) : (
                        <span className="font-mono text-[11px] text-ink-muted">
                          →
                        </span>
                      )}
                    </Link>
                  );
                })
              ) : (
                <>
                  {SHOWCASE_LINKS.map((item) => (
                    <a
                      key={item.id}
                      href={item.href}
                      onClick={() => {
                        setActiveId(item.id);
                        setMobileOpen(false);
                      }}
                      className="flex items-center justify-between rounded-2xl px-3.5 py-2.5 text-sm font-semibold text-ink hover:bg-oat/80"
                    >
                      <span>{item.label}</span>
                      <span className="font-mono text-[11px] text-ink-muted">
                        →
                      </span>
                    </a>
                  ))}
                  <Link
                    href="/studio"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-between rounded-2xl bg-indigo-soft/75 px-3.5 py-2.5 text-sm font-semibold text-indigo"
                  >
                    <span>AI Content Studio</span>
                    <span className="font-mono text-[11px]">→</span>
                  </Link>
                  <Link
                    href="/calendar"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-between rounded-2xl bg-coral-soft/75 px-3.5 py-2.5 text-sm font-semibold text-[#c93714]"
                  >
                    <span>Content Calendar</span>
                    <span className="font-mono text-[11px]">→</span>
                  </Link>
                  <Link
                    href="/posts"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-between rounded-2xl bg-violet-soft/75 px-3.5 py-2.5 text-sm font-semibold text-[#7e22ce]"
                  >
                    <span>Posts Manager</span>
                    <span className="font-mono text-[11px]">→</span>
                  </Link>
                  <Link
                    href="/reels"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-between rounded-2xl bg-mint-soft/75 px-3.5 py-2.5 text-sm font-semibold text-mint-deep"
                  >
                    <span>Reels Lab</span>
                    <span className="font-mono text-[11px]">→</span>
                  </Link>
                </>
              )}
            </div>
            <div className="mt-3 flex items-center justify-between border-t border-black/[0.06] pt-3">
              <span className="text-xs font-semibold text-ink-secondary">
                {savedCount} {savedLabel}
              </span>
              {onFocusPrompt ? (
                <Button
                  variant="coral"
                  size="sm"
                  onClick={() => {
                    setMobileOpen(false);
                    onFocusPrompt();
                  }}
                >
                  <Wand2 className="h-3.5 w-3.5" />
                  <span>{ctaLabel}</span>
                </Button>
              ) : null}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
