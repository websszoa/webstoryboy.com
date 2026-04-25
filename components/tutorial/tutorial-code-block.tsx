"use client";

import { useRef, useState } from "react";
import { Copy, Check } from "lucide-react";

interface PreWithCopyProps {
  children: React.ReactNode;
  [key: string]: unknown;
}

export function PreWithCopy({ children, ...preProps }: PreWithCopyProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const code = wrapperRef.current?.querySelector("code");
    const text = code?.textContent ?? "";
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div ref={wrapperRef} className="relative">
      <button
        type="button"
        onClick={handleCopy}
        className="absolute top-2 right-2 z-10 rounded-md border border-gray-200 bg-white/90 dark:bg-gray-800/90 dark:border-gray-600 p-1.5 text-muted-foreground hover:bg-gray-100 hover:text-foreground dark:hover:bg-gray-700 transition-colors"
        aria-label="Copy code"
      >
        {copied ? (
          <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
        ) : (
          <Copy className="w-4 h-4" />
        )}
      </button>
      <pre {...preProps}>{children}</pre>
    </div>
  );
}
