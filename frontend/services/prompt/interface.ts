export interface Prompt {
  id: string;
  title: string;
  description: string;
  stringTemplate: string;
  creatorId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ConfigValue {
  id: string;
  value: string;
  promptConfigId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PromptConfig {
  id: string;
  label: string;
  type: string;
  promptId: string;
  createdAt: Date;
  updatedAt: Date;
  values: ConfigValue[];
}

export interface PromptWithConfigs extends Prompt {
  configs: PromptConfig[];
}
