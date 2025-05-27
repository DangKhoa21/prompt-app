import { Suspense } from "react";
import { LoadingSpinner } from "@/components/icons";
import { MarketSearch } from "@/components/marketplace/market-search";
import PromptsList from "@/components/marketplace/prompts-list";
import TagsList from "@/components/marketplace/tags-list";
import Container from "@/components/container";

export default async function MarketplacePage(props: {
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

  return (
    <Container>
      <MarketSearch />

      <Suspense fallback={<LoadingSpinner />}>
        <TagsList />
      </Suspense>

      <PromptsList filter={filter} />
    </Container>
  );
}
