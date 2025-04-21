import axiosInstance from "@/lib/axios";
import {
  PromptCard,
  PromptFilter,
  PromptWithConfigs,
  PromptWithConfigsCreation,
  Tag,
  TemplateTag,
  TemplateWithConfigs,
} from "@/services/prompt/interface";
import { Paginated } from "@/services/shared";
import { PAGE_LIMIT } from "@/config";
import { ConfigType } from "@/features/template";

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
  const response = await axiosInstance.get("/users/starred-prompts", {
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
  const response = await axiosInstance.get("/tags");
  return response.data.data;
}

export async function getPrompt(id: string | null): Promise<PromptWithConfigs> {
  if (!id) {
    return {
      id: "1",
      title: "No prompt selected",
      description: "You need to go to the marketplace to select a prompt",
      stringTemplate: "",
      systemInstruction: null,
      usageCount: 0,
      creatorId: "",
      createdAt: new Date(),
      updatedAt: new Date(),
      configs: [],
    };
  }
  const response = await axiosInstance.get(`/prompts/${id}`);
  return response.data.data;
}

export async function getTagsForTemplate(id: string): Promise<TemplateTag[]> {
  const response = await axiosInstance.get(`/prompts/${id}/tags`);
  return response.data.data;
}

export async function getPromptTemplate(
  id: string
): Promise<TemplateWithConfigs> {
  const response = await axiosInstance.get(`/prompts/${id}`);
  return response.data.data;
}

export async function createPromptTemplate(
  data: PromptWithConfigsCreation
): Promise<string> {
  // Change config type to lowercase
  data.configs = data.configs.map((config) => ({
    ...config,
    type: config.type.toLowerCase(),
  }));
  const response = await axiosInstance.post(`/prompts`, data);
  return response.data.data;
}

export async function updatePromptTemplate(
  data: TemplateWithConfigs
): Promise<boolean> {
  data.configs = data.configs.map((config) => ({
    ...config,
    type: config.type.toLowerCase() as ConfigType,
  }));
  const response = await axiosInstance.put(`/prompts/${data.id}`, data);
  return response.data.data;
}

export async function updateTag(
  id: string,
  data: TemplateTag[]
): Promise<boolean> {
  const response = await axiosInstance.put(`/prompts/${id}/tags`, {
    tagIds: data.map((tag) => tag.id),
  });
  return response.data.data;
}

export async function deletePromptTemplate(id: string): Promise<boolean> {
  const response = await axiosInstance.delete(`/prompts/${id}`);
  return response.data.data;
}

export async function createEnhancePrompt(prompt: string) {
  const response = await axiosInstance.post("/prompts/enhance", {
    prompt,
  });

  const regex = /<improved_prompt>([\s\S]*?)<\/improved_prompt>/;
  const data = response.data.match(regex);

  return data ? data[1].trim() : null;
}

export async function generateResult(prompt: string): Promise<string> {
  const response = await axiosInstance.post("/prompts/generate-result", {
    prompt,
  });

  return response.data;
}

export async function evaluatePrompt(prompt: string): Promise<string> {
  const response = await axiosInstance.post("/prompts/evaluate", {
    prompt,
  });

  // return response.data;

  const regex = /<improved_prompt>\s*([\s\S]*?)\s*<\/improved_prompt>/i;
  const data = response.data.match(regex);

  return data ? data[1].trim() : "";
}

export async function getPromptsOfCreator(
  creatorId: string
): Promise<Array<PromptCard>> {
  const response = await axiosInstance.get("/prompts", {
    params: {
      creatorId: creatorId,
    },
  });
  return response.data.data;
}

export async function updatePromptResult(id: string, promptResult: string) {
  const response = await axiosInstance.patch(`/prompts/${id}/result`, {
    exampleResult: promptResult,
  });

  return response.data;
}
