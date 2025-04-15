import { z } from 'zod';
import { userSchema } from 'src/shared';

export const ErrEmailExisted = new Error('Email is already existed');
export const ErrUserNotFound = new Error('User not found');

export type User = z.infer<typeof userSchema>;

export const userCreationDTOSchema = userSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type UserCreationDTO = z.infer<typeof userCreationDTOSchema>;

export const userUpdateDTOSchema = userSchema
  .pick({
    username: true,
    avatarUrl: true,
    bio: true,
  })
  .partial();

export type UserUpdateDTO = z.infer<typeof userUpdateDTOSchema>;

export const userCondDTOSchema = userSchema.pick({ email: true }).partial();

export type UserCondDTO = z.infer<typeof userCondDTOSchema>;
