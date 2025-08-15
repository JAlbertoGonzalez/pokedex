import { getGenerationsOutput } from "@/server/schemas/getGenerations.output";
import { getGenerationsQuery } from "@/server/schemas/getGenerations.query";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const generationRouter = createTRPCRouter({
  getGenerations: publicProcedure
    .input(z.void())
    .output(getGenerationsOutput)
    .query(async ({ ctx }) => {
      const raw = await ctx.graphql.request(getGenerationsQuery);
      const data = getGenerationsOutput.parse(raw);
      return data;
    }),
});
