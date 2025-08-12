"use client";

import { MarketplacePromptCard } from "@/components/marketplace/market-prompt-card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
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
  });

  const { open } = useSidebar();

  if (status === "error") {
    return <span>Error: {error.message}</span>;
  }

  const carouselData = data.pages[0].data.filter((p) => p.id !== promptId);

  return (
    <motion.div
      key="promptcarousel"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ delay: 0.3 }}
      className="w-full my-4"
    >
      <div className="w-full flex flex-col gap-4">
        <div className="ml-4 text-xl font-semibold">{label}</div>
        <Carousel
          className={cn(
            "w-full max-w-[359px]",
            open
              ? "md:max-w-[28rem] lg:max-w-[42rem] xl:max-w-[60rem] 2xl:max-w-[75rem]"
              : "md:max-w-[41rem] lg:max-w-[55rem] xl:max-w-[73rem] 2xl:max-w-[80rem]",
          )}
          opts={{
            align: "start",
            dragFree: true,
            dragThreshold: 3,
          }}
        >
          <div className="absolute right-0 -top-14 flex space-x-2 z-10">
            <CarouselPrevious
              variant="outline"
              className="static h-8 w-8 translate-x-0 translate-y-0"
            />
            <CarouselNext
              variant="outline"
              className="static h-8 w-8 translate-x-0 translate-y-0"
            />
          </div>

          <CarouselContent className="w-full p-2">
            {carouselData.map((prompt) => (
              <CarouselItem
                key={prompt.id}
                className="basis:auto px-2 py-4 md:px-4"
              >
                <MarketplacePromptCard
                  {...prompt}
                  variant="default"
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
