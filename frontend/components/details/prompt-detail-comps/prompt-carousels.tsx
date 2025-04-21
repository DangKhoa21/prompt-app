"use client";

import PromptCarousel from "@/components/details/prompt-detail-comps/prompt-carousel";
import { LoadingSpinner } from "@/components/icons";
import { getPrompts } from "@/services/prompt";
import { TemplateTag } from "@/services/prompt/interface";
import { useQuery } from "@tanstack/react-query";

interface PromptCarouselsProps {
  promptId: string;
  creatorId: string;
  tagsData: TemplateTag[];
}

export default function PromptCarousels({
  promptId,
  creatorId,
  tagsData,
}: PromptCarouselsProps) {
  // Take 3 related tags
  const relatedTags = tagsData.slice(0, 3);

  const { data, isLoading, error } = useQuery({
    queryKey: ["relatedPrompts", promptId],
    queryFn: async () => {
      const results = await Promise.all([
        ...relatedTags.map((tag) =>
          getPrompts({
            pageParam: "",
            filter: { tagId: tag.id },
          })
        ),
        getPrompts({
          pageParam: "",
          filter: { creatorId: creatorId },
        }),
      ]);
      return {
        relatedPrompts: results.slice(0, relatedTags.length),
        creatorPrompts: results[relatedTags.length],
      };
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center">
        <p className="text-red-500">Failed to load related prompts.</p>
      </div>
    );
  }

  if (!data) {
    return <div></div>;
  }

  return (
    <div className="w-max mx-auto">
      <h2 className="text-2xl font-semibold tracking-wide mt-6 mb-2 ml-4">
        Related prompts
      </h2>

      {data.relatedPrompts.map((promptsData, index) => (
        <PromptCarousel
          key={relatedTags[index].id}
          label={`${relatedTags[index].name}`}
          promptId={promptId}
          carouselPrompts={promptsData}
          filter={{ tagId: relatedTags[index].id }}
        />
      ))}

      <PromptCarousel
        key="creator-prompts"
        label="More from this creator"
        promptId={promptId}
        carouselPrompts={data.creatorPrompts}
        filter={{ creatorId }}
      />
    </div>
  );
}
