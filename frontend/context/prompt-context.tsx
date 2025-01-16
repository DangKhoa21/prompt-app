"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

interface PromptContextType {
  prompt: string;
  setPrompt: (message: string) => void;
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
  const [prompt, setPrompt] = useState<string>("");

  return (
    <PromptContext.Provider value={{ prompt, setPrompt }}>
      {children}
    </PromptContext.Provider>
  );
};
