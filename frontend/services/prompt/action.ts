import { PAGE_LIMIT, SERVER_URL, VERSION_PREFIX } from "@/config";
import {
  PromptCard,
  PromptFilter,
  PromptWithConfigs,
  Tag,
  TemplateTag,
  TemplateWithConfigs,
} from "@/services/prompt/interface";
import { Paginated } from "@/services/shared";
import axios from "axios";

export async function getPromptServer(id: string): Promise<PromptWithConfigs> {
  const res = await fetch(`${SERVER_URL}/${VERSION_PREFIX}/prompts/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Failed to fetch prompt");
  const json = await res.json();
  return json.data;
}

export async function getPromptTemplateServer(
  id: string,
): Promise<TemplateWithConfigs> {
  const res = await fetch(`${SERVER_URL}/${VERSION_PREFIX}/prompts/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Failed to fetch prompt");
  const json = await res.json();
  return json.data;
}

export async function getPromptsServer({
  pageParam,
  filter,
}: {
  pageParam: string;
  filter?: PromptFilter;
}): Promise<Paginated<PromptCard>> {
  const { tagId, search, creatorId, sort } = filter || {};

  const response = await axios.get(`${SERVER_URL}/${VERSION_PREFIX}/prompts/`, {
    params: {
      limit: PAGE_LIMIT,
      cursor: pageParam.length > 0 ? pageParam : undefined,
      tagId: tagId ? tagId : undefined,
      search,
      creatorId: creatorId ? creatorId : undefined,
      sort,
    },
  });

  return response.data;
}

export async function getTagsServer(): Promise<Tag[]> {
  const res = await fetch(`${SERVER_URL}/${VERSION_PREFIX}/tags`, {
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Failed to fetch prompt");
  const json = await res.json();
  return json.data;
}

export async function getTagsForTemplateServer(
  id: string,
): Promise<TemplateTag[]> {
  const res = await fetch(
    `${SERVER_URL}/${VERSION_PREFIX}/prompts/${id}/tags`,
    {
      cache: "no-store",
    },
  );

  if (!res.ok) throw new Error(`Failed to fetch tags for prompt ${id}`);
  const json = await res.json();
  return json.data;
}
