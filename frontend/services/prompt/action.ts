import { PAGE_LIMIT, SERVER_URL, VERSION_PREFIX } from "@/config";
import { safeAxiosGet, safeAxiosGetPage } from "@/lib/axios-server";
import {
  PromptCard,
  PromptFilter,
  PromptWithConfigs,
  Tag,
  TemplateTag,
  TemplateWithConfigs,
} from "@/services/prompt/interface";
import { Paginated } from "@/services/shared";

// Hmmmm
export async function getPromptServer(id: string): Promise<PromptWithConfigs> {
  return safeAxiosGet(`${SERVER_URL}/${VERSION_PREFIX}/prompts/${id}`);
}

export async function getPromptTemplateServer(
  id: string,
): Promise<TemplateWithConfigs> {
  return safeAxiosGet(`${SERVER_URL}/${VERSION_PREFIX}/prompts/${id}`);
}

export async function getPromptsServer({
  pageParam,
  filter,
}: {
  pageParam: string;
  filter?: PromptFilter;
}): Promise<Paginated<PromptCard>> {
  const { tagId, search, creatorId, sort } = filter || {};

  return safeAxiosGetPage(`${SERVER_URL}/${VERSION_PREFIX}/prompts/`, {
    params: {
      limit: PAGE_LIMIT,
      cursor: pageParam.length > 0 ? pageParam : undefined,
      tagId: tagId ? tagId : undefined,
      search,
      creatorId: creatorId ? creatorId : undefined,
      sort,
    },
  });
}

// Hmmmm
export async function getTagsServer(): Promise<Tag[]> {
  return safeAxiosGet(`${SERVER_URL}/${VERSION_PREFIX}/tags`);
}

export async function getTagsForTemplateServer(
  id: string,
): Promise<TemplateTag[]> {
  return safeAxiosGet(`${SERVER_URL}/${VERSION_PREFIX}/prompts/${id}/tags`);
}
