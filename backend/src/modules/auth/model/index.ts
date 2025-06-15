import { z } from 'zod';
import { ErrPasswordAtLeast6Chars, userSchema } from 'src/shared';

export const ErrInvalidEmailAndPassword = new Error(
  'Invalid email and password',
);
export const ErrWrongOldPassword = new Error('Wrong old password');
export const ErrFailedToSendEmail = new Error('Failed to send email');

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

export const changePasswordDTOSchema = z.object({
  oldPassword: z.string().min(6, ErrPasswordAtLeast6Chars.message),
  newPassword: z.string().min(6, ErrPasswordAtLeast6Chars.message),
});

export type ChangePasswordDTO = z.infer<typeof changePasswordDTOSchema>;

export const forgotPasswordDTOSchema = userSchema.pick({
  email: true,
});

export type ForgotPasswordDTO = z.infer<typeof forgotPasswordDTOSchema>;

export const resetPasswordDTOSchema = z.object({
  token: z.string().min(1, { message: 'Token is required' }).jwt({
    message: 'Token is invalid',
  }),
  newPassword: z.string().min(6, ErrPasswordAtLeast6Chars.message),
});

export type ResetPasswordDTO = z.infer<typeof resetPasswordDTOSchema>;
