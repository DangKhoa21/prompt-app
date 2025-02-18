import { z } from 'zod';

export const ErrPromptExisted = new Error('Prompt is already existed');
export const ErrPromptNotFound = new Error('Prompt not found');

export const promptSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  description: z.string(),
  stringTemplate: z.string(),
  creatorId: z.string().uuid(),
  createdAt: z.date().default(new Date()),
  updatedAt: z.date().default(new Date()),
});

export type Prompt = z.infer<typeof promptSchema>;

export type PromptCardRepo = Prompt & {
  creator: {
    id: string;
    username: string;
  };
  stars: Array<{ userId: string }>;
};

export type PromptCard = Prompt & {
  creator: {
    id: string;
    username: string;
  };
  hasStarred: boolean;
  starCount: number;
};

export type TemplateCard = Prompt;

export const promptUpdateDTOSchema = promptSchema.pick({
  title: true,
  description: true,
  stringTemplate: true,
  updatedAt: true,
});

export type PromptUpdateDTO = z.infer<typeof promptUpdateDTOSchema>;

export type PromptCondDTO = {
  title?: string;
  promptIds?: string[];
  creatorId?: string;
};

export const promptFilterDTOSchema = z.object({
  search: z.string().optional(),
  tagId: z.string().uuid().optional(),
  creatorId: z.string().uuid().optional(),
});

export type PromptFilterDTO = z.infer<typeof promptFilterDTOSchema>;

export const promptConfigSchema = z.object({
  id: z.string().uuid(),
  label: z.string(),
  type: z.string(),
  promptId: z.string().uuid(),
  createdAt: z.date().default(new Date()),
  updatedAt: z.date().default(new Date()),
});

export const configValueSchema = z.object({
  id: z.string().uuid(),
  value: z.string(),
  promptConfigId: z.string().uuid(),
  createdAt: z.date().default(new Date()),
  updatedAt: z.date().default(new Date()),
});

export type ConfigValue = z.infer<typeof configValueSchema>;

export type ConfigValueUpdateDTO = {
  id: string;
  value: string;
  updatedAt: Date;
};

export type PromptConfig = z.infer<typeof promptConfigSchema>;

export type PromptConfigUpdateDTO = {
  id: string;
  label: string;
  type: string;
  updatedAt: Date;
};

export type PromptWithConfigs = Prompt & {
  configs: Array<
    PromptConfig & {
      values: ConfigValue[];
    }
  >;
};

export const promptWithConfigsCreationDTOSchema = promptSchema
  .omit({ createdAt: true, updatedAt: true, creatorId: true })
  .extend({
    configs: z.array(
      promptConfigSchema
        .omit({ createdAt: true, updatedAt: true, promptId: true })
        .extend({
          values: z.array(
            configValueSchema.omit({
              createdAt: true,
              updatedAt: true,
              promptConfigId: true,
            }),
          ),
        }),
    ),
  });

export type PromptWithConfigsCreationDTO = z.infer<
  typeof promptWithConfigsCreationDTOSchema
>;

export const promptWithConfigsUpdateDTOSchema =
  promptWithConfigsCreationDTOSchema;

export type PromptWithConfigsUpdateDTO = z.infer<
  typeof promptWithConfigsUpdateDTOSchema
>;
