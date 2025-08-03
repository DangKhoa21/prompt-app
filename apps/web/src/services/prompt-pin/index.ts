import axiosWithAuth from "@/lib/axios/axiosWithAuth";
import { PromptPinItem } from "./interface";

export async function pinPrompt(promptId: string): Promise<boolean> {
  const response = await axiosWithAuth.post(`/prompts/${promptId}/pin`);
  return response.data.data;
}

export async function unpinPrompt(promptId: string): Promise<boolean> {
  const response = await axiosWithAuth.delete(`/prompts/${promptId}/unpin`);
  return response.data.data;
}

export async function getPinnedPrompts(): Promise<PromptPinItem[]> {
  const response = await axiosWithAuth.get("/users/pinned-prompts");
  return response.data.data;
}
