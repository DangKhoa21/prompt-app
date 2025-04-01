import { Suspense } from "react";

// import { LoadingSpinner } from "@/components/icons";

import TagsList from "@/components/tags-list";
import {
  TemplatesHeader,
  TemplatesSearch,
  TemplateGridWrapper,
} from "@/features/template";

export default async function Page(props: {
  searchParams?: Promise<{
    tagId?: string;
    search?: string;
    tab?: string;
    sort?: "newest" | "oldest" | "most-starred";
  }>;
}) {
  const searchParams = await props.searchParams;
  const tagId = searchParams?.tagId || "";
  const search = searchParams?.search || "";
  const sort = searchParams?.sort || "newest";
  const filter = { tagId, search, sort };

  const tab = searchParams?.tab || "";

  return (
    <>
      <TemplatesHeader />

      <div className="max-w-6xl mx-auto">
        <TemplatesSearch />

        <Suspense fallback={<div>Hello from the other side</div>}>
          <TagsList />
        </Suspense>

        <Suspense fallback={<div>Hello from the inner side</div>}>
          <TemplateGridWrapper filter={filter} tab={tab} />
        </Suspense>
      </div>
    </>
  );
}
