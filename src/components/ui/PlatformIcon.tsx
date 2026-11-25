import {
  Camera,
  Clapperboard,
  Globe,
  Layers,
  MessageSquareQuote,
  Play,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { CardAccent, PlatformId } from "@/types/creatorly";
import type { StudioPlatform } from "@/types/studio";

export const ACCENT_SURFACE_MAP: Record<
  CardAccent,
  {
    softBg: string;
    solidBg: string;
    gradientBg: string;
    text: string;
    border: string;
  }
> = {
  coral: {
    softBg: "bg-coral-soft",
    solidBg: "bg-coral",
    gradientBg: "from-[#FF5C35] via-[#FF7D4D] to-[#FFA66B]",
    text: "text-[#c93714]",
    border: "border-coral/25",
  },
  indigo: {
    softBg: "bg-indigo-soft",
    solidBg: "bg-indigo",
    gradientBg: "from-[#4F46E5] via-[#6366F1] to-[#818CF8]",
    text: "text-indigo",
    border: "border-indigo/25",
  },
  mint: {
    softBg: "bg-mint-soft",
    solidBg: "bg-mint",
    gradientBg: "from-[#0BB878] via-[#10D98E] to-[#5EEAD4]",
    text: "text-mint-deep",
    border: "border-mint/30",
  },
  violet: {
    softBg: "bg-violet-soft",
    solidBg: "bg-violet",
    gradientBg: "from-[#9333EA] via-[#A855F7] to-[#D946EF]",
    text: "text-[#7e22ce]",
    border: "border-violet/25",
  },
};

export function PlatformIcon({
  platform,
  className,
}: {
  platform: PlatformId | StudioPlatform;
  className?: string;
}) {
  const iconClass = cn("h-3.5 w-3.5 shrink-0", className);

  switch (platform) {
    case "instagram":
      return <Camera className={iconClass} />;
    case "facebook":
      return <Globe className={iconClass} />;
    case "tiktok":
      return <Clapperboard className={iconClass} />;
    case "x":
      return <MessageSquareQuote className={iconClass} />;
    case "linkedin":
      return <Layers className={iconClass} />;
    case "youtube":
      return <Play className={iconClass} />;
    default:
      return <Sparkles className={iconClass} />;
  }
}
