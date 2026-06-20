import { z } from 'zod';

export const taskSchema = z.object({
  text: z
    .string({ required_error: 'Task text is required' })
    .min(1, 'Task text cannot be empty')
    .max(255, 'Task text must be 255 characters or less')
    .trim(),
  completed: z.boolean().optional()
});

export const updateSchema = z.object({
  text: z
    .string()
    .min(1, 'Task text cannot be empty')
    .max(255, 'Task text must be 255 characters or less')
    .trim()
    .optional(),
  completed: z.boolean().optional()
}).refine(
  data => data.text !== undefined || data.completed !== undefined,
  { message: 'At least one field (text or completed) must be provided' }
);
