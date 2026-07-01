import { z } from 'zod';
import { SWIPE_ACTION } from '../config/constants.js';

export const swipeSchema = z.object({
  body: z.object({
    swipedId: z.string().length(24, 'Invalid user ID format'),
    action: z.enum(Object.values(SWIPE_ACTION)),
  }),
});
