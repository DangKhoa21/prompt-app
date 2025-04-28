import { z } from 'zod';

export const ErrPromptExisted = new Error('Prompt is already existed');
export const ErrPromptNotFound = new Error('Prompt not found');

export const promptSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  description: z.string(),
  stringTemplate: z.string(),
  systemInstruction: z.string().nullable().optional(),
  exampleResult: z.unknown().nullable().optional(),
  usageCount: z.number().default(0),
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
  systemInstruction: true,
});

export type PromptUpdateDTO = z.infer<typeof promptUpdateDTOSchema>;

export const promptUpdateResultDTOSchema = promptSchema.pick({
  exampleResult: true,
  updatedAt: true,
});

export type PromptUpdateResultDTO = z.infer<typeof promptUpdateResultDTOSchema>;

export type PromptCondDTO = {
  search?: string;
  title?: string;
  promptIds?: string[];
  creatorId?: string;
  sort?: 'newest' | 'oldest' | 'most-starred';
};

export const promptConfigSchema = z.object({
  id: z.string().uuid(),
  label: z.string(),
  type: z.string(),
  info: z.unknown().optional(),
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
  info?: unknown;
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

export const promptWithConfigGenSchema = z.object({
  title: z
    .string()
    .describe('The title of the prompt, concise and descriptive'),
  description: z
    .string()
    .describe(
      'A detailed explanation of what this prompt does and how it should be used',
    ),
  stringTemplate: z
    .string()
    .describe(
      'The template string containing variables in ${varName} format that will be replaced with user-provided values. Example: "Help me translate this text ${Text} in ${Source Language} to ${Target Language}',
    ),
  systemInstruction: z
    .string()
    .describe(
      'An system instruction that provides context or guidelines for the AI. Example: "You are a helpful assistant. Keep your responses concise and helpful"',
    ),
  configs: z
    .array(
      z
        .object({
          label: z
            .string()
            .describe(
              'The identifier for this configuration field that matches a variable in stringTemplate. Example: "Input", "Source Language", "Target Language", etc.',
            ),
          type: z
            .enum(['dropdown', 'textarea', 'combobox', 'array'])
            .describe(
              'The UI component type to render for this configuration option, dropdown for choosing predefined values, combobox for choosing predefined values and can add new value, textarea for freeform text entry, and array for adding multiple values in a block.',
            ),
        })
        .extend({
          values: z
            .array(
              z.object({
                value: z
                  .string()
                  .describe(
                    'A possible value for this configuration option, example: "English", "Spanish", "French", etc. but not "None"',
                  ),
              }),
            )
            .describe('Available options/values for this configuration field'),
        })
        .describe('A single configuration field definition'),
    )
    .describe('Array of configuration options that users can customize'),
});

export const promptGenDTOSchema = z.object({
  prompt: z.string(),
});

export type PromptGenDTO = z.infer<typeof promptGenDTOSchema>;
