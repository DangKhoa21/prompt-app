import { ReactNode } from "react";

export interface Technique {
  id: string;
  name: string;
  description: string;
  icon: ReactNode;
  category: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  useCase: string;
  template: string;
  examples: {
    before: string;
    after: string;
    explanation: string;
  }[];
  steps: string[];
  tips: string[];
}

export interface TechniqueBuilder {
  id: string;
  userPrompt: string;
  selectedTechnique: string;
  parameters: Record<string, string>;
  generatedPrompt: string;
}
