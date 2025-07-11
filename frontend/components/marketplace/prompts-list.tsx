"use client";

import { LoadingSpinner } from "@/components/icons";
import MarketplaceHoverCard from "@/components/marketplace/market-hover-card";
import { cn } from "@/lib/utils";
import { getPrompts } from "@/services/prompt";
import { PromptFilter } from "@/services/prompt/interface";
import { useInfiniteQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Fragment, useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

export default function PromptsList({ filter }: { filter: PromptFilter }) {
  const [isHovered, setIsHovered] = useState(false);
  const { ref, inView } = useInView();
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["prompts", filter],
    queryFn: ({ pageParam }) => getPrompts({ pageParam, filter }),
    initialPageParam: "",
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, inView]);

  if (status === "error") {
    return <span>Error: {error.message}</span>;
  }

  return (
    <motion.div
      key="promptlist"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ delay: 0.3 }}
    >
      {/* backdrop when hover */}
      <div
        className={cn(
          "fixed inset-0 bg-background/80 backdrop-blur-[1px] transition-all duration-200 z-10",
          isHovered ? "opacity-100" : "opacity-0 pointer-events-none",
        )}
      />

      <div className="px-0 py-8 md:px-4 bg-background-primary grid gap-6 justify-evenly justify-items-center grid-cols-[repeat(auto-fit,_20rem)] ">
        {data &&
          data.pages.map((group, i) => (
            <Fragment key={i}>
              {group.data.map((prompt) => (
                <MarketplaceHoverCard
                  key={prompt.id}
                  {...prompt}
                  filter={filter}
                  setIsHovered={setIsHovered}
                />
              ))}
            </Fragment>
          ))}
      </div>

      {hasNextPage ? null : (
        <div className="flex justify-center">
          You have reached the end of the list!
        </div>
      )}

      <div className="flex justify-center">
        {isFetchingNextPage ? <LoadingSpinner /> : null}
      </div>

      <div ref={ref} className="mt-5" />
    </motion.div>
  );
}
