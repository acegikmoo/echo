import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { inngest } from "@/server/inngest/client";

export const inngestRouter = createTRPCRouter({
  callInngest: publicProcedure
    .input(z.object({ email: z.string() }))
    .mutation(async ({ input }) => {
      await inngest.send({
        name: "test/echo.chirp",
        data: { email: input.email },
      });
      return { status: "sent" };
    }),
});
