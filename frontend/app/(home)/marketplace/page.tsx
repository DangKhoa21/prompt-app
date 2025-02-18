import React, { Suspense } from "react";

import { Input } from "@/components/ui/input";
import { LoadingSpinner } from "@/components/icons";
import { Search } from "lucide-react";

import TagsList from "@/components/marketplace/tagslist";
import PromptsList from "@/components/marketplace/promptslist";

export default async function Page(props: {
  searchParams?: Promise<{
    tagId?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const tagId = searchParams?.tagId || "";

  return (
    <div className="flex-1 overflow-auto bg-background">
      <div className="max-w-6xl mx-auto mt-12">
        <div className="text-center mb-4">
          <h1 className="text-3xl font-bold mb-2">Marketplace</h1>
          <div className="w-2/3 mx-auto">
            <p className="text-muted-foreground mb-4">
              Discover and create custom versions prompts that combine
              instructions, extra knowledge, and any combination of skills.
            </p>
          </div>
          <div className="inline-flex relative mb-2 w-3/5 max-w-screen-lg justify-center">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search" className="pl-9" />
          </div>
        </div>

        <Suspense fallback={<LoadingSpinner />}>
          <TagsList />
        </Suspense>

        <Suspense fallback={<LoadingSpinner />}>
          <PromptsList tagId={tagId} />
        </Suspense>
      </div>
    </div>
  );
}
