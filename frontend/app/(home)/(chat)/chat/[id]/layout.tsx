import { SERVER_URL, VERSION_PREFIX } from "@/config";
import { Chat } from "@/services/chat/interface";
import axios from "axios";

async function getChatById(id: string): Promise<Chat | null> {
  const response = await axios.get(
    `${SERVER_URL}/${VERSION_PREFIX}/chat/${id}`,
  );
  return response.data.data;
}

export async function generateMetadata({
  params,
}: {
  params: {
    id: string;
  };
}) {
  const prompt = await getChatById(params.id);

  return {
    title: prompt?.title ?? "Unnamed Chat",
    description: `Conversation for ${prompt?.title ?? "Unnamed chat"}`,
  };
}

export default function ChatIdLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
