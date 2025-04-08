import { MarketplacePromptCard } from "@/components/marketplace/market-prompt-card";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { PromptCard, PromptFilter } from "@/services/prompt/interface";
import { Dispatch, SetStateAction } from "react";

interface MarketplaceHoverCardProps extends PromptCard {
  filter?: PromptFilter;
  setIsHovered: Dispatch<SetStateAction<boolean>>;
}

export default function MarketplaceHoverCard(
  marketplaceCardProps: MarketplaceHoverCardProps,
) {
  return (
    <HoverCard
      onOpenChange={marketplaceCardProps.setIsHovered}
      openDelay={1000}
    >
      <HoverCardTrigger asChild>
        {/* Display card */}
        <div>
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
