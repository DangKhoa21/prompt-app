"use client";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";

type Prompt = {
  value: string;
  isSending: boolean;
};

interface PromptContextType {
  prompt: Prompt;
  setPrompt: Dispatch<SetStateAction<Prompt>>;
}

const PromptContext = createContext<PromptContextType | undefined>(undefined);

export const usePrompt = () => {
  const context = useContext(PromptContext);
  if (!context) {
    throw new Error("usePrompt must be used within a PromptProvider");
  }
  return context;
};

export const PromptProvider = ({ children }: { children: ReactNode }) => {
  const [prompt, setPrompt] = useState<Prompt>({ value: "", isSending: false });

  return (
    <PromptContext.Provider value={{ prompt, setPrompt }}>
      {children}
    </PromptContext.Provider>
  );
};
