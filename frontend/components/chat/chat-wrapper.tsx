"use client";

import { convertToUIMessages } from "@/lib/utils";
import { getMessagesByChatId } from "@/services/chat";
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

  const {
    isLoading: messagesLoading,
    error: messagesError,
    data: messagesFromDb,
  } = useQuery({
    queryKey: ["messages", "chatId", id],
    queryFn: () => getMessagesByChatId(id),
  });

  useEffect(() => {
    if (messagesError) {
      toast.error(
        `Failed to load messages for chat ${id} (${messagesError?.message})`
      );
      router.replace("/");
      toast.dismiss();
    } else if (!messagesLoading) {
      toast.dismiss();
    }
  }, [messagesError, messagesLoading, id, router]);

  if (messagesLoading) {
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
