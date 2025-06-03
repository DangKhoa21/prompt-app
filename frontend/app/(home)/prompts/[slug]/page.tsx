import PromptDetailClient from "@/components/details/prompt-detail-client";
import { getIdFromDetailURL } from "@/lib/utils";
import {
  getPrompt,
  getPromptStats,
  getTagsForTemplate,
} from "@/services/prompt";
import { Prompt } from "@/services/prompt/interface";
import { getUser } from "@/services/user";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";

export default async function PromptDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const promptId = getIdFromDetailURL(params.slug);
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["prompt", promptId],
    queryFn: () => getPrompt(promptId),
  });

  const promptData: Prompt | undefined = await queryClient.getQueryData([
    "prompt",
    promptId,
  ]);
  const creatorId = promptData?.creatorId;
  const promptRealId = promptData?.id;

  if (creatorId) {
    await queryClient.prefetchQuery({
      queryKey: ["user", creatorId],
      queryFn: () => getUser(creatorId),
    });
  }

  if (promptRealId) {
    await queryClient.prefetchQuery({
      queryKey: ["tags", promptRealId],
      queryFn: () => getTagsForTemplate(promptRealId),
    });

    await queryClient.prefetchQuery({
      queryKey: ["prompt", "stats", promptRealId],
      queryFn: () => getPromptStats(promptRealId),
    });
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PromptDetailClient promptId={promptId} />
    </HydrationBoundary>
  );
}
