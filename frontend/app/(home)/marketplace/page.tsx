import React, { Suspense } from "react";

import { LoadingSpinner } from "@/components/icons";

import TagsList from "@/components/marketplace/tagslist";
import PromptsList from "@/components/marketplace/promptslist";
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

  return (
    <div className="flex-1 overflow-auto bg-background">
      <MarketHeader />

      <div className="max-w-6xl mx-auto">
        <MarketSearch />

        <Suspense fallback={<LoadingSpinner />}>
          <TagsList />
        </Suspense>

        <Suspense fallback={<LoadingSpinner />}>
          <PromptsList tagId={tagId} search={search} />
        </Suspense>
      </div>
    </div>
  );
}
