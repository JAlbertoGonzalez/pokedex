import { z } from "zod";

export const getGenerationsOutput = z.object({
  generation: z.array(
    z.object({
      id: z.number(),
      slug: z.string(), // alias de name
      es: z.array(z.object({ name: z.string() })).default([]), // generationnames (limit:1)
      region: z.object({
        id: z.number(),
        slug: z.string(), // alias de name
        en: z.array(z.object({ name: z.string() })).default([]), // regionnames (limit:1)
      }),
    })
  ),
});
