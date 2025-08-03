import axiosInstance from "@/lib/axios/axiosIntance";
import { Chat } from "@/services/chat/interface";

async function getChatById(id: string): Promise<Chat | null> {
  const response = await axiosInstance.get(`/chat/${id}`);
  return response.data.data;
}

export async function generateMetadata({
  params,
}: {
  params: {
    id: string;
  };
}) {
  try {
    const chat = await getChatById(params.id);
    if (!chat) {
      return {
        title: "Chat not found",
        description: "The requested chat does not exist.",
      };
    }
    return {
      title: `${chat.title}`,
      description: `ID ${chat.id}`,
    };
  } catch {
    return {
      title: "Error",
      description: "An error occurred while fetching the chat.",
    };
  }
}

export default function ChatIdLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
