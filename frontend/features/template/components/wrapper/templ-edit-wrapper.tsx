"use client";

import { Button } from "@/components/ui/button";
import { BetterTooltip } from "@/components/ui/tooltip";
import { appURL } from "@/config/url.config";
import { TemplateEditSection } from "@/features/template";
import {
    getPromptTemplate,
    getTags,
    getTagsForTemplate,
} from "@/services/prompt";
import { getUserProfile } from "@/services/user";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function TemplateEditWrapper({ id }: { id: string }) {
  const router = useRouter();

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

  const { data: user } = useQuery({
    queryKey: ["user", "profile"],
    queryFn: getUserProfile,
  });

  useEffect(() => {
    if (!user || !promptTemplateData) return;

    if (user.id !== promptTemplateData.creatorId) {
      router.push(appURL.templates);
    }
  }, [user, promptTemplateData, router]);

  if (isTemplateLoading) {
    return <div>Loading ...</div>;
  }

  if (isTemplateError) {
    console.error(`Test error ${templateError}`);
    return (
      <div className="flex flex-col h-full items-center justify-center gap-4">
        <p>An error has occured, please try again! {templateError.message}</p>
        <BetterTooltip content="Refetching prompt">
          <Button onClick={() => templateRefetch()}>Reload</Button>
        </BetterTooltip>
      </div>
    );
  }

  if (!promptTemplateData) {
    return (
      <div className="flex h-full justify-center gap-4">
        This template does not exist, please try again
      </div>
    );
  }

  promptTemplateData.tags = tagsData ?? [];

  return (
    <TemplateEditSection
      initialPrompt={promptTemplateData}
      allTags={allTags ?? []}
    />
  );
}
