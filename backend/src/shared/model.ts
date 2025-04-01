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
  avatarUrl: z.string().nullable().optional(),
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

export const promptFilterDTOSchema = z.object({
  search: z.string().optional(),
  tagId: z.string().uuid().optional(),
  creatorId: z.string().uuid().optional(),
  sort: z.enum(['most-starred', 'newest', 'oldest']).optional(),
});

export type PromptFilterDTO = z.infer<typeof promptFilterDTOSchema>;

export const pagingDTOSchema = z.object({
  limit: z.coerce
    .number()
    .min(1, { message: 'Limit must be at least 1' })
    .max(20)
    .default(9),
  cursor: z.string().uuid().optional(),
});

export type PagingDTO = z.infer<typeof pagingDTOSchema>;

export type Paginated<E> = {
  data: E[];
  nextCursor?: string;
};

export interface TokenPayload {
  sub: string;
  username: string;
}

export type Requester = TokenPayload;

export interface ReqWithRequester {
  user: Requester;
}
export interface ReqWithRequesterOpt {
  user?: Requester;
}
