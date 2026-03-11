import { type fragments } from "@/server/db/schema";
import { api } from "@/trpc/react";
import { type InferSelectModel } from "drizzle-orm";
import { useEffect, useRef } from "react";
import { MessageLoading } from "./messaage-loader";
import { MessageCard } from "./message-card";

type Fragment = InferSelectModel<typeof fragments>;

export const MessageContainer = ({ projectId, activeFragment, setActiveFragment }: {
  projectId: string,
  activeFragment: Fragment | null,
  setActiveFragment: (fragment: Fragment | null) => void
}) => {
  const bottomRef = useRef<HTMLDivElement>(null);
  const lastMessageAssistantIdRef = useRef<string | null>(null);

  const [messages] = api.message.getMany.useSuspenseQuery(
    { projectId },
    { refetchInterval: 5000 }
  );

  useEffect(() => {
    const lastAssistantMessage = [...messages].reverse().find((message) => message.role === "ASSISTANT");

    if (lastAssistantMessage?.fragment && lastAssistantMessage.id !== lastMessageAssistantIdRef.current) {
      setActiveFragment(lastAssistantMessage.fragment);
      lastMessageAssistantIdRef.current = lastAssistantMessage.id;
    }
  }, [messages, setActiveFragment])

  useEffect(() => {
    bottomRef.current?.scrollIntoView();
  }, [messages.length])

  const lastMessage = messages[messages.length - 1];
  const isLastMessageUser = lastMessage?.role == "USER";

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <div className="flex-1 min-h-0 overflow-y-auto">
        <div className="pt-2 pr-1">
          {messages.map((message) => {
            return (
              <div
                key={message.id}
              >
                <MessageCard
                  key={message.id}
                  content={message.content}
                  role={message.role}
                  fragment={message.fragment}
                  createdAt={message.createdAt}
                  isActiveFragment={activeFragment?.id == message.fragment?.id}
                  onFragmentClick={() => setActiveFragment(message.fragment)}
                  type={message.type}
                />
              </div>
            )
          })}
          {isLastMessageUser && <MessageLoading />}
          <div ref={bottomRef} />
        </div>
      </div>
      <div className="relative p-3 pt-1">
        <div className="absolute -top-6 left-0 right-0 h-6 bg-gradient-to-b from-transaparent  to-background/70 pointer-events-none" />
        <MessageForm projectId={projectId} />
      </div>
    </div>
  )
}

