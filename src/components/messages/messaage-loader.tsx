"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const Message = () => {
  const messages = [
    "Spinning up your website...",
    "Generating sections...",
    "Optimizing performance...",
    "Deploying the magic...",
    "Your site is almost ready.",
  ];
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessageIndex((prev) => (prev + 1) % messages.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [messages.length]);
  return (
    <div className="flex items-center gap-2">
      <span className="text-muted-foreground animate-false text-base">
        {messages[currentMessageIndex]}
      </span>
    </div>
  );
};

export const MessageLoading = () => {
  return (
    <div className="group flex flex-col px-2 pb-4">
      <div className="mb-2 flex items-center gap-2 pl-2">
        <Image
          src="/logo.svg"
          alt="logo"
          width={18}
          height={18}
          className="shrink-0"
        />
        <span className="text-sm font-medium">echo</span>
      </div>
      <div className="flex flex-col gap-y-4 pl-8.5">
        <Message />
      </div>
    </div>
  );
};
