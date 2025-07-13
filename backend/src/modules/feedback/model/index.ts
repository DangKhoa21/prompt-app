import { z } from 'zod';

export const feedbackSchema = z.object({
  id: z.string().uuid(),
  message: z.string().min(1, 'Message is required'),
  email: z.string().email('Invalid email format'),
  createdAt: z.date().default(new Date()),
  updatedAt: z.date().default(new Date()),
});

export type Feedback = z.infer<typeof feedbackSchema>;

export const feedbackCreateSchema = feedbackSchema.pick({
  message: true,
  email: true,
});

export type FeedbackCreateDTO = z.infer<typeof feedbackCreateSchema>;
