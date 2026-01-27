import { serve } from "inngest/next";
import { inngest } from "~/server/inngest/client";
import { codeAgent } from "~/server/inngest/functions";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    codeAgent
  ]
})
