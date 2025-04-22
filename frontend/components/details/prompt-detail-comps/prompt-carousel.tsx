"use client";

import { MarketplacePromptCard } from "@/components/marketplace/market-prompt-card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { getPrompts } from "@/services/prompt";
import { PromptCard, PromptFilter } from "@/services/prompt/interface";
import { Paginated } from "@/services/shared";
import { useInfiniteQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";

interface PromptCarouselProps {
  label: string;
  promptId: string;
  carouselPrompts: Paginated<PromptCard>;
  filter: PromptFilter;
}

export default function PromptCarousel({
  label,
  promptId,
  carouselPrompts,
  filter,
}: PromptCarouselProps) {
  const { data, error, status } = useInfiniteQuery({
    queryKey: ["prompts", filter],
    queryFn: ({ pageParam }) => getPrompts({ pageParam, filter }),
    initialPageParam: "",
    initialData: carouselPrompts
      ? {
          pages: [carouselPrompts],
          pageParams: [""],
        }
      : undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    staleTime: 1000 * 60 * 5,
  });

  const { open } = useSidebar();

  if (status === "error") {
    return <span>Error: {error.message}</span>;
  }

  const carouselData = data.pages[0].data.filter((p) => p.id !== promptId);

  // TODO: Modify the width to match responsive design (check the prompt detail first)
  return (
    <motion.div
      key="promptcarousel"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ delay: 0.3 }}
      className="w-max"
    >
      <div className="w-max flex flex-col gap-4">
        <div className="text-xl font-semibold text-wrap">{label} prompts</div>
        <Carousel
          className={cn(
            "w-full max-w-[359px]",
            open
              ? "md:max-w-[28rem] lg:max-w-[44rem] xl:max-w-[60rem] 2xl:max-w-[76rem]"
              : "md:max-w-[41rem] lg:max-w-[57rem] xl:max-w-[73rem] 2xl:max-w-[89rem]",
          )}
          opts={{
            align: "start",
            dragFree: true,
            dragThreshold: 3,
          }}
        >
          <CarouselContent className="w-full">
            {carouselData.map((prompt) => (
              <CarouselItem key={prompt.id} className="basis-auto min-w-fit">
                <MarketplacePromptCard
                  {...prompt}
                  variant="carousel"
                  filter={filter}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </motion.div>
  );
}
