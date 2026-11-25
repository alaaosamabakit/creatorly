import type { Metadata } from "next";
import { PostsWorkspace } from "@/components/posts/PostsWorkspace";

export const metadata: Metadata = {
  title: "Posts Manager — Creatorly",
  description:
    "Browse, filter, search, edit, and organize all drafts, scheduled posts, and demo published content in Creatorly.",
};

export default function PostsPage() {
  return <PostsWorkspace />;
}
