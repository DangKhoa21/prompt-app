"use client";

import React from "react";

import { motion } from "framer-motion";
import { LoadingSpinner } from "@/components/icons";

import { getUserProfile } from "@/services/user";
import { getPrompts } from "@/services/prompt";
import { PromptFilter } from "@/services/prompt/interface";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import PromptTemplateCard from "@/components/prompt/prompt-templates-card";

export function TemplateGridWrapper({ filter }: { filter: PromptFilter }) {
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
    queryKey: ["prompts", updatedFilter],
    queryFn: ({ pageParam }) =>
      getPrompts({ pageParam, filter: updatedFilter }),
    initialPageParam: "",
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  React.useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, inView]);

  if (status === "pending") {
    return (
      <div className="flex justify-center items-center">
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
      <div className="px-0 py-8 md:px-4 bg-background-primary grid gap-6 justify-evenly justify-items-center grid-cols-[repeat(auto-fit,_280px)] ">
        {templatesData.map((template, index) => (
          <PromptTemplateCard key={index} {...template} />
        ))}
      </div>

      {templatesData.length === 0 && (
        <div className="flex justify-center items-center">
          You haven&apos;t created any prompt yet, please create new one
        </div>
      )}

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
