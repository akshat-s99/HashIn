import { z } from 'zod';

export const updateProfileSchema = z.object({
  body: z.object({
    headline: z.string().max(100, 'Headline cannot exceed 100 characters').optional(),
    location: z.string().max(100, 'Location cannot exceed 100 characters').optional(),
    about: z.string().max(500, 'About cannot exceed 500 characters').optional(),
    skills: z.array(z.string()).max(20, 'You can select up to 20 skills').optional(),
    links: z.object({
      github: z.string().url('Invalid GitHub URL').or(z.literal('')).optional(),
      linkedin: z.string().url('Invalid LinkedIn URL').or(z.literal('')).optional(),
      portfolio: z.string().url('Invalid Portfolio URL').or(z.literal('')).optional(),
    }).optional(),
  }),
});
