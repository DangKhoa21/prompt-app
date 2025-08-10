import { PAGE_LIMIT } from "@/config";
import { ConfigType } from "@/features/template";
import axiosInstance from "@/lib/axios/axiosIntance";
import axiosWithAuth from "@/lib/axios/axiosWithAuth";
import {
  Prompt,
  PromptCard,
  PromptFilter,
  PromptStats,
  PromptWithConfigs,
  PromptWithConfigsCreation,
  Tag,
  TemplateTag,
  TemplateWithConfigs,
} from "@/services/prompt/interface";
import { Paginated } from "@/services/shared";

export async function getPrompts({
  pageParam,
  filter,
}: {
  pageParam: string;
  filter?: PromptFilter;
}): Promise<Paginated<PromptCard>> {
  const { tagId, search, creatorId, sort } = filter || {};
  const response = await axiosInstance.get("/prompts", {
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

export async function getStarredPrompts({
  pageParam,
  filter,
}: {
  pageParam: string;
  filter?: PromptFilter;
}): Promise<Paginated<PromptCard>> {
  const { tagId, search } = filter || {};
  const response = await axiosWithAuth.get("/users/starred-prompts", {
    params: {
      limit: PAGE_LIMIT,
      cursor: pageParam.length > 0 ? pageParam : undefined,
      tagId: tagId ? tagId : undefined,
      search,
    },
  });
  return response.data;
}

export async function getTags(): Promise<Tag[]> {
  const response = await axiosWithAuth.get("/tags");
  return response.data.data;
}

export async function getPrompt(
  id: string | null,
  filter: PromptFilter = {},
): Promise<Prompt> {
  if (!id) {
    return {
      id: "1",
      title: "No prompt selected",
      description: "You need to go to the marketplace to select a prompt",
      stringTemplate: "",
      systemInstruction: null,
      exampleResult: null,
      usageCount: 0,
      viewCount: 0,
      creatorId: "",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }
  const response = await axiosInstance.get(`/prompts/${id}`, {
    params: { tags: filter.tagId ?? undefined },
  });
  return response.data.data;
}

export async function getPromptWithConfigs(
  id: string | null,
): Promise<PromptWithConfigs> {
  if (!id) {
    return {
      id: "1",
      title: "No prompt selected",
      description: "You need to go to the marketplace to select a prompt",
      stringTemplate: "",
      systemInstruction: null,
      exampleResult: null,
      usageCount: 0,
      viewCount: 0,
      creatorId: "",
      createdAt: new Date(),
      updatedAt: new Date(),
      configs: [],
    };
  }
  const response = await axiosWithAuth.get(`/prompts/${id}`);
  return response.data.data;
}

export async function getTagsForTemplate(id: string): Promise<TemplateTag[]> {
  const response = await axiosWithAuth.get(`/prompts/${id}/tags`);
  return response.data.data;
}

export async function getPromptTemplate(
  id: string,
): Promise<TemplateWithConfigs> {
  const response = await axiosWithAuth.get(`/prompts/${id}`);
  return response.data.data;
}

export async function createPromptTemplate(
  data: PromptWithConfigsCreation,
): Promise<string> {
  // Change config type to lowercase
  data.configs = data.configs.map((config) => ({
    ...config,
    type: config.type.toLowerCase(),
  }));

  const response = await axiosWithAuth.post(`/prompts`, data);
  return response.data.data;
}

export async function updatePromptTemplate(
  data: TemplateWithConfigs,
): Promise<boolean> {
  data.configs = data.configs.map((config) => ({
    ...config,
    type: config.type.toLowerCase() as ConfigType,
  }));

  const response = await axiosWithAuth.put(`/prompts/${data.id}`, data);
  return response.data.data;
}

export async function updateTag(
  id: string,
  data: TemplateTag[],
): Promise<boolean> {
  const response = await axiosWithAuth.put(`/prompts/${id}/tags`, {
    tagIds: data.map((tag) => tag.id),
  });
  return response.data.data;
}

export async function deletePromptTemplate(id: string): Promise<boolean> {
  const response = await axiosWithAuth.delete(`/prompts/${id}`);
  return response.data.data;
}

export async function createEnhancePrompt(prompt: string) {
  const response = await axiosWithAuth.post("/prompts/enhance", {
    prompt,
  });

  const regex = /<improved_prompt>([\s\S]*?)<\/improved_prompt>/;
  const data = response.data.match(regex);

  return data ? data[1].trim() : null;
}

export async function generateResult(prompt: string): Promise<string> {
  const response = await axiosWithAuth.post("/prompts/generate-result", {
    prompt,
  });

  return response.data;
}

export async function evaluatePrompt(prompt: string): Promise<string> {
  const response = await axiosWithAuth.post("/prompts/evaluate", {
    prompt,
  });

  const regex = /<analysis>\s*([\s\S]*?)\s*<\/analysis>/i;
  const data = response.data.match(regex);

  return data ? data[1].trim() : "";
}

export async function getPromptsOfCreator(
  creatorId: string,
): Promise<Array<PromptCard>> {
  const response = await axiosWithAuth.get("/prompts", {
    params: {
      creatorId: creatorId,
    },
  });
  return response.data.data;
}

export async function updatePromptResult(id: string, promptResult: string) {
  const response = await axiosWithAuth.patch(`/prompts/${id}/result`, {
    exampleResult: promptResult,
  });

  return response.data;
}

export async function getPromptStats(id: string): Promise<PromptStats> {
  const response = await axiosWithAuth.get(`/prompts/${id}/stats`);
  return response.data.data;
}

export async function viewPrompt(id: string): Promise<boolean> {
  const response = await axiosInstance.post(`/prompts/${id}/view`);
  return response.data.data;
}
