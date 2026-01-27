import { postRouter } from "~/server/api/routers/_app";
import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { inngestRouter } from "./routers/inngest";
import { messageRouter } from "./routers/messageRouter";
import { projectRouter } from "./routers/projectRouter";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  post: postRouter,
  inngest: inngestRouter,
  message: messageRouter,
  project: projectRouter,
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
