import { SERVER_URL, VERSION_PREFIX } from "@/config";
import { PromptWithConfigs, TemplateTag } from "@/services/prompt/interface";

export async function getPromptServer(id: string): Promise<PromptWithConfigs> {
  const res = await fetch(`${SERVER_URL}/${VERSION_PREFIX}/prompts/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Failed to fetch prompt");
  const json = await res.json();
  return json.data;
}

export async function getTagsForTemplateServer(
  id: string
): Promise<TemplateTag[]> {
  const res = await fetch(
    `${SERVER_URL}/${VERSION_PREFIX}/prompts/${id}/tags`,
    {
      cache: "no-store",
    }
  );

  if (!res.ok) throw new Error(`Failed to fetch tags for prompt ${id}`);
  const json = await res.json();
  return json.data;
}
