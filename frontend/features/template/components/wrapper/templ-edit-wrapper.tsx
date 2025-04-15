import { TemplateEditSection } from "@/features/template";
import {
  getPromptTemplateServer,
  getTagsForTemplateServer,
  getTagsServer,
} from "@/services/prompt/action";

export async function TemplateEditWrapper({ id }: { id: string }) {
  try {
    const [promptTemplateData, tagsData, allTags] = await Promise.all([
      getPromptTemplateServer(id),
      getTagsForTemplateServer(id),
      getTagsServer(),
    ]);

    promptTemplateData.tags = tagsData;

    return (
      <TemplateEditSection
        initialPrompt={promptTemplateData}
        allTags={allTags}
      />
    );
  } catch (error) {
    return (
      <div className="flex flex-col h-full items-center justify-center text-red-400">
        <h2 className="text-xl font-bold">Failed to load template.</h2>
        <p>{(error as Error).message}</p>
      </div>
    );
  }
}
