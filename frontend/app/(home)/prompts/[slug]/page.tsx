import PromptDetail from "@/components/details/prompt-detail";
import PromptCarousels from "@/components/details/prompt-detail-comps/prompt-carousels";
import PromptOverview from "@/components/details/prompt-detail-comps/prompt-overview";
import UserOverviewCard from "@/components/details/user-detail-comps/user-overview-card";
import { getIdFromDetailURL } from "@/lib/utils";
import {
  getPromptServer,
  getTagsForTemplateServer,
} from "@/services/prompt/action";
import { getUserServer } from "@/services/user/action";

export default async function Page({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const promptId = getIdFromDetailURL(slug);

  const [promptData, tagsData] = await Promise.all([
    getPromptServer(promptId),
    getTagsForTemplateServer(promptId),
  ]);
  const userData = await getUserServer(promptData.creatorId);

  return (
    <>
      <div className="min-h-screen">
        <div className="p-2 md:p-8 bg-muted">
          <div className="max-w-screen-xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <PromptDetail
                promptData={promptData}
                userData={userData}
                tagsData={tagsData}
                className="lg:col-span-2 space-y-6"
              />
              <div className="space-y-6">
                <PromptOverview promptData={promptData} />
                <UserOverviewCard userData={userData} />
              </div>
            </div>
            <div className="flex flex-col px-auto gap-4">
              <PromptCarousels
                promptId={promptId}
                creatorId={promptData.creatorId}
                tagsData={tagsData}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
