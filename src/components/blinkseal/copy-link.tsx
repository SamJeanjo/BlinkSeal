"use client";

import { Copy } from "lucide-react";
import { useState } from "react";

export function CopyLink({
  value,
  label,
  className = ""
}: {
  value: string;
  label?: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  return (
    <button
      type="button"
      className={`inline-flex h-9 items-center justify-center gap-2 rounded-lg px-3 text-sm font-medium text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700 focus-ring ${label ? "w-auto" : "w-9"} ${className}`}
      onClick={async () => {
        await navigator.clipboard.writeText(value);
        setCopied(true);
        setTimeout(() => setCopied(false), 1600);
      }}
      title={copied ? "Copied" : "Copy link"}
    >
      {!label && <Copy className="h-4 w-4" />}
      {label ? (copied ? "Copied" : label) : null}
    </button>
  );
}
