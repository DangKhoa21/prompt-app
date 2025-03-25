import { cn } from "@/lib/utils";
import { Prompt } from "@/services/prompt/interface";
import { getTagsForTemplateServer } from "@/services/prompt/action";
import PromptHeadDetail from "./prompt-detail-comps/prompt-head-detail";
import PromptResults from "./prompt-detail-comps/prompt-results";

interface PromptDetailProps {
  promptData: Prompt;
  className?: string;
}

export default async function PromptDetail({
  promptData,
  className,
}: PromptDetailProps) {
  const tagsData = await getTagsForTemplateServer(promptData.id);

  return (
    <>
      <div
        className={cn("md:border-2 md:rounded-lg md:p-4 space-y-4", className)}
      >
        <PromptHeadDetail
          promptData={promptData}
          tagsData={tagsData}
        ></PromptHeadDetail>
        <div className="text-base m-1 md:m-4">{promptData.description}</div>
        <PromptResults></PromptResults>
      </div>
    </>
  );
}
