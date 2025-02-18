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

export interface PromptTemplate {
  id: string;
  title: string;
  description: string;
  stringTemplate: string;
  creatorId: string;
}

export interface ConfigValue {
  id: string;
  value: string;
  promptConfigId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TemplateConfigValue {
  id: string;
  value: string;
  promptConfigId: string;
}

export interface PromptConfig {
  id: string;
  label: string;
  type: string;
  promptId: string;
  createdAt: Date;
  updatedAt: Date;
  values: ConfigValue[] | null;
}

export interface TemplateConfig {
  id: string;
  label: string;
  type: string;
  promptId: string;
  values: TemplateConfigValue[] | null;
}

export interface PromptWithConfigs extends Prompt {
  configs: PromptConfig[];
}

export interface TemplateWithConfigs extends PromptTemplate {
  configs: TemplateConfig[];
}

export interface ConfigsValueCreation {
  id: string;
  value: string;
}

export interface ConfigsCreation {
  id: string;
  label: string;
  type: string;
  values: ConfigsValueCreation[] | null;
}

export interface PromptWithConfigsCreation {
  id: string;
  title: string;
  description: string;
  stringTemplate: string;
  configs: ConfigsCreation[];
}

export interface Tag {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}
