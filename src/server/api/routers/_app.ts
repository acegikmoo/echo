import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { projects } from "@/server/db/schema";
import { desc, eq } from "drizzle-orm";

export const postRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  create: protectedProcedure
    .input(z.object({ name: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(projects).values({
        name: input.name,
        userId: ctx.session.user.id,
      });
    }),

  getLatest: protectedProcedure.query(async ({ ctx }) => {
    const project = await ctx.db.query.projects.findFirst({
      where: eq(projects.userId, ctx.session.user.id),
      orderBy: [desc(projects.createdAt)],
    });
    return project ?? null;
  }),
});
