import { z } from 'zod';

export const createPostSchema = z.object({
  body: z.object({
    content: z.string().min(1, 'Post content is required').max(500, 'Post content cannot exceed 500 characters'),
  }),
});

export const commentSchema = z.object({
  body: z.object({
    content: z.string().min(1, 'Comment content is required').max(300, 'Comment content cannot exceed 300 characters'),
  }),
});
