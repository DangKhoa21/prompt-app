import { Suspense } from "react";

import { LoadingSpinner } from "@/components/icons";

import { MarketHeader } from "@/components/marketplace/market-header";
import { MarketSearch } from "@/components/marketplace/market-search";
import PromptsList from "@/components/marketplace/prompts-list";
import TagsList from "@/components/tags-list";

export default async function Page(props: {
  searchParams?: Promise<{
    tagId?: string;
    search?: string;
    sort?: "newest" | "oldest" | "most-starred";
  }>;
}) {
  const searchParams = await props.searchParams;
  const tagId = searchParams?.tagId || "";
  const search = searchParams?.search || "";
  const sort = searchParams?.sort || "newest";
  const filter = { tagId, search, sort };

  return (
    <div className="flex-1 bg-background">
      <MarketHeader />

      <div className="max-w-6xl mx-auto">
        <MarketSearch />

        <Suspense fallback={<LoadingSpinner />}>
          <TagsList />
        </Suspense>

        <Suspense fallback={<LoadingSpinner />}>
          <PromptsList filter={filter} />
        </Suspense>
      </div>
    </div>
  );
}
