import { z } from "zod";

export const getAllInfiniteInputSchema = z.object({
  cursor: z.number().min(1).optional(),
  take: z.number().min(1).max(50).default(20),
  search: z.string().optional(),
  types: z.array(z.string()).optional(),
  language: z.string().optional(),
});
