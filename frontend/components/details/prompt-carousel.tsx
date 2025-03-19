"use client";

import { getPrompts } from "@/services/prompt";
import { useInfiniteQuery } from "@tanstack/react-query";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";
import { PromptMarketplaceCard } from "../prompt/prompt-marketplace-card";
import { LoadingSpinner } from "../icons";
import { TemplateTag } from "@/services/prompt/interface";

export default function PromptCarousel(tag: TemplateTag) {
  const { data, error, status } = useInfiniteQuery({
    queryKey: ["prompts", { tagId: tag.id }],
    queryFn: ({ pageParam }) =>
      getPrompts({ pageParam, filter: { tagId: tag.id } }),
    initialPageParam: "",
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  if (status === "pending") {
    return (
      <div className="flex justify-center items-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (status === "error") {
    return <span>Error: {error.message}</span>;
  }

  return (
    <div className="py-2">
      <div className="ml-4 text-lg font-medium">{tag.name} prompts</div>
      <Carousel opts={{ align: "start", loop: true }}>
        <CarouselContent className="">
          {data.pages[0].data.map((prompt) => (
            <CarouselItem
              key={prompt.id}
              className="md:basis-1/2 lg:basis-1/3 px-0 py-4 md:px-4"
            >
              <PromptMarketplaceCard {...prompt} filter={{ tagId: tag.id }} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}
