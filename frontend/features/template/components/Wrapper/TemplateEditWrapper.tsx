"use client";

import { getPromptTemplate, getTagsForTemplate } from "@/services/prompt";
import { useQuery } from "@tanstack/react-query";
import { TemplateEditSection } from "@/features/template";
import { LoadingSpinner } from "@/components/icons";

export function TemplateEditWrapper({ id }: { id: string }) {
  const {
    isPending: isPromptTemplateLoading,
    isError: isPromptTemplateError,
    data: promptTemplateData,
    error: promptTemplateError,
  } = useQuery({
    queryKey: ["templates", id],
    queryFn: () => getPromptTemplate(id),
  });

  const {
    isPending: isTagsLoading,
    isError: isTagsError,
    data: tagsData,
    error: tagsError,
  } = useQuery({
    queryKey: ["tags", id],
    queryFn: () => getTagsForTemplate(id),
  });

  if (isPromptTemplateLoading || isTagsLoading) {
    return (
      <>
        <div className="flex justify-center items-center">
          <LoadingSpinner />
        </div>
      </>
    );
  }

  if (isPromptTemplateError || isTagsError) {
    if (isPromptTemplateError) {
      console.error("Error loading prompt template: ", promptTemplateError);
    } else {
      console.error("Error loading tags: ", tagsError);
    }
    return (
      <>
        <div className="flex justify-center items-center">
          Error in loading prompt templates or it tags. Please try again!.
        </div>
      </>
    );
  }

  if (!promptTemplateData) {
    return (
      <>
        <div className="flex justify-center items-center">
          Prompt template not found.
        </div>
      </>
    );
  }

  if (!tagsData) {
    return (
      <>
        <div className="flex justify-center items-center">Tags not found.</div>
      </>
    );
  }

  promptTemplateData.tags = tagsData;

  return (
    <>
      <TemplateEditSection initialPrompt={promptTemplateData} />
    </>
  );
}
