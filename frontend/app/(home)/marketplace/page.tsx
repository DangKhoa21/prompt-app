"use client";

import React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LoadingSpinner } from "@/components/icons";
import { Search } from "lucide-react";

import { getPrompts, getTags } from "@/services/prompt";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import PromptHoverCard from "@/components/prompt/prompt-hover-card";
import { useSearchParams } from "next/navigation";

export default function Page() {
  const searchParams = useSearchParams();
  const tagId = searchParams.get("tagId");
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
    queryFn: ({ pageParam }) => getPrompts({ pageParam, tagId }),
    initialPageParam: "",
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  React.useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, inView]);

  const updateTagId = React.useCallback(
    (tagId: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (tagId.length) params.set("tagId", tagId);
      else params.delete("tagId");
      window.history.pushState(null, "", `?${params.toString()}`);
    },
    [searchParams]
  );

  const {
    isPending: isTagsLoading,
    isError: isTagsError,
    data: tagsData,
    error: tagsError,
  } = useQuery({
    queryKey: ["tags"],
    queryFn: () => getTags(),
  });

  if (status === "pending") {
    return null;
  }

  if (status === "error") {
    return <span>Error: {error.message}</span>;
  }

  if (isTagsLoading) {
    return null;
  }

  if (isTagsError) {
    return <span>Error: {tagsError.message}</span>;
  }

  return (
    <div className="flex-1 overflow-auto bg-background">
      <div className="max-w-6xl mx-auto mt-12">
        <div className="text-center mb-4">
          <h1 className="text-3xl font-bold mb-2">Marketplace</h1>
          <div className="w-2/3 mx-auto">
            <p className="text-muted-foreground mb-4">
              Discover and create custom versions prompts that combine
              instructions, extra knowledge, and any combination of skills.
            </p>
          </div>
          <div className="inline-flex relative mb-2 w-3/5 max-w-screen-lg justify-center">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search" className="pl-9" />
          </div>
        </div>

        <div className="flex flex-wrap gap-3 mb-8 justify-center">
          {tagsData.map((tag) => (
            <Button
              key={tag.id}
              variant={tag.id === tagId ? "secondary" : "outline"}
              size="sm"
              className="rounded-2xl gap-1 px-4"
              onClick={() =>
                tag.id === tagId ? updateTagId("") : updateTagId(tag.id)
              }
            >
              {tag.name}
            </Button>
          ))}
        </div>

        <div className="px-0 py-8 md:px-4 bg-background-primary grid gap-6 justify-evenly justify-items-center grid-cols-[repeat(auto-fit,_280px)]">
          {data.pages.map((group, i) => (
            <React.Fragment key={i}>
              {group.data.map((prompt) => (
                <PromptHoverCard key={prompt.id} {...prompt} />
              ))}
            </React.Fragment>
          ))}
        </div>

        <div className="flex justify-center">
          {isFetchingNextPage ? <LoadingSpinner /> : null}
        </div>

        <div ref={ref} className="mt-5" />
      </div>
    </div>
  );
}
