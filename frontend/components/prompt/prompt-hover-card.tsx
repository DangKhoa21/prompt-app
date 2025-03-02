import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { PromptMarketplaceCard } from "@/components/prompt/prompt-marketplace-card";
import { PromptCard, PromptFilter } from "@/services/prompt/interface";
import { Dispatch, SetStateAction } from "react";

export default function PromptHoverCard(
  marketplaceCardProps: PromptCard & { filter?: PromptFilter } & {
    setIsHovered: Dispatch<SetStateAction<boolean>>;
  }
) {
  return (
    <HoverCard
      onOpenChange={marketplaceCardProps.setIsHovered}
      openDelay={1000}
    >
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
