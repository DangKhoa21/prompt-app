import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  MarketplaceCardProps,
  PromptMarketplaceCard,
} from "@/components/prompt/prompt-marketplace-card";

export default function PromptHoverCard(
  marketplaceCardProps: MarketplaceCardProps
) {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        {/* Display card */}
        <div>
          <PromptMarketplaceCard {...marketplaceCardProps} />
        </div>
      </HoverCardTrigger>
      {/* Hover card */}
      <HoverCardContent sideOffset={0} className="w-96">
        <PromptMarketplaceCard {...marketplaceCardProps} variant="hover" />
      </HoverCardContent>
    </HoverCard>
  );
}
