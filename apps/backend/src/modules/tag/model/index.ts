import { z } from 'zod';

export const ErrTagNotFound = new Error('Tag not found');
export const ErrTagExisted = new Error('Tag is already existed');
export const ErrTagIsAlreadyAdded = new Error('Tag is already added');

export const tagSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  createdAt: z.date().default(new Date()),
  updatedAt: z.date().default(new Date()),
});

export type Tag = z.infer<typeof tagSchema>;

export const tagDTOSchema = tagSchema.pick({ name: true });

export type TagDTO = z.infer<typeof tagDTOSchema>;

export type TagCondDTO = TagDTO;

export const tagsToPromptDTOSchema = z.object({
  tagIds: z.array(z.string().uuid()),
});

export type TagsToPromptDTO = z.infer<typeof tagsToPromptDTOSchema>;

export const promptTagSchema = z.object({
  promptId: z.string().uuid(),
  tagId: z.string().uuid(),
});

export type PromptTag = z.infer<typeof promptTagSchema>;
