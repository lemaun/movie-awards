import { z } from 'zod';

export const yearParamSchema = z.object({
  year: z.string().regex(/^\d{4}$/, 'Year must be a 4-digit number'),
});

export const producerQuerySchema = z.object({
  name: z.string().min(1, 'Producer name is required'),
});

export type YearParam = z.infer<typeof yearParamSchema>;
export type ProducerQuery = z.infer<typeof producerQuerySchema>;
