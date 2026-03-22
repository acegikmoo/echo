"use client";

import { useEffect } from "react";
import "./code-theme.css";
import Prism from "prismjs";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-tsx";
import "prismjs/components/prism-javascript";

export const CodeView = ({ code, lang }: { code: string; lang: string }) => {
  useEffect(() => {
    Prism.highlightAll();
  }, [code]);
  return (
    <pre className="m-0 rounded-none border-none bg-transparent p-2 text-xs">
      <code className={`language-${lang}`}>{code}</code>
    </pre>
  );
};
