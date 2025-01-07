"use client";

import type { Attachment, Message } from "ai";
import { useState } from "react";

import { PreviewMessage, ThinkingMessage } from "@/components/message";

import { useChat } from "ai/react";
import { ChatHeader } from "@/components/chat-header";
import { MultimodalInput } from "./multimodal-input";

import { useScrollToBottom } from "@/components/use-scroll-to-bottom";
import { Overview } from "@/components/overview";
import { SERVER_URL } from "@/config";

export function Chat({
  id,
  initialMessages,
  selectedModelId,
}: {
  id: string;
  initialMessages: Array<Message>;
  selectedModelId: string;
}) {
  const {
    messages,
    // setMessages,
    handleSubmit,
    input,
    setInput,
    append,
    isLoading,
    stop,
    // data: streamingData,
  } = useChat({
    api: `${SERVER_URL}/api/chat`,
    body: { id, modelId: selectedModelId },
    initialMessages,
    // onFinish: () => {
    //   mutate("/api/history");
    // },
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

          {messages.map((message) => (
            <PreviewMessage key={message.id} message={message} />
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
            input={input}
            setInput={setInput}
            handleSubmit={handleSubmit}
            isLoading={isLoading}
            stop={stop}
            attachments={attachments}
            setAttachments={setAttachments}
            messages={messages}
            append={append}
          />
        </form>
      </div>
    </>
  );
}
