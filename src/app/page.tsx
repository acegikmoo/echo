"use client";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { api } from "~/trpc/react";
import { useState } from "react";
import { toast } from "sonner";

export default function Home() {
  const [value, setValue] = useState("");
  const projectId = "";

  const { data: messages } = api.message.getMany.useQuery({
    projectId,
  });

  const utils = api.useUtils();

  const invoke = api.message.create.useMutation({
    onSuccess: async () => {
      toast.success("BG job started");
      setValue("");
      await utils.message.getMany.invalidate({ projectId });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return (
    <div className="space-y-4 p-8">
      <p>test</p>

      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Enter message..."
      />

      <Button
        onClick={() => {
          invoke.mutate({
            value: value,
            projectId,
          });
        }}
        disabled={invoke.isPending || !value}
      >
        {invoke.isPending ? "Sending..." : "Click"}
      </Button>

      <pre>{JSON.stringify(messages, null, 2)}</pre>
    </div>
  );
}
