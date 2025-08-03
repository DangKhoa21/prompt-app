import axiosInstance from "@/lib/axios";
import { PromptPinItem } from "./interface";

export async function pinPrompt(promptId: string): Promise<boolean> {
  const response = await axiosInstance.post(`/prompts/${promptId}/pin`);
  return response.data.data;
}

export async function unpinPrompt(promptId: string): Promise<boolean> {
  const response = await axiosInstance.delete(`/prompts/${promptId}/unpin`);
  return response.data.data;
}

export async function getPinnedPrompts(): Promise<PromptPinItem[]> {
  const response = await axiosInstance.get("/users/pinned-prompts");
  return response.data.data;
}
