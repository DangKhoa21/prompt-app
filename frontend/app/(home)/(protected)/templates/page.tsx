import React, { Suspense } from "react";

import { LoadingSpinner } from "@/components/icons";
import { TemplatesHeader } from "@/components/templates/templ-header";
import { TemplateGridWrapper } from "@/features/template";
import { TemplatesSearch } from "@/components/templates/templ-search";
import TagsList from "@/components/marketplace/tags-list";

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
    <main className="flex-1 bg-background">
      <TemplatesHeader />

      <div className="max-w-6xl mx-auto">
        <TemplatesSearch />

        <Suspense fallback={<LoadingSpinner />}>
          <TagsList />
        </Suspense>

        <Suspense fallback={<LoadingSpinner />}>
          <TemplateGridWrapper filter={filter} />
        </Suspense>
      </div>
    </main>
  );
}
