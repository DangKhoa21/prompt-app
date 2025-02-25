import axiosInstance from "@/lib/axios";
import {
  PromptCard,
  PromptWithConfigs,
  PromptWithConfigsCreation,
  Tag,
  TemplateTag,
  TemplateWithConfigs,
} from "@/services/prompt/interface";
import { Paginated } from "../shared";

export async function getPrompts({
  limit,
  pageParam,
  tagId,
  search,
}: {
  limit?: number;
  pageParam: string;
  tagId?: string | null;
  search?: string;
}): Promise<Paginated<PromptCard>> {
  const response = await axiosInstance.get("/prompts", {
    params: {
      limit: limit ? limit : undefined,
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
      creatorId: "",
      createdAt: new Date(),
      updatedAt: new Date(),
      configs: [],
    };
  }
  const response = await axiosInstance.get(`/prompts/${id}`);
  return response.data.data;
}

export async function getPromptTemplates(): Promise<PromptCard[]> {
  const response = await axiosInstance.get(`/prompts/templates`);
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
  const response = await axiosInstance.post(`/prompts`, data);
  return response.data.data;
}

export async function updatePromptTemplate(
  data: TemplateWithConfigs
): Promise<boolean> {
  const response = await axiosInstance.put(`/prompts/${data.id}`, data);
  return response.data.data;
}

export async function updateTag(data: TemplateWithConfigs): Promise<boolean> {
  const response = await axiosInstance.put(`/prompts/${data.id}/tags`, {
    tagIds: data.tags.map((tag) => tag.id),
  });
  return response.data.data;
}

export async function deletePromptTemplate(id: string): Promise<boolean> {
  const response = await axiosInstance.delete(`/prompts/${id}`);
  return response.data.data;
}
