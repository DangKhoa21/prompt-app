"use client";

import { TemplateWithConfigs } from "@/services/prompt/interface";
import { createContext, ReactNode, useContext, useState } from "react";

interface TemplateContextType {
  template: TemplateWithConfigs;
  setTemplate: (newTemplate: TemplateWithConfigs) => void;
}

const TemplateContext = createContext<TemplateContextType | undefined>(
  undefined,
);

export const useTemplate = () => {
  const template = useContext(TemplateContext);
  if (!template) {
    throw new Error("usePrompt must be used within a PromptProvider");
  }
  return template;
};

export const TemplateProvider = ({ children }: { children: ReactNode }) => {
  const [template, setTemplateState] = useState<TemplateWithConfigs>({
    id: "1",
    title: "Template Name",
    description:
      "This template is used for writing, brainstorming new idea for your project, ... etc",
    stringTemplate:
      "You are a helpful assistant that specializes in creative writing and brainstorming.",
    systemInstruction: "",
    creatorId: "",
    tags: [
      { id: "1", name: "Writing" },
      { id: "2", name: "Project" },
      { id: "3", name: "Creative" },
    ],
    configs: [],
  });

  const setTemplate = (newTemplate: TemplateWithConfigs | null) => {
    if (newTemplate) setTemplateState(newTemplate);
  };

  return (
    <TemplateContext.Provider value={{ template, setTemplate }}>
      {children}
    </TemplateContext.Provider>
  );
};
