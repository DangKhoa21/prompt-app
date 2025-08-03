import { z } from 'zod';

export const ErrAlreadyPinned = new Error('Already pinned');
export const ErrNotPinned = new Error("You didn't pin this prompt");
export const ErrMaxPins = new Error(
  'You have reached the maximum number of pins',
);

export const promptPinSchema = z.object({
  promptId: z.string().uuid(),
  userId: z.string().uuid(),
});

export type PromptPin = z.infer<typeof promptPinSchema>;
