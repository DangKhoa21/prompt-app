import PromptCarousels from "@/components/details/prompt-detail-comps/prompt-carousels";
import PromptDetail from "@/components/details/prompt-detail";
import UserDetail from "@/components/details/user-detail";
import { getPromptServer } from "@/services/prompt/action";

interface DetailsWrapperProps {
  promptId: string;
}

export default async function DetailsWrapper({
  promptId,
}: DetailsWrapperProps) {
  const promptData = await getPromptServer(promptId);

  return (
    <>
      <div className="flex flex-col gap-12 p-1 md:p-4">
        <div className="flex gap-2 flex-col lg:flex-row">
          <PromptDetail
            promptData={promptData}
            className="lg:basis-3/5 xl:basis-2/3"
          ></PromptDetail>
          <UserDetail
            userId={promptData.creatorId}
            className="mt-4 md:mt-0 lg:basis-2/5 xl:basis-1/3"
          ></UserDetail>
        </div>
      </div>
      <div className="flex flex-col px-auto gap-4">
        <h2 className="text-2xl font-semibold tracking-wide mt-6 mb-2 ml-2 md:ml-16">
          Related prompts
        </h2>
        <PromptCarousels promptId={promptId}></PromptCarousels>
      </div>
    </>
  );
}
