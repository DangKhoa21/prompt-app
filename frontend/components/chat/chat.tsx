"use client";

import type { Attachment, Message } from "ai";
import { useState } from "react";

import { PreviewMessage, ThinkingMessage } from "@/components/message";

import { ChatHeader } from "@/components/chat/chat-header";
import { useChat } from "ai/react";
import { MultimodalInput } from "@/components/chat/multimodal-input";

import { Overview } from "@/components/overview";
import { useScrollToBottom } from "@/components/use-scroll-to-bottom";
import { SERVER_URL, VERSION_PREFIX } from "@/config";
import { useAuth } from "@/context/auth-context";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

export function Chat({
  id,
  initialMessages,
  selectedModelId,
}: {
  id: string;
  initialMessages: Array<Message>;
  selectedModelId: string;
}) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { token, isAuthenticated } = useAuth();
  const searchParams = useSearchParams();

  const {
    messages,
    setMessages,
    handleSubmit,
    input,
    setInput,
    append,
    isLoading,
    stop,
    // data: streamingData,
  } = useChat({
    api: `${SERVER_URL}/${VERSION_PREFIX}/chat`,
    id,
    body: { id, modelId: selectedModelId },
    initialMessages,
    headers: { Authorization: "Bearer " + token },
    onFinish: () => {
      if (messages.length === 0) {
        queryClient.invalidateQueries({ queryKey: ["history"] });
        if (isAuthenticated) {
          router.push(`/chat/${id}?${searchParams.toString()}`);
          router.refresh();
        }
      }
    },
    onError: (e) => {
      try {
        const err = JSON.parse(e.message);
        toast.error(err.message);
      } catch {
        toast.error("Something went wrong, please try again!");
      }
    },
  });

  const [messagesContainerRef, messagesEndRef] =
    useScrollToBottom<HTMLDivElement>();

  const [attachments, setAttachments] = useState<Array<Attachment>>([]);

  return (
    <>
      <div className="flex flex-col min-w-0 h-dvh bg-background">
        <ChatHeader selectedModelId={selectedModelId} />

        <div
          ref={messagesContainerRef}
          className="flex flex-col min-w-0 gap-6 flex-1 overflow-y-scroll pt-4"
        >
          {messages.length === 0 && <Overview />}

          {messages.map((message, index) => (
            <PreviewMessage
              key={message.id}
              message={message}
              isLoading={isLoading && messages.length - 1 === index}
            />
          ))}

          {isLoading &&
            messages.length > 0 &&
            messages[messages.length - 1].role === "user" && (
              <ThinkingMessage />
            )}

          <div
            ref={messagesEndRef}
            className="shrink-0 min-w-[24px] min-h-[24px]"
          />
        </div>

        <form className="flex mx-auto px-4 bg-background pb-4 md:pb-6 gap-2 w-full md:max-w-3xl">
          <MultimodalInput
            chatId={id}
            input={input}
            setInput={setInput}
            handleSubmit={handleSubmit}
            isLoading={isLoading}
            stop={stop}
            attachments={attachments}
            setAttachments={setAttachments}
            messages={messages}
            setMessages={setMessages}
            append={append}
          />
        </form>
      </div>
    </>
  );
}
