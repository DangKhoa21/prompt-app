"use client";

import React from "react";

import { LoadingSpinner } from "@/components/icons";

import { getPrompts } from "@/services/prompt";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import PromptHoverCard from "@/components/prompt/prompt-hover-card";

export default function PromptsList({ tagId }: { tagId: string }) {
  const { ref, inView } = useInView();
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["prompts", tagId],
    queryFn: ({ pageParam }) => getPrompts({ limit: 3, pageParam, tagId }),
    initialPageParam: "",
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  React.useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, inView]);

  if (status === "pending") {
    return null;
  }

  if (status === "error") {
    return <span>Error: {error.message}</span>;
  }

  return (
    <>
      <div className="px-0 py-8 md:px-4 bg-background-primary grid gap-6 justify-evenly justify-items-center grid-cols-[repeat(auto-fit,_280px)]">
        {data.pages.map((group, i) => (
          <React.Fragment key={i}>
            {group.data.map((prompt) => (
              <PromptHoverCard key={prompt.id} {...prompt} tagId={tagId} />
            ))}
          </React.Fragment>
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
    </>
  );
}
