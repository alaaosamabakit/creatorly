import { Suspense } from "react";
import type { Metadata } from "next";
import { CalendarWorkspace } from "@/components/calendar/CalendarWorkspace";

export const metadata: Metadata = {
  title: "Content Calendar — Creatorly",
  description:
    "Plan, drag-and-drop, filter, and preview your multi-platform social schedule in Creatorly's Editorial Content Calendar.",
};

export default function CalendarPage() {
  return (
    <Suspense fallback={null}>
      <CalendarWorkspace />
    </Suspense>
  );
}
