import Sandbox from "@e2b/code-interpreter";
import { AgentResult, type TextMessage } from "@inngest/agent-kit";

export default async function getSandbox(sandboxId: string) {
  const sandbox = await Sandbox.connect(sandboxId);
  await sandbox.setTimeout(60000 * 10)
  return sandbox;
}

export function lastMessageAssistant(result: AgentResult) {
  const assistantMessages = result.output.filter(
    (message) => message.role === "assistant"
  );

  if (assistantMessages.length === 0) return undefined;

  const message = assistantMessages[assistantMessages.length - 1] as TextMessage;
  return message?.content
    ? typeof message.content === "string"
      ? message.content
      : message.content.map((c) => c.text).join("")
    : undefined;
}
