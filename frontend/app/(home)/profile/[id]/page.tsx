import { DetailsHeader } from "@/components/details/details-header";
import UserDetail from "@/components/details/user-detail";
import { LoadingSpinner } from "@/components/icons";
import { MarketSearch } from "@/components/marketplace/market-search";
import PromptsList from "@/components/marketplace/prompts-list";
import TagsList from "@/components/tags-list";
import { getPromptsServer } from "@/services/prompt/action";
import { getUserServer } from "@/services/user/action";
import { Suspense } from "react";

interface ProfilePageProps {
  params: { id: string };
  searchParams?: {
    tagId?: string;
    search?: string;
    sort?: "newest" | "oldest" | "most-starred";
  };
}

export default async function Page({ params, searchParams }: ProfilePageProps) {
  const { id } = params;

  const { tagId, search, sort } = searchParams || {
    tagId: "",
    serach: "",
    sort: "newest",
  };
  const creatorId = id;
  const filter = { tagId, search, creatorId, sort };

  const initialPrompt = await getPromptsServer({
    pageParam: "",
    filter: filter,
  });

  const userData = await getUserServer(id);

  return (
    <>
      <DetailsHeader pageName={"Profile detail"}></DetailsHeader>
      <UserDetail userData={userData} className="mt-2 mx-8"></UserDetail>

      <div className="max-w-6xl mx-auto">
        <MarketSearch />

        <Suspense fallback={<LoadingSpinner />}>
          <TagsList />
        </Suspense>

        <PromptsList initialPrompt={initialPrompt} filter={filter} />
      </div>
    </>
  );
}
