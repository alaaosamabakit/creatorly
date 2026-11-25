"use client";

import { ArrowUp, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function StudioFooter() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="mx-auto mt-20 w-full max-w-6xl px-4 pb-12 sm:px-6">
      <div className="relative overflow-hidden rounded-[2rem] border border-black/[0.08] bg-white/90 p-8 shadow-float sm:p-10">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-gradient-to-br from-coral/20 via-violet/15 to-indigo/20 blur-2xl"
        />

        <div className="relative flex flex-col justify-between gap-8 md:flex-row md:items-center">
          <div className="max-w-md space-y-3">
            <div className="inline-flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-ink text-white">
                <Sparkles className="h-4 w-4 text-mint" />
              </span>
              <span className="font-display text-xl font-extrabold text-ink">
                Creatorly
              </span>
              <span className="rounded-full bg-coral-soft px-2.5 py-0.5 font-mono text-[11px] font-semibold text-[#c93714]">
                Phase 1 Studio
              </span>
            </div>
            <p className="text-sm leading-relaxed text-ink-secondary">
              Built for creators, indie teams, and brand storytellers who want
              expressive AI ideation without sterile spreadsheet interfaces.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href="#playground"
              className="rounded-full border border-black/[0.08] bg-oat/70 px-4 py-2 text-xs font-semibold text-ink transition-colors hover:bg-oat"
            >
              AI Playground
            </a>
            <a
              href="#constellation"
              className="rounded-full border border-black/[0.08] bg-oat/70 px-4 py-2 text-xs font-semibold text-ink transition-colors hover:bg-oat"
            >
              Spark Feed
            </a>
            <a
              href="#studio-lab"
              className="rounded-full border border-black/[0.08] bg-oat/70 px-4 py-2 text-xs font-semibold text-ink transition-colors hover:bg-oat"
            >
              Studio Lab
            </a>
            <Button variant="ink" size="sm" onClick={scrollToTop}>
              <ArrowUp className="h-3.5 w-3.5" />
              <span>Back to top</span>
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
}
