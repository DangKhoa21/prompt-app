"use client";

import { LoadingSpinner } from "@/components/icons";
import { MarketplacePromptCard } from "@/components/marketplace/market-prompt-card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { getPrompts } from "@/services/prompt";
import { TemplateTag } from "@/services/prompt/interface";
import { useInfiniteQuery } from "@tanstack/react-query";
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

  const { open } = useSidebar();

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

  // TODO: Modify the width to match responsive design (check the prompt detail first)
  return (
    <motion.div
      key="promptcarousel"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ delay: 0.3 }}
      className="w-fit my-4"
    >
      <div className="w-fit flex flex-col gap-4">
        <div className="ml-4 text-xl font-semibold">{name} prompts</div>
        <Carousel
          className={cn(
            "w-full mx-auto max-w-[360px]",
            open
              ? "md:max-w-[30rem] lg:max-w-[45rem] xl:max-w-[60rem] 2xl:max-w-[75rem]"
              : "md:max-w-[40rem] lg:max-w-[55rem] xl:max-w-[70rem] 2xl:max-w-[85rem]",
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
                  filter={{ tagId: id }}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </motion.div>
  );
}
