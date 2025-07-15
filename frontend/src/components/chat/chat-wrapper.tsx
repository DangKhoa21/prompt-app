"use client";

import { convertToUIMessages } from "@/lib/utils";
import { getMessagesByChatId } from "@/services/chat";
import { useQuery } from "@tanstack/react-query";
import { Message } from "ai";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
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
  const toastIdRef = useRef<string | number | null>(null);

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
      toastIdRef.current = toast.error(
        `Failed to load messages for chat ${id} (${messagesError.message})`
      );
      router.replace("/chat");
    } else if (!messagesLoading && toastIdRef.current) {
      toast.dismiss(toastIdRef.current);
      toastIdRef.current = null;
    }
  }, [messagesError, messagesLoading, id, router]);

  if (messagesLoading) {
    return <div className="p-4 text-muted-foreground">Loading chat...</div>;
  }

  return (
    <Chat
      id={id}
      initialMessages={
        convertToUIMessages(messagesFromDb || []) as Array<Message>
      }
      selectedModelId={selectedModelId}
    />
  );
}
