import axiosInstance from "@/lib/axios";
import { Prompt, PromptWithConfigs } from "./interface";

export async function getPrompts(): Promise<Prompt[]> {
  const response = await axiosInstance.get("/prompts");
  return response.data.data;
}

export async function getPrompt(id: string): Promise<PromptWithConfigs> {
  const response = await axiosInstance.get(`/prompts/${id}`);
  return response.data.data;
}
