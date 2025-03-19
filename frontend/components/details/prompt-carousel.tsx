"use client";

import { getPrompts } from "@/services/prompt";
import { useInfiniteQuery } from "@tanstack/react-query";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { PromptMarketplaceCard } from "@/components/prompt/prompt-marketplace-card";
import { LoadingSpinner } from "@/components/icons";
import { TemplateTag } from "@/services/prompt/interface";
import { motion } from "framer-motion";

export default function PromptCarousel({
  id,
  name,
  promptId,
}: TemplateTag & { promptId: string }) {
  const { data, error, status } = useInfiniteQuery({
    queryKey: ["prompts", { tagId: id }],
    queryFn: ({ pageParam }) =>
      getPrompts({ pageParam, filter: { tagId: id } }),
    initialPageParam: "",
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  if (status === "pending") {
    return (
      <div className="flex justify-center items-center mt-4">
        <LoadingSpinner />
      </div>
    );
  }

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
    >
      <div className="py-2">
        <div className="ml-4 text-lg font-medium">{name} prompts</div>
        <Carousel opts={{ align: "start", loop: true }}>
          <CarouselContent className="">
            {carouselData.map((prompt) => (
              <CarouselItem
                key={prompt.id}
                className="md:basis-1/2 lg:basis-1/3 px-0 py-4 md:px-4"
              >
                <PromptMarketplaceCard {...prompt} filter={{ tagId: id }} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </motion.div>
  );
}
