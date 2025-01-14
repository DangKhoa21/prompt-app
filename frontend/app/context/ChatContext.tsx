import React, { createContext, useContext } from "react";
import { useChat as useAIChat, UseChatOptions } from "ai/react";

type ChatProviderProps = {
  children: React.ReactNode;
  chatId: string;
  initialMessages?: UseChatOptions["initialMessages"];
  api?: UseChatOptions["api"];
  selectedModelId: string | undefined;
};

const ChatContext = createContext<ReturnType<typeof useAIChat> | undefined>(
  undefined,
);

export const ChatProvider = ({
  children,
  chatId,
  initialMessages,
  api,
  selectedModelId,
}: ChatProviderProps) => {
  const chat = useAIChat({
    initialMessages,
    api,
    body: { chatId, modelId: selectedModelId },
  }); // Initialize the AI chat hook

  return <ChatContext.Provider value={chat}>{children}</ChatContext.Provider>;
};

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChatContext must be used within a ChatProvider");
  }
  return context;
};
