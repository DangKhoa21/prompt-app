import { z } from 'zod';

export const ErrAlreadyStarred = new Error('Already starred');
export const ErrNotStarred = new Error("You didn't star this prompt");

export const starSchema = z.object({
  promptId: z.string().uuid(),
  userId: z.string().uuid(),
});

export type Star = z.infer<typeof starSchema>;
