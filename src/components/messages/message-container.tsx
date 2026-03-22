"use client";

import { type fragments } from "@/server/db/schema";
import { api } from "@/trpc/react";
import { type InferSelectModel } from "drizzle-orm";
import { useEffect, useRef, useState } from "react";
import { MessageLoading } from "./messaage-loader";
import { MessageCard } from "./message-card";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormField } from "../ui/form";
import { Button } from "../ui/button";
import { ArrowUpIcon, Loader2Icon } from "lucide-react";
import TextareaAutosize from "react-textarea-autosize";
import { cn } from "@/lib/utils";

type Fragment = InferSelectModel<typeof fragments>;


const formSchema = z.object({
  value: z.string().min(1),
});

function MessageForm({ projectId }: { projectId: string }) {
  const utils = api.useUtils();
  const [isFocused, setIsFocused] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { value: "" },
  });

  const createMessage = api.message.create.useMutation({
    onSuccess: async () => {
      form.reset();
      await utils.message.getMany.invalidate({ projectId });
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    createMessage.mutate({ value: values.value, projectId });
  };

  const isPending = createMessage.isPending;
  const disabled = isPending || !form.formState.isValid;

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn(
          "relative border p-4 pt-1 rounded-xl bg-sidebar transition-all",
          isFocused && "shadow-xs",
        )}
      >
        <FormField
          control={form.control}
          name="value"
          render={({ field }) => (
            <TextareaAutosize
              disabled={isPending}
              {...field}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              minRows={2}
              maxRows={6}
              className="pt-4 resize-none border-none w-full outline-none bg-transparent text-sm"
              placeholder="Ask a follow-up or request changes..."
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                  e.preventDefault();
                  form.handleSubmit(onSubmit)(e);
                }
              }}
            />
          )}
        />
        <div className="flex items-end justify-between pt-2">
          <span className="text-[10px] text-muted-foreground font-mono">
            <kbd className="inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 text-[10px] font-medium text-muted-foreground">
              <span>⌘</span>Enter
            </kbd>
            &nbsp;to submit
          </span>
          <Button
            disabled={disabled}
            className="w-10 h-10 rounded-sm bg-blue-500 hover:bg-blue-600"
          >
            {isPending ? (
              <Loader2Icon className="h-4 w-4 animate-spin" />
            ) : (
              <ArrowUpIcon className="h-4 w-4 stroke-[3]" />
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}

export const MessageContainer = ({
  projectId,
  activeFragment,
  setActiveFragment,
}: {
  projectId: string;
  activeFragment: Fragment | null;
  setActiveFragment: (fragment: Fragment | null) => void;
}) => {
  const bottomRef = useRef<HTMLDivElement>(null);
  const lastMessageAssistantIdRef = useRef<string | null>(null);

  const [messages] = api.message.getMany.useSuspenseQuery(
    { projectId },
    { refetchInterval: 5000 },
  );

  useEffect(() => {
    const lastAssistantMessage = [...messages]
      .reverse()
      .find((message) => message.role === "ASSISTANT");

    if (
      lastAssistantMessage?.fragment &&
      lastAssistantMessage.id !== lastMessageAssistantIdRef.current
    ) {
      setActiveFragment(lastAssistantMessage.fragment);
      lastMessageAssistantIdRef.current = lastAssistantMessage.id;
    }
  }, [messages, setActiveFragment]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView();
  }, [messages.length]);

  const lastMessage = messages[messages.length - 1];
  const isLastMessageUser = lastMessage?.role === "USER";

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <div className="flex-1 min-h-0 overflow-y-auto">
        <div className="pt-2 pr-1">
          {messages.map((message) => (
            <div key={message.id}>
              <MessageCard
                key={message.id}
                content={message.content}
                role={message.role}
                fragment={message.fragment}
                createdAt={message.createdAt}
                isActiveFragment={activeFragment?.id === message.fragment?.id}
                onFragmentClick={() => setActiveFragment(message.fragment)}
                type={message.type}
              />
            </div>
          ))}
          {isLastMessageUser && <MessageLoading />}
          <div ref={bottomRef} />
        </div>
      </div>
      <div className="relative p-3 pt-1">
        <div className="absolute -top-6 left-0 right-0 h-6 bg-gradient-to-b from-transparent to-background/70 pointer-events-none" />
        <MessageForm projectId={projectId} />
      </div>
    </div>
  );
};
