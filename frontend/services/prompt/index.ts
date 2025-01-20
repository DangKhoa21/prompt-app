import axiosInstance from "@/lib/axios";
import { PromptCard, PromptWithConfigs, Tag } from "./interface";

export async function getPrompts(): Promise<PromptCard[]> {
  const response = await axiosInstance.get("/prompts");
  return response.data.data;
}

// TODO: update fetch function for tags
export async function getTags(): Promise<Tag[]> {
  return [
    {
      id: "1",
      name: "Writing",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "2",
      name: "Summarizing",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "last",
      name: "More",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

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
