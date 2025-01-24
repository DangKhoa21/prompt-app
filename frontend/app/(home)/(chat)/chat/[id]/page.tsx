"use client";

import { Chat } from "@/components/chat/chat";
import { DEFAULT_MODEL_NAME } from "@/lib/ai/models";
import { getChatById, getMessagesByChatId } from "@/services/chat";
import { convertToUIMessages } from "@/lib/utils";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { useEffect } from "react";

export default function Page() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const { isLoading: chatLoading, error: chatError } = useQuery({
    queryKey: ["chat", id],
    queryFn: () => getChatById(id),
  });

  const {
    isLoading: messagesLoading,
    error: messagesError,
    data: messagesFromDb,
  } = useQuery({
    queryKey: ["messages", "chatId", id],
    queryFn: () => getMessagesByChatId(id),
  });

  useEffect(() => {
    if (chatError || messagesError) {
      toast.error(
        chatError
          ? `Failed to load chat ${id} (${chatError.message})`
          : `Failed to load messages for chat ${id} (${messagesError?.message})`
      );
      router.push("/");
      toast.dismiss();
    } else if (!chatLoading && !messagesLoading) {
      toast.dismiss();
    }
  }, [chatError, messagesError, chatLoading, messagesLoading, id, router]);

  if (chatLoading) {
    toast.loading("Loading chat...");
    return null;
  }

  if (messagesLoading) {
    toast.loading("Loading messages...");
    return null;
  }

  return (
    <Chat
      id={id}
      initialMessages={convertToUIMessages(messagesFromDb || [])}
      selectedModelId={DEFAULT_MODEL_NAME}
    />
  );
}
