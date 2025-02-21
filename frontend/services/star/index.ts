import axiosInstance from "@/lib/axios";

export async function starPrompt(promptId: string): Promise<boolean> {
  const response = await axiosInstance.post(`/prompts/${promptId}/star`);
  return response.data.data;
}

export async function unstarPrompt(promptId: string): Promise<boolean> {
  const response = await axiosInstance.delete(`/prompts/${promptId}/unstar`);
  return response.data.data;
}
