import { MarketplacePromptCard } from "@/components/marketplace/market-prompt-card";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@workspace/ui/components/hover-card";
import { PromptCard, PromptFilter } from "@/services/prompt/interface";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

interface MarketplaceHoverCardProps extends PromptCard {
  filter?: PromptFilter;
  setIsHovered: Dispatch<SetStateAction<boolean>>;
}

export default function MarketplaceHoverCard(
  marketplaceCardProps: MarketplaceHoverCardProps
) {
  const [showHoverCard, setShowHoverCard] = useState(false);
  const [showPreviewPrompt, setShowPreviewPrompt] = useState(false);

  useEffect(() => {
    setShowPreviewPrompt(localStorage.getItem("showPreviewPrompt") === "true");
  }, []);

  return (
    <HoverCard
      open={showHoverCard && showPreviewPrompt}
      onOpenChange={(open) => {
        if (open && showPreviewPrompt) {
          marketplaceCardProps.setIsHovered(true);
          setShowHoverCard(true);
        } else {
          marketplaceCardProps.setIsHovered(false);
          setShowHoverCard(false);
        }
      }}
      openDelay={1000}
    >
      <HoverCardTrigger asChild>
        {/* Display card */}
        <div>
          <MarketplacePromptCard {...marketplaceCardProps} />
        </div>
      </HoverCardTrigger>
      {/* Hover card */}
      <HoverCardContent sideOffset={-208} className="w-80 md:w-96 bg-card">
        <MarketplacePromptCard {...marketplaceCardProps} variant="hover" />
      </HoverCardContent>
    </HoverCard>
  );
}
