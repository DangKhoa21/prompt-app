"use client";

import { Button } from "@/components/ui/button";
import { TemplateEditSection } from "@/features/template";
import {
  getPromptTemplate,
  getTags,
  getTagsForTemplate,
} from "@/services/prompt";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

export function TemplateEditWrapper({ id }: { id: string }) {
  const {
    data: promptTemplateData,
    isLoading: isTemplateLoading,
    isError: isTemplateError,
    error: templateError,
    refetch: templateRefetch,
  } = useQuery({
    queryKey: ["template", id],
    queryFn: () => getPromptTemplate(id),
  });

  const { data: tagsData } = useQuery({
    queryKey: ["tags", id],
    queryFn: () => getTagsForTemplate(id),
    placeholderData: [],
  });
  const { data: allTags } = useQuery({
    queryKey: ["tags"],
    queryFn: () => getTags(),
    placeholderData: [],
  });

  if (isTemplateLoading) {
    return <div>Loading ...</div>;
  }

  if (isTemplateError) {
    toast.error(templateError.message);
    return (
      <div>
        <Button onClick={() => templateRefetch()}>Refetching</Button>
      </div>
    );
  }

  if (!promptTemplateData) {
    return <div>This template does not exist, please try again</div>;
  }

  promptTemplateData.tags = tagsData ?? [];

  return (
    <TemplateEditSection
      initialPrompt={promptTemplateData}
      allTags={allTags ?? []}
    />
  );
}
