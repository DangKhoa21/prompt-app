import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { PromptMarketplaceCard } from "@/components/prompt/prompt-marketplace-card";
import { PromptCard } from "@/services/prompt/interface";
import { Dispatch, SetStateAction } from "react";

export default function PromptHoverCard(
  marketplaceCardProps: PromptCard & { tagId?: string } & {
    setIsHovered: Dispatch<SetStateAction<boolean>>;
  }
) {
  return (
    <HoverCard onOpenChange={marketplaceCardProps.setIsHovered}>
      <HoverCardTrigger asChild>
        {/* Display card */}
        <div className="transition-all hover:scale-105">
          <PromptMarketplaceCard {...marketplaceCardProps} />
        </div>
      </HoverCardTrigger>
      {/* Hover card */}
      <HoverCardContent sideOffset={-150} className="w-80">
        <PromptMarketplaceCard {...marketplaceCardProps} variant="hover" />
      </HoverCardContent>
    </HoverCard>
  );
}
