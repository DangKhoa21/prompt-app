import { z } from 'zod';
import { Message as AiMessage } from 'ai';

export const ErrModelNotFound = new Error('Model not found');
export const ErrNoUserMessageFound = new Error('No user message found');

export type SendMessageDTO = {
  id: string;
  messages: Array<AiMessage>;
  modelId: string;
};

export const chatSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  userId: z.string().uuid(),
  createdAt: z.date().default(new Date()),
  updatedAt: z.date().default(new Date()),
});

export type Chat = z.infer<typeof chatSchema>;

export type Message = {
  id: string;
  chatId: string;
  content: unknown;
  role: string;
  createdAt: Date;
  updatedAt: Date;
};
