import axiosInstance from "@/lib/axios";
import { PromptCard, PromptWithConfigs, Tag } from "./interface";
import { Paginated } from "../shared";

export async function getPrompts({
  pageParam,
  tagId,
}: {
  pageParam: string;
  tagId: string | null;
}): Promise<Paginated<PromptCard>> {
  const response = await axiosInstance.get("/prompts", {
    params: {
      limit: 3,
      cursor: pageParam.length > 0 ? pageParam : undefined,
      tagId: tagId ? tagId : undefined,
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
