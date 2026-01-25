import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { db } from "~/server/db";
import { messages } from "~/server/db/schema";
import { inngest } from "~/server/inngest/client";

export const messageRouter = createTRPCRouter({
  create: publicProcedure
    .input(
      z.object({
        value: z.string().min(1, { message: "should be of min 1 length" }),
        projectId: z.string().uuid(),
      }),
    )
    .mutation(async ({ input }) => {
      const [newMessage] = await db
        .insert(messages)
        .values({
          content: input.value,
          role: "USER",
          type: "RESULT",
          projectId: input.projectId,
        })
        .returning();

      await inngest.send({
        name: "code-agent/run",
        data: {
          value: input.value,
          messageId: newMessage!.id,
        },
      });

      return newMessage;
    }),

  getMany: publicProcedure
    .input(
      z.object({
        projectId: z.string().uuid(),
      }),
    )
    .query(async ({ input }) => {
      const allMessages = await db.query.messages.findMany({
        where: (messages, { eq }) => eq(messages.projectId, input.projectId),
        orderBy: (messages, { asc }) => [asc(messages.updatedAt)],
        with: {
          fragment: true,
        },
      });
      return allMessages;
    }),
});
