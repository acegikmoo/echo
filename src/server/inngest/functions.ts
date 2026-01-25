/* eslint-disable */

import { inngest } from "./client";

export const workflow = inngest.createFunction(
  { id: "Tars" },
  { event: "test/echo.chirp" },
  async ({ event, step }) => {
    await step.sleep("wait-a-moment", "10s");
    return { message: `Hello ${event.data.email}!` };
  },
);
