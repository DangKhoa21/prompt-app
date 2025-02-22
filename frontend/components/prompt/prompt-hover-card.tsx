import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { PromptMarketplaceCard } from "@/components/prompt/prompt-marketplace-card";
import { PromptCard } from "@/services/prompt/interface";

export default function PromptHoverCard(
  marketplaceCardProps: PromptCard & { tagId?: string }
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
      <HoverCardContent sideOffset={-150} className="w-80">
        <PromptMarketplaceCard {...marketplaceCardProps} variant="hover" />
      </HoverCardContent>
    </HoverCard>
  );
}
