export interface Prompt {
  id: string;
  title: string;
  description: string;
  stringTemplate: string;
  creatorId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PromptCard {
  id: string;
  title: string;
  description: string;
  stringTemplate: string;
  creatorId: string;
  createdAt: Date;
  updatedAt: Date;
  creator: {
    id: string;
    username: string;
  };
  stars: [
    userId: string,
    promptId: string,
    user: {
      id: string;
      username: string;
    },
  ];
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

export interface Tag {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}
