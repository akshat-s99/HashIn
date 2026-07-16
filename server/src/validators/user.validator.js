import { z } from 'zod';

export const updateProfileSchema = z.object({
  body: z.object({
    firstName: z.string().min(1, 'First name is required').optional(),
    lastName: z.string().min(1, 'Last name is required').optional(),
    headline: z.string().max(100, 'Headline cannot exceed 100 characters').optional(),
    location: z.string().max(100, 'Location cannot exceed 100 characters').optional(),
    about: z.string().max(500, 'About cannot exceed 500 characters').optional(),
    skills: z.array(z.string()).max(20, 'You can select up to 20 skills').optional(),
    links: z.object({
      github: z.string().url('Invalid GitHub URL').or(z.literal('')).optional(),
      linkedin: z.string().url('Invalid LinkedIn URL').or(z.literal('')).optional(),
      portfolio: z.string().url('Invalid Portfolio URL').or(z.literal('')).optional(),
    }).strict().optional(),
    experience: z.array(z.object({
      _id: z.string().optional(),
      title: z.string().min(1, 'Title is required'),
      company: z.string().min(1, 'Company is required'),
      startDate: z.string().optional(),
      endDate: z.string().optional(),
      current: z.boolean().optional(),
      description: z.string().optional()
    }).strict()).optional(),
    education: z.array(z.object({
      _id: z.string().optional(),
      school: z.string().min(1, 'School is required'),
      degree: z.string().optional(),
      fieldOfStudy: z.string().optional(),
      startDate: z.string().optional(),
      endDate: z.string().optional()
    }).strict()).optional()
  }).strict(),
});
