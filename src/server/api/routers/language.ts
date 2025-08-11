import { z } from "zod";
import { getLanguagesQuery } from "../../schemas/getLanguages.query";
import { createTRPCRouter, publicProcedure } from "../trpc";
// Tipado del output de getLanguages
export type GetLanguagesOutput = {
  language: {
    id: number;
    name: string;
    languagenames: {
      id: number;
      name: string;
    }[];
  }[];
};

export const languageRouter = createTRPCRouter({
  getLanguages: publicProcedure
    .input(z.void())
    .output(z.object({
      language: z.array(z.object({
        id: z.number(),
        name: z.string(),
        languagenames: z.array(z.object({
          id: z.number(),
          name: z.string(),
        })),
      })),
    }))
    .query(async ({ ctx }) => {
      const raw = await ctx.graphql.request(getLanguagesQuery);
      const data = z.object({
        language: z.array(z.object({
          id: z.number(),
          name: z.string(),
          languagenames: z.array(z.object({
            id: z.number(),
            name: z.string(),
          })),
        })),
      }).parse(raw);
      return data;
    })
});
