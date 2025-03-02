import React, { Suspense } from "react";

import { LoadingSpinner } from "@/components/icons";

import TagsList from "@/components/marketplace/tags-list";
import PromptsList from "@/components/marketplace/prompts-list";
import { MarketHeader } from "@/components/marketplace/market-header";
import { MarketSearch } from "@/components/marketplace/market-search";

export default async function Page(props: {
  searchParams?: Promise<{
    tagId?: string;
    search?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const tagId = searchParams?.tagId || "";
  const search = searchParams?.search || "";
  const filter = { tagId, search };

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
