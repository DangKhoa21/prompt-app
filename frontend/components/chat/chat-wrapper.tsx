"use client";

import { convertToUIMessages } from "@/lib/utils";
import { getChatById, getMessagesByChatId } from "@/services/chat";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";
import { Chat } from "./chat";

export function ChatWrapper({
  id,
  selectedModelId,
}: {
  id: string;
  selectedModelId: string;
}) {
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
      router.replace("/");
      toast.dismiss();
    } else if (!chatLoading && !messagesLoading) {
      toast.dismiss();
    }
  }, [chatError, messagesError, chatLoading, messagesLoading, id, router]);

  if (chatLoading || messagesLoading) {
    return null;
  }

  return (
    <Chat
      id={id}
      initialMessages={convertToUIMessages(messagesFromDb || [])}
      selectedModelId={selectedModelId}
    />
  );
}
