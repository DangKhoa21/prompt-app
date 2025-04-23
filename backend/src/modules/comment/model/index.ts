import z from 'zod';

export const ErrInvalidContent = new Error(
  'Content must be at least 10 characters long',
);
export const ErrInvalidParentId = new Error('Invalid parent id');
export const ErrCommentNotFound = new Error('Comment not found');

export const commentSchema = z.object({
  id: z.string().uuid(),
  content: z.string().min(1, ErrInvalidContent.message),
  parentId: z.string().uuid().nullable().optional(),
  promptId: z.string().uuid(),
  creatorId: z.string().uuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Comment = z.infer<typeof commentSchema>;

export type CommentCard = Comment & {
  creator: {
    id: string;
    username: string;
    avatarUrl: string | null;
  };
};

export const commentCreateDTOSchema = commentSchema.pick({
  parentId: true,
  content: true,
});

export type CommentCreateDTO = z.infer<typeof commentCreateDTOSchema>;

export const commentUpdateDTOSchema = commentSchema
  .pick({
    content: true,
  })
  .partial();

export type CommentUpdateDTO = z.infer<typeof commentUpdateDTOSchema>;

export const commentCondDTOSchema = commentSchema
  .pick({
    promptId: true,
    parentId: true,
  })
  .partial();

export type CommentCondDTO = z.infer<typeof commentCondDTOSchema>;
