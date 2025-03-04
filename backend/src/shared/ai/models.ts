// Define your models here.

export interface Model {
  id: string;
  label: string;
  apiIdentifier: string;
  description: string;
}

export const models: Array<Model> = [
  {
    id: 'gemini-1.5-flash-002',
    label: 'Gemini 1.5 Flash',
    apiIdentifier: 'gemini-1.5-flash-002',
    description: 'Small model for fast, lightweight tasks',
  },
  {
    id: 'gemini-1.5-pro-002',
    label: 'Gemini 1.5 Pro',
    apiIdentifier: 'gemini-1.5-pro-002',
    description: 'For complex, multi-step tasks',
  },
  {
    id: 'deepseek-chat',
    label: 'DeepSeek V3',
    apiIdentifier: 'deepseek/deepseek-chat',
    description: 'For general conversations and broad task handling',
  },
  {
    id: 'deepseek-reasoner',
    label: 'DeepSeek R1',
    apiIdentifier: 'deepseek/deepseek-r1',
    description: 'For logical reasoning and complex problem-solving',
  },
] as const;

export const DEFAULT_MODEL_NAME: string = 'gemini-1.5-flash-002';
