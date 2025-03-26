"use client";

import { getTagsForTemplate } from "@/services/prompt";
import { useQuery } from "@tanstack/react-query";
import { LoadingSpinner } from "@/components/icons";
import PromptCarousel from "./prompt-carousel";

export default function PromptCarousels({ promptId }: { promptId: string }) {
  const { data, isPending, isError, error } = useQuery({
    queryKey: ["prompts", promptId, "tags"],
    queryFn: () => getTagsForTemplate(promptId),
  });

  if (isPending) {
    return (
      <div className="flex justify-center items-center mt-4">
        <LoadingSpinner />
      </div>
    );
  }

  if (isError) {
    return <span>Error: {error.message}</span>;
  }

  const relatedTags = data.slice(0, 3); // takes 3 related tags

  return (
    <div className="w-fit mx-auto">
      {relatedTags.map((tag) => (
        <PromptCarousel promptId={promptId} key={tag.id} {...tag} />
      ))}
    </div>
  );
}
