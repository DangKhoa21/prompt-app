import { z } from 'zod';

export const ErrOptionNotFound = new Error('Option not found');

export const optionSchema = z.object({
  id: z.string().uuid(),
  option: z.string(),
});

export type Option = z.infer<typeof optionSchema>;

export const optionCreateSchema = optionSchema.pick({
  option: true,
});

export type OptionCreateDTO = z.infer<typeof optionCreateSchema>;

export type OptionCondDTO = OptionCreateDTO;
