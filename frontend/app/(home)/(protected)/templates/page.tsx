import { Suspense } from "react";

import TagsList from "@/components/marketplace/tags-list";
import {
  TemplatesSearch,
  TemplateGridWrapper,
} from "@/features/template";
import { LoadingSpinner } from "@/components/icons";
import Container from "@/components/container";

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
    <Container>
        <TemplatesSearch />

        <Suspense fallback={<LoadingSpinner />}>
          <TagsList />
        </Suspense>

        <Suspense fallback={<LoadingSpinner />}>
          <TemplateGridWrapper filter={filter} tab={tab} />
        </Suspense>
    </Container>
  );
}
