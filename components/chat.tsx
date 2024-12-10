"use client";

import { ChatHeader } from "@/components/chat-header";
import { MultimodalInput } from "./multimodal-input";

import { useScrollToBottom } from "@/components/use-scroll-to-bottom";

export function Chat() {
  const [messagesContainerRef, messagesEndRef] =
    useScrollToBottom<HTMLDivElement>();

  return (
    <>
      <div className="flex flex-col min-w-0 h-dvh bg-background">
        <ChatHeader />

        <div
          ref={messagesContainerRef}
          className="flex flex-col min-w-0 gap-6 flex-1 overflow-y-scroll pt-4"
        >
          {/* <PreviewMessage />

          <ThinkingMessage /> */}

          <div
            ref={messagesEndRef}
            className="shrink-0 min-w-[24px] min-h-[24px]"
          />
        </div>

        <form className="flex mx-auto px-4 bg-background pb-4 md:pb-6 gap-2 w-full md:max-w-3xl">
          <MultimodalInput />
        </form>
      </div>
    </>
  );
}
