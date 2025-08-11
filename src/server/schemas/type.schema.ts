import { z } from "zod";

export const typeOutputSchema = z.object({
  id: z.number(),
  name: z.string(),
  names: z.array(z.object({
    name: z.string(),
    language: z.object({
      name: z.string(),
      url: z.string().url(),
    })
  })),
  damage_relations: z.object({
    double_damage_from: z.array(z.object({ name: z.string(), url: z.string().url() })),
    double_damage_to: z.array(z.object({ name: z.string(), url: z.string().url() })),
    half_damage_from: z.array(z.object({ name: z.string(), url: z.string().url() })),
    half_damage_to: z.array(z.object({ name: z.string(), url: z.string().url() })),
    no_damage_from: z.array(z.object({ name: z.string(), url: z.string().url() })),
    no_damage_to: z.array(z.object({ name: z.string(), url: z.string().url() })),
  }),
  pokemon: z.array(z.object({
    pokemon: z.object({ name: z.string(), url: z.string().url() }),
    slot: z.number().optional(),
  })),
});
