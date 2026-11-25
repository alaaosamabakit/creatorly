import { Suspense } from "react";
import type { Metadata } from "next";
import { StudioWorkspace } from "@/components/studio-app/StudioWorkspace";

export const metadata: Metadata = {
  title: "AI Content Studio — Creatorly",
  description:
    "Create, remix, edit, and preview platform-native social content in Creatorly's AI Content Studio.",
};

export default function StudioPage() {
  return (
    <Suspense fallback={null}>
      <StudioWorkspace />
    </Suspense>
  );
}
