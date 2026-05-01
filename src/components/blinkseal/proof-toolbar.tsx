"use client";

import { Award, Copy, FileDown } from "lucide-react";
import { useState } from "react";

export function ProofToolbar({ shareUrl, fileName }: { shareUrl: string; fileName: string }) {
  const [copied, setCopied] = useState(false);

  async function copyLink() {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  }

  return (
    <>
      <button
        type="button"
        onClick={copyLink}
        className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-[#525F7F] px-4 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#47516D] focus-ring"
      >
        <Copy className="h-4 w-4" />
        {copied ? "Copied" : "Copy client link"}
      </button>
      <button
        type="button"
        onClick={() => window.print()}
        className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-950 shadow-sm transition-colors hover:bg-slate-50 focus-ring"
      >
        <FileDown className="h-4 w-4" />
        Export audit proof (PDF)
      </button>
      <button
        type="button"
        onClick={() => window.print()}
        className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-950 shadow-sm transition-colors hover:bg-slate-50 focus-ring"
      >
        <Award className="h-4 w-4" />
        Access Certificate
      </button>
      <span className="sr-only">Access proof for {fileName}</span>
    </>
  );
}
