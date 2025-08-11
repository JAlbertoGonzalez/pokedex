import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";
import { languageRouter } from "./routers/language";
import { pokemonRouter } from "./routers/pokemon";
import { generationRouter } from "./routers/generation";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  pokemon: pokemonRouter,
  language: languageRouter,
  generation: generationRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
