"use client";

import { LoadingSpinner } from "@/components/icons";
import { PromptTemplateCard } from "@/features/template";
import { getPrompts, getStarredPrompts } from "@/services/prompt";
import { PromptFilter } from "@/services/prompt/interface";
import { getUserProfile } from "@/services/user";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";

export function TemplateGridWrapper({
  filter,
  tab,
}: {
  filter: PromptFilter;
  tab: string;
}) {
  const { ref, inView } = useInView();

  const { data: user } = useQuery({
    queryKey: ["user", "profile"],
    queryFn: getUserProfile,
  });

  const creatorId = user?.id;

  const updatedFilter = { ...filter, creatorId };

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["prompts", updatedFilter, tab],
    queryFn: ({ pageParam }) =>
      tab === "starred"
        ? getStarredPrompts({ pageParam, filter })
        : getPrompts({ pageParam, filter: updatedFilter }),
    initialPageParam: "",
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, inView]);

  if (status === "pending") {
    return (
      <div className="flex h-full justify-center items-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (status === "error") {
    console.error("Error loading prompts: " + error);
    return (
      <div className="flex justify-center items-center">
        <p>Error in loading prompt templates. Please try again!</p>
      </div>
    );
  }

  const templatesData = data.pages.flatMap((page) => page.data) || [];

  return (
    <motion.div
      key="templateslist"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ delay: 0.3 }}
    >
      <div className="px-0 py-8 md:px-4 bg-background-primary grid gap-6 justify-evenly justify-items-center grid-cols-[repeat(auto-fit,_20rem)] ">
        {templatesData.map((template, index) => (
          <PromptTemplateCard
            key={index}
            {...template}
            filter={updatedFilter}
          />
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
