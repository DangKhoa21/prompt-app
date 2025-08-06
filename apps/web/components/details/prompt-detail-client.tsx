"use client";

import { getPromptStats, getTagsForTemplate } from "@/services/prompt";
import { getUser } from "@/services/user";
import { useQuery } from "@tanstack/react-query";
import PromptDetail from "@/components/details/prompt-detail";
import PromptCarousels from "@/components/details/prompt-detail-comps/prompt-carousels";
import PromptOverview from "@/components/details/prompt-detail-comps/prompt-overview";
import UserOverviewCard from "@/components/details/user-detail-comps/user-overview-card";
import Container from "@/components/container";
import { Button } from "@workspace/ui/components/button";
import { BetterTooltip } from "@workspace/ui/components/tooltip";
import { usePromptData } from "@/hooks/use-prompt-data";

const fallbackUser = {
  id: "",
  avatarUrl: null,
  bio: null,
  username: "unknown",
  email: "",
  createdAt: new Date(),
  updatedAt: new Date(),
};

export default function PromptDetailClient({ promptId }: { promptId: string }) {
  const {
    data: fetchedPromptData,
    isLoading: isPromptLoading,
    isError: isPromptError,
    // error: promptError,
    refetch: promptRefetch,
  } = usePromptData(promptId);

  const { data: fetchedUserData } = useQuery({
    queryKey: ["user", fetchedPromptData?.creatorId],
    queryFn: () => getUser(fetchedPromptData!.creatorId),
    enabled: !!fetchedPromptData?.creatorId,
  });

  const { data: fetchedTagsData } = useQuery({
    queryKey: ["tags", fetchedPromptData?.id],
    queryFn: () => getTagsForTemplate(fetchedPromptData!.id),
    enabled: !!fetchedPromptData?.id,
  });

  const { data: fetchedPromptStatsData } = useQuery({
    queryKey: ["prompt", "stats", fetchedPromptData?.id],
    queryFn: () => getPromptStats(fetchedPromptData!.id),
    enabled: !!fetchedPromptData?.id,
  });

  if (isPromptLoading) return <div>Loading ...</div>;

  if (isPromptError)
    return (
      <div className="flex h-full items-center justify-center gap-4">
        <p>An error has occurred, please try again!</p>
        <BetterTooltip content="Refetching prompt">
          <Button onClick={() => promptRefetch()}>Reload</Button>
        </BetterTooltip>
      </div>
    );

  if (!fetchedPromptData)
    return (
      <div className="flex h-full items-center justify-center">
        Prompt does not exist, please try another prompt.
      </div>
    );

  const userData = fetchedUserData ?? fallbackUser;
  const tagsData = fetchedTagsData ?? [];
  const promptData = {
    ...fetchedPromptData,
    ...(fetchedPromptStatsData ?? {
      hasStarred: false,
      starCount: 0,
      commentCount: 0,
    }),
  };

  return (
    <Container>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <PromptDetail
          promptData={promptData}
          userData={userData}
          tagsData={tagsData}
          className="lg:col-span-2 space-y-6"
        />
        <div className="space-y-6 h-fit md:sticky md:top-20">
          <PromptOverview promptData={promptData} />
          <UserOverviewCard userData={userData} />
        </div>
      </div>
      <div className="flex flex-col px-auto py-6 gap-4 bg-background rounded-md border">
        <PromptCarousels
          promptId={promptId}
          creatorId={fetchedPromptData.creatorId}
          tagsData={tagsData}
        />
      </div>
    </Container>
  );
}
