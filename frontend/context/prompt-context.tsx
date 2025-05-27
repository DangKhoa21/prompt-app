"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";

type Prompt = {
  id: string;
  value: string;
  isSending: boolean;
};

interface PromptContextType {
  prompt: Prompt;
  setPrompt: Dispatch<SetStateAction<Prompt>>;
  systemInstruction: string | null;
  setSystemInstruction: Dispatch<SetStateAction<string | null>>;
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
  const [prompt, setPrompt] = useState<Prompt>({
    id: "",
    value: "",
    isSending: false,
  });

  const [systemInstruction, setSystemInstruction] = useState<string | null>(
    null,
  );

  return (
    <PromptContext.Provider
      value={{ prompt, setPrompt, systemInstruction, setSystemInstruction }}
    >
      {children}
    </PromptContext.Provider>
  );
};
