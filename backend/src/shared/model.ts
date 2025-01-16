import { z } from 'zod';

export const ErrUsernameAtLeast3Chars = new Error(
  'Username must be at least 3 characters',
);
export const ErrUsernameAtMost25Chars = new Error(
  'Username must be at most 25 characters',
);
export const ErrUsernameInvalid = new Error(
  'Username must contain only letters, numbers and underscore (_)',
);
export const ErrPasswordAtLeast6Chars = new Error(
  'Password must be at least 6 characters',
);
export const ErrEmailInvalid = new Error('Email is invalid');
// export const ErrInvalidToken = new Error('Invalid token');

export const userSchema = z.object({
  id: z.string().uuid(),
  username: z
    .string()
    .min(3, ErrUsernameAtLeast3Chars.message)
    .max(25, ErrUsernameAtMost25Chars.message)
    .regex(/^[a-zA-Z0-9_]+$/, ErrUsernameInvalid.message),
  email: z.string().email(ErrEmailInvalid.message),
  password: z.string().min(6, ErrPasswordAtLeast6Chars.message),
  createdAt: z.date().default(new Date()),
  updatedAt: z.date().default(new Date()),
});

export interface TokenPayload {
  sub: string;
  username: string;
}

export type Requester = TokenPayload;

export interface ReqWithRequester {
  requester: Requester;
}
export interface ReqWithRequesterOpt {
  requester?: Requester;
}
