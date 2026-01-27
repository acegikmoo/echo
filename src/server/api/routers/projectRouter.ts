import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { db } from "~/server/db";
import { messages, projects } from "~/server/db/schema";
import { generateSlug } from "random-word-slugs"
import { inngest } from "~/server/inngest/client";
import { TRPCError } from "@trpc/server";

export const messageRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object(
        {
          value: z.string().min(1, { message: "Should be of min 1 length" }),
        }
      )
    ).mutation(async ({ input, ctx }) => {
      const [createdProject] = await db
        .insert(projects)
        .values({
          name: generateSlug(2, {
            format: "title"
          }),
          userId: ctx.session.user.id
        })
        .returning();

      await db.insert(messages).values({
        type: "RESULT",
        content: input.value,
        role: "USER",
        projectId: createdProject!.id
      });

      await inngest.send({
        name: "code-agent/run",
        data: {
          value: input.value,
          projectId: createdProject!.id,
        }
      });
      return createdProject;
    }),

  getMany: protectedProcedure
    .query(async ({ ctx }) => {
      const projects = await db.query.projects.findMany({
        where: (projects, { eq }) => eq(projects.userId, ctx.session.user.id),
        orderBy: (projects, { asc }) => [asc(projects.updatedAt)]
      });
      return projects;
    }),

  getOne: protectedProcedure
    .input(z.object({
      id: z.string().min(1, { message: "Id is required" })
    })).query(async ({ input, ctx }) => {
      const project = await db.query.projects.findFirst({
        where: (projects, { eq, and }) =>
          and(
            eq(projects.id, input.id),
            eq(projects.userId, ctx.session.user.id)
          ),
      });
      if (!project) {
        throw new TRPCError({ code: "NOT_FOUND", message: "project not found" })
      }
      return project
    })
})
