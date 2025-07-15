import axiosWithAuth from "@/lib/axios/axiosWithAuth";

export async function starPrompt(promptId: string): Promise<boolean> {
  const response = await axiosWithAuth.post(`/prompts/${promptId}/star`);
  return response.data.data;
}

export async function unstarPrompt(promptId: string): Promise<boolean> {
  const response = await axiosWithAuth.delete(`/prompts/${promptId}/unstar`);
  return response.data.data;
}
