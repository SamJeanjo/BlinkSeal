"use client";

import { Copy, ExternalLink, Link2, Mail } from "lucide-react";
import { useMemo, useState } from "react";

type RecipientMessageProps = {
  shareUrl: string;
  displayUrl: string;
  fileName: string;
  title?: string | null;
  expiresAt?: string | null;
  allowDownload: boolean;
  viewLimit?: number | null;
};

function expirationLine(expiresAt?: string | null) {
  if (!expiresAt) return "This link does not currently have an expiration date.";
  return `This link expires on ${new Intl.DateTimeFormat("en", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short"
  }).format(new Date(expiresAt))}.`;
}

export function RecipientMessage({
  shareUrl,
  displayUrl,
  fileName,
  title,
  expiresAt,
  allowDownload,
  viewLimit
}: RecipientMessageProps) {
  const [copied, setCopied] = useState<"message" | "link" | null>(null);
  const documentLabel = title || fileName;
  const subject = `Secure document access: ${documentLabel}`;
  const message = useMemo(
    () =>
      [
        "Hello,",
        "",
        "Please use the secure BlinkSeal link below to access the document:",
        "",
        shareUrl,
        "",
        expirationLine(expiresAt),
        viewLimit ? `This link is limited to ${viewLimit} total view${viewLimit === 1 ? "" : "s"}.` : "Access may be revoked by the sender at any time.",
        allowDownload ? "Download is enabled for this link." : "Download is disabled; this is a view-only access link.",
        "",
        "For confidentiality and audit purposes, BlinkSeal records access events such as timestamp, browser/device metadata, and IP address.",
        "",
        "Thank you."
      ].join("\n"),
    [allowDownload, expiresAt, shareUrl, viewLimit]
  );
  const mailto = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;

  async function copy(value: string, type: "message" | "link") {
    await navigator.clipboard.writeText(value);
    setCopied(type);
    setTimeout(() => setCopied(null), 1600);
  }

  return (
    <section className="mt-6 rounded-2xl border border-slate-200 bg-slate-50/70 p-5">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <p className="inline-flex items-center gap-2 text-sm font-semibold text-slate-950">
            <Mail className="h-4 w-4 text-[#0066CC]" />
            Recipient message
          </p>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">
            Copy this into your email to send a clear, professional access note without attaching the file.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => copy(shareUrl, "link")}
            className="inline-flex h-9 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 focus-ring"
          >
            <Link2 className="h-4 w-4" />
            {copied === "link" ? "Link copied" : "Copy link"}
          </button>
          <a
            href={mailto}
            className="inline-flex h-9 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 focus-ring"
          >
            <ExternalLink className="h-4 w-4" />
            Open email draft
          </a>
          <button
            type="button"
            onClick={() => copy(`Subject: ${subject}\n\n${message}`, "message")}
            className="inline-flex h-9 items-center gap-2 rounded-lg bg-[#525F7F] px-3 text-sm font-semibold text-white shadow-sm hover:bg-[#47516D] focus-ring"
          >
            <Copy className="h-4 w-4" />
            {copied === "message" ? "Copied" : "Copy message"}
          </button>
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Subject</p>
        <p className="mt-1 text-sm font-semibold text-slate-950">{subject}</p>
        <div className="mt-4 border-t border-slate-100 pt-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Message</p>
          <pre className="mt-2 whitespace-pre-wrap font-sans text-sm leading-6 text-slate-700">{message.replace(shareUrl, displayUrl)}</pre>
        </div>
      </div>
    </section>
  );
}
