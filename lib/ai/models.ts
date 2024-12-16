// Define your models here.

export interface Model {
  id: string;
  label: string;
  apiIdentifier: string;
  description: string;
}

export const models: Array<Model> = [
  {
    id: "gpt-4o-mini",
    label: "GPT 4o mini",
    apiIdentifier: "gpt-4o-mini",
    description: "Small model for fast, lightweight tasks",
  },
  {
    id: "gpt-4o",
    label: "GPT 4o",
    apiIdentifier: "gpt-4o",
    description: "For complex, multi-step tasks",
  },
  {
    id: "gemini-1.5-flash-002",
    label: "Gemini 1.5 flash 002",
    apiIdentifier: "gemini-1.5-flash-002",
    description: "Gemini small model for fast, lightweight tasks",
  },
] as const;

// export const DEFAULT_MODEL_NAME: string = 'gpt-4o-mini';
export const DEFAULT_MODEL_NAME: string = "gemini-1.5-flash-002";
