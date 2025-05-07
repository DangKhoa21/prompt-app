"use client";

import Container from "@/components/container";
import PromptDetail from "@/components/details/prompt-detail";
import PromptCarousels from "@/components/details/prompt-detail-comps/prompt-carousels";
import PromptOverview from "@/components/details/prompt-detail-comps/prompt-overview";
import UserOverviewCard from "@/components/details/user-detail-comps/user-overview-card";
import { Button } from "@/components/ui/button";
import { getIdFromDetailURL } from "@/lib/utils";
import { getPrompt, getTagsForTemplate } from "@/services/prompt";
import { getUser } from "@/services/user";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

const fallbackUser = {
  id: "",
  avatarUrl: null,
  bio: null,
  username: "unknown",
  email: "",
  createdAt: new Date(),
  updatedAt: new Date(),
};

export default function Page({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const promptId = getIdFromDetailURL(slug);

  const {
    data: promptData,
    isLoading: isPromptLoading,
    isError: isPromptError,
    error: promptError,
    refetch: promptRefetch,
  } = useQuery({
    queryKey: ["prompt", promptId],
    queryFn: () => getPrompt(promptId),
    // placeholderData: {
    //   id: "",
    //   title: "",
    //   description: "",
    //   stringTemplate: "",
    //   systemInstruction: null,
    //   exampleResult: null,
    //   usageCount: 0,
    //   creatorId: "",
    //   createdAt: new Date(),
    //   updatedAt: new Date(),
    // },
  });

  const {
    data: fetchedUserData,
    // isLoading,
    // isError,
    // error,
    // refetch,
  } = useQuery({
    queryKey: ["user", promptData?.creatorId],
    queryFn: () => getUser(promptData!.creatorId),
    enabled: !!promptData?.creatorId,
  });

  const {
    data: fetchedTagsData,
    // isLoading,
    // isError,
    // error,
    // refetch,
  } = useQuery({
    queryKey: ["tags", promptData?.id],
    queryFn: () => getTagsForTemplate(promptData!.id),
    enabled: !!promptData?.id,
  });

  if (isPromptLoading) {
    return <div>Loading ...</div>;
  }

  if (isPromptError) {
    toast.error(promptError.message);
    return (
      <div>
        <Button onClick={() => promptRefetch()}>Refetching</Button>
      </div>
    );
  }

  if (!promptData) {
    return <div>Prompt does not exist, please try another prompt</div>;
  }

  const userData = fetchedUserData ?? fallbackUser;
  const tagsData = fetchedTagsData ?? [];

  return (
    <>
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <PromptDetail
            promptData={promptData}
            userData={userData}
            tagsData={tagsData}
            className="lg:col-span-2 space-y-6"
          />
          <div className="space-y-6">
            <PromptOverview promptData={promptData} />
            <UserOverviewCard userData={userData} />
          </div>
        </div>
        <div className="flex flex-col px-auto py-6 gap-4 bg-background rounded-md">
          <PromptCarousels
            promptId={promptId}
            creatorId={promptData.creatorId}
            tagsData={tagsData}
          />
        </div>
      </Container>
    </>
  );
}
