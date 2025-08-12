import Container from "@/components/container";
import { LoadingSpinner } from "@/components/icons";
import { MarketSearch } from "@/components/marketplace/market-search";
import PromptsList from "@/components/marketplace/prompts-list";
import TagsList from "@/components/marketplace/tags-list";
import { getPrompts } from "@/services/prompt";
import { PromptCard } from "@/services/prompt/interface";
import { Paginated } from "@/services/shared";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { Suspense } from "react";

export default async function MarketplacePage(props: {
  searchParams?: {
    tagId?: string;
    search?: string;
    sort?: "newest" | "oldest" | "most-starred" | "trending";
  };
}) {
  const searchParams = props.searchParams;
  const tagId = searchParams?.tagId || "";
  const search = searchParams?.search || "";
  const sort = searchParams?.sort || "newest";
  const filter = { tagId, search, sort };

  const queryClient = new QueryClient();
  await queryClient.prefetchInfiniteQuery({
    queryKey: ["prompts", filter],
    queryFn: ({ pageParam }) => getPrompts({ pageParam, filter }),
    initialPageParam: "",
    getNextPageParam: (lastPage: Paginated<PromptCard>) => lastPage.nextCursor,
    staleTime: 1000 * 60 * 5,
  });

  return (
    <Container>
      <MarketSearch />

      <Suspense fallback={<LoadingSpinner />}>
        <TagsList />
      </Suspense>

      <HydrationBoundary state={dehydrate(queryClient)}>
        <PromptsList filter={filter} />
      </HydrationBoundary>
    </Container>
  );
}
