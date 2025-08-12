import { getGenerationsQuery } from "@/server/schemas/getGenerations.query";
import { z } from "zod";
import type { GetGenerationsOutput } from "../../schemas/getGenerations.types";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const generationRouter = createTRPCRouter({
  getGenerations: publicProcedure
    .input(z.void())
    .output(z.object({
      generation: z.array(z.object({
        id: z.number(),
        name: z.string(),
        region_id: z.number(),
        region: z.object({ name: z.string() })
      }))
    }))
    .query(async ({ ctx }): Promise<GetGenerationsOutput> => {
      const raw = await ctx.graphql.request(getGenerationsQuery);
      // Tipado explícito con GetGenerationsOutput
      const data: GetGenerationsOutput = z.object({
        generation: z.array(z.object({
          id: z.number(),
          name: z.string(),
          region_id: z.number(),
          region: z.object({ name: z.string() })
        }))
      }).parse(raw);
      return data;
    })
});
