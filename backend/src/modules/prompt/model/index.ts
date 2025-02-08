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

export const promptCardSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  description: z.string(),
  stringTemplate: z.string(),
  creatorId: z.string().uuid(),
  createdAt: z.date().default(new Date()),
  updatedAt: z.date().default(new Date()),
  creator: z
    .object({
      id: z.string().uuid(),
      username: z.string().min(1, 'User name is required'),
    })
    .optional(),
  stars: z
    .array(
      z.object({
        promptId: z.string(),
        userId: z.string().uuid(),
        user: z.object({
          id: z.string().uuid(),
          username: z.string(),
        }),
      }),
    )
    .optional(),
});

export type PromptCard = z.infer<typeof promptCardSchema>;

export const promptUpdateDTOSchema = promptSchema.pick({
  title: true,
  description: true,
  stringTemplate: true,
  updatedAt: true,
});

export type PromptUpdateDTO = z.infer<typeof promptUpdateDTOSchema>;

export const promptCondDTOSchema = promptSchema.pick({ title: true }).partial();

export type PromptCondDTO = z.infer<typeof promptCondDTOSchema>;

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
