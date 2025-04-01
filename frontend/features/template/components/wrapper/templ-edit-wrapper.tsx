import { TemplateEditSection } from "@/features/template";
import {
  getPromptTemplateServer,
  getTagsForTemplateServer,
  getTagsServer,
} from "@/services/prompt/action";

export async function TemplateEditWrapper({ id }: { id: string }) {
  const [promptTemplateData, tagsData, allTags] = await Promise.all([
    getPromptTemplateServer(id),
    getTagsForTemplateServer(id),
    getTagsServer(),
  ]);

  promptTemplateData.tags = tagsData;

  return (
    <>
      <TemplateEditSection
        initialPrompt={promptTemplateData}
        allTags={allTags}
      />
    </>
  );
}
