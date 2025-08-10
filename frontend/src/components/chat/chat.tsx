"use client";

import { ChatHeader } from "@/components/chat/chat-header";
import { MultimodalInput } from "@/components/chat/multimodal-input";
import { PreviewMessage, ThinkingMessage } from "@/components/message";
import { Overview } from "@/components/overview";
import { useScrollToBottom } from "@/components/use-scroll-to-bottom";
import { SERVER_URL, VERSION_PREFIX } from "@/config";
import { useAuth } from "@/context/auth-context";
import { usePrompt } from "@/context/prompt-context";
import { useFirstVisit } from "@/hooks/use-first-visit";
import { useQueryClient } from "@tanstack/react-query";
import type { Attachment, Message } from "ai";
import { useChat } from "ai/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ChatTutorial } from "./chat-tutorial";

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
  const { prompt, setPrompt, systemInstruction } = usePrompt();

  const isFirstVisit = useFirstVisit();
  const [runTutorial, setRunTutorial] = useState(false);

  useEffect(() => {
    if (isFirstVisit) {
      setRunTutorial(true);
    }
  }, [isFirstVisit]);

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
    body: {
      id,
      modelId: selectedModelId,
      systemInstruction,
      promptId: prompt.id ?? undefined,
    },
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

      if (prompt.value.length > 0) {
        setPrompt({ id: "", value: "", isSending: false });
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
      {runTutorial && (
        <ChatTutorial run={runTutorial} setRun={setRunTutorial} />
      )}

      <div className="flex flex-col min-w-0 h-dvh bg-background">
        <ChatHeader
          selectedModelId={selectedModelId}
          setRunTutorial={setRunTutorial}
        />

        <div
          ref={messagesContainerRef}
          className="flex flex-col min-w-0 gap-6 flex-1 overflow-y-auto pt-4"
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
          ></div>
        </div>

        <form className="flex mx-auto p-2 md:px-4 bg-background pb-4 md:pb-6 gap-2 w-full md:max-w-3xl">
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
