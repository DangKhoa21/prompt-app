import Container from "@/components/container";
import { LoadingSpinner } from "@/components/icons";
import TagsList from "@/components/marketplace/tags-list";
import {
  TemplateGridWrapper,
  TemplatesHeader,
  TemplatesSearch,
} from "@/features/template";
import { Suspense } from "react";

export default async function TemplatesPage(props: {
  searchParams?: Promise<{
    tagId?: string;
    search?: string;
    tab?: string;
    sort?: "newest" | "oldest" | "most-starred" | "trending";
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
      <Container>
        <TemplatesSearch filter={filter} />

        <Suspense fallback={<LoadingSpinner />}>
          <TagsList />
        </Suspense>

        <Suspense fallback={<LoadingSpinner />}>
          <TemplateGridWrapper filter={filter} tab={tab} />
        </Suspense>
      </Container>
    </>
  );
}
