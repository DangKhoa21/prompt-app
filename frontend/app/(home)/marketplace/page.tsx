import { Suspense } from "react";

import { LoadingSpinner } from "@/components/icons";

import { MarketHeader } from "@/components/marketplace/market-header";
import { MarketSearch } from "@/components/marketplace/market-search";
import PromptsList from "@/components/marketplace/prompts-list";
import TagsList from "@/components/marketplace/tags-list";
import { getPromptsServer } from "@/services/prompt/action";

export default async function Page(props: {
  searchParams?: {
    tagId?: string;
    search?: string;
    sort?: "newest" | "oldest" | "most-starred";
  };
}) {
  const searchParams = props.searchParams;
  const tagId = searchParams?.tagId || "";
  const search = searchParams?.search || "";
  const sort = searchParams?.sort || "newest";
  const filter = { tagId, search, sort };

  const initialPrompt = await getPromptsServer({
    pageParam: "",
    filter: filter,
  });

  return (
    <div className="flex-1 bg-background">
      <MarketHeader />

      <div className="max-w-6xl mx-auto">
        <MarketSearch />

        <Suspense fallback={<LoadingSpinner />}>
          <TagsList />
        </Suspense>

        <PromptsList initialPrompt={initialPrompt} filter={filter} />
      </div>
    </div>
  );
}
