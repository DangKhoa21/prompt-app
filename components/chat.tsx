"use client";

import { ChatHeader } from "@/components/chat-header";
import { MultimodalInput } from "./multimodal-input";

export function Chat() {
  return (
    <>
      <div className="flex flex-col min-w-0 h-dvh bg-background">
        <ChatHeader />
        <form className="flex mx-auto px-4 bg-background pb-4 md:pb-6 gap-2 w-full md:max-w-3xl">
          <MultimodalInput />
        </form>
      </div>
    </>
  );
}
