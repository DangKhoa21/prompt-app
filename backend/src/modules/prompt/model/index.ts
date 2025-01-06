import { z } from 'zod';

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

export const promptCreationDTOSchema = promptSchema.pick({
  title: true,
  description: true,
  stringTemplate: true,
  creatorId: true,
});

export type PromptCreationDTO = z.infer<typeof promptCreationDTOSchema>;

export const promptUpdateDTOSchema = promptSchema
  .pick({
    title: true,
    description: true,
    stringTemplate: true,
  })
  .partial();

export type PromptUpdateDTO = z.infer<typeof promptUpdateDTOSchema>;

export const promptCondDTOSchema = promptSchema.pick({ title: true });

export type PromptCondDTO = z.infer<typeof promptCondDTOSchema>;
