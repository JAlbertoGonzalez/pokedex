import { z } from "zod";

export const getAllInfiniteInputSchema = z.object({
  limit: z.number().min(1).max(50).default(20),
  offset: z.number().min(0).default(0),
  nameRegex: z.string().default(".*"),
  generationIds: z.array(z.number()).default([1, 2, 3, 4, 5, 6, 7, 8, 9]),
  lang: z.string().default("es"),
  types: z.array(z.string()).optional(),
  mode: z.enum(["OR", "AND"]).default("OR"),
});
