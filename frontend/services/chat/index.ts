import axiosWithAuth from "@/lib/axios/axiosWithAuth";
import { Chat, Message } from "./interface";

export async function getChatById(id: string): Promise<Chat | null> {
  const response = await axiosWithAuth.get(`/chat/${id}`);
  return response.data.data;
}

export async function getMessagesByChatId(id: string): Promise<Message[]> {
  const response = await axiosWithAuth.get(`/chat/${id}/messages`);
  return response.data.data;
}

export async function getHistory(): Promise<Chat[]> {
  const response = await axiosWithAuth.get(`/chat/history`);
  return response.data.data;
}

export async function deleteChatById(id: string): Promise<void> {
  await axiosWithAuth.delete(`/chat/${id}`);
}
