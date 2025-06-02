import { z } from 'zod';
import { userSchema } from 'src/shared';

export const ErrInvalidEmailAndPassword = new Error(
  'Invalid email and password',
);

export const userRegisterDTOSchema = userSchema.pick({
  username: true,
  email: true,
  password: true,
});

export type UserRegisterDTO = z.infer<typeof userRegisterDTOSchema>;

export const userLoginDTOSchema = userRegisterDTOSchema.omit({
  username: true,
});

export type UserLoginDTO = z.infer<typeof userLoginDTOSchema>;

export type GooglePayload = {
  email: string;
  username: string;
  picture: string;
};
