import PromptDetail from "@/components/details/prompt-detail";
import PromptCarousels from "@/components/details/prompt-detail-comps/prompt-carousels";
import UserDetail from "@/components/details/user-detail";
import {
  getPromptServer,
  getTagsForTemplateServer,
} from "@/services/prompt/action";
import { getUserServer } from "@/services/user/action";
import PromptOverview from "./prompt-detail-comps/prompt-overview";

interface DetailsWrapperProps {
  promptId: string;
}

export default async function DetailsWrapper({
  promptId,
}: DetailsWrapperProps) {
  const promptData = await getPromptServer(promptId);
  const [userData, tagsData] = await Promise.all([
    getUserServer(promptData.creatorId),
    getTagsForTemplateServer(promptData.id),
  ]);

  return (
    <>
      <div className="max-w-screen-2xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <PromptDetail
            promptData={promptData}
            userData={userData}
            tagsData={tagsData}
            className="lg:col-span-2 space-y-6"
          />
          <div className="space-y-6">
            <PromptOverview promptData={promptData} />
            <UserDetail userData={userData} className="mt-4 md:mt-0" />
          </div>
        </div>
        <div className="flex flex-col">
          <PromptCarousels
            promptId={promptId}
            creatorId={promptData.creatorId}
            tagsData={tagsData}
          />
        </div>
      </div>
    </>
  );
}
