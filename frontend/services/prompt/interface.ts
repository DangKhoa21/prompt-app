import { ConfigType } from "@/features/template";

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

export interface PromptCard extends Prompt {
  creator: {
    id: string;
    username: string;
  };
  hasStarred: boolean;
  starCount: number;
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

export interface PromptFilter {
  search?: string;
  tagId?: string;
  creatorId?: string;
}

export interface PromptTemplate {
  id: string;
  title: string;
  description: string;
  stringTemplate: string;
  creatorId: string;
}

export interface TemplateConfigValue {
  id: string;
  value: string;
  promptConfigId: string;
}

export interface TemplateConfig {
  id: string;
  label: string;
  type: ConfigType;
  promptId: string;
  values: TemplateConfigValue[];
}

export interface TemplateWithConfigs extends PromptTemplate {
  tags: TemplateTag[];
  configs: TemplateConfig[];
}

export interface Tag {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TemplateTag {
  id: string;
  name: string;
}

