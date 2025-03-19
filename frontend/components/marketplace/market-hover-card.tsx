import { MarketplacePromptCard } from "@/components/marketplace/market-prompt-card";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { PromptCard, PromptFilter } from "@/services/prompt/interface";
import { Dispatch, SetStateAction } from "react";

export default function MarketplaceHoverCard(
  marketplaceCardProps: PromptCard & { filter?: PromptFilter } & {
    setIsHovered: Dispatch<SetStateAction<boolean>>;
  },
) {
  return (
    <HoverCard
      onOpenChange={marketplaceCardProps.setIsHovered}
      openDelay={1000}
    >
      <HoverCardTrigger asChild>
        {/* Display card */}
        <div className="transition-all hover:scale-105">
          <MarketplacePromptCard {...marketplaceCardProps} />
        </div>
      </HoverCardTrigger>
      {/* Hover card */}
      <HoverCardContent sideOffset={-150} className="w-80">
        <MarketplacePromptCard {...marketplaceCardProps} variant="hover" />
      </HoverCardContent>
    </HoverCard>
  );
}
