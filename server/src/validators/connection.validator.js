import { z } from 'zod';
import { CONNECTION_STATUS } from '../config/constants.js';

export const updateConnectionSchema = z.object({
  body: z.object({
    status: z.enum([CONNECTION_STATUS.ACCEPTED, CONNECTION_STATUS.REJECTED]),
  }),
});
