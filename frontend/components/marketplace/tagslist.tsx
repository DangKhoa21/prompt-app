"use client";

import React from "react";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { getTags } from "@/services/prompt";
import { useQuery } from "@tanstack/react-query";

export default function TagsList() {
  const searchParams = useSearchParams();
  const tagId = searchParams.get("tagId");
  const router = useRouter();

  const {
    isPending: isTagsLoading,
    isError: isTagsError,
    data: tagsData,
    error: tagsError,
  } = useQuery({
    queryKey: ["tags"],
    queryFn: () => getTags(),
  });

  const updateTagId = React.useCallback(
    (tagId: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (tagId.length) params.set("tagId", tagId);
      else params.delete("tagId");
      router.push(`?${params.toString()}`);
    },
    [router, searchParams]
  );

  if (isTagsLoading) {
    return null;
  }

  if (isTagsError) {
    return <span>Error: {tagsError.message}</span>;
  }

  return (
    <motion.div
      key="taglist"
      initial={{ opacity: 0, scale: 0.98, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ delay: 0.4 }}
    >
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
    </motion.div>
  );
}
