"use client";

import { Copy } from "lucide-react";
import { useState } from "react";

export function CopyLink({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <button
      type="button"
      className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700 focus-ring"
      onClick={async () => {
        await navigator.clipboard.writeText(value);
        setCopied(true);
        setTimeout(() => setCopied(false), 1600);
      }}
      title={copied ? "Copied" : "Copy link"}
    >
      <Copy className="h-4 w-4" />
    </button>
  );
}
