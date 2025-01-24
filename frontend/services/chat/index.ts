import axiosInstance from "@/lib/axios";
import { Chat, Message } from "./interface";

export async function getChatById(id: string): Promise<Chat | null> {
  const response = await axiosInstance.get(`/chat/${id}`);
  return response.data.data;
}

export async function getMessagesByChatId(id: string): Promise<Message[]> {
  const response = await axiosInstance.get(`/chat/${id}/messages`);
  return response.data.data;
}
