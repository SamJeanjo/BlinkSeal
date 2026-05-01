import { headers } from "next/headers";
import { AlertTriangle, Download, Eye, Shield } from "lucide-react";
import { LogoIcon } from "@/components/blinkseal/logo";
import { Button } from "@/components/blinkseal/button";
import { DOCUMENT_BUCKET, getSupabaseAdmin } from "@/lib/supabase/admin";
import { formatDate } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function PublicViewerPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;

  if (token === "test") {
    return <TestViewer />;
  }

  const requestHeaders = await headers();
  const supabase = getSupabaseAdmin();

  const { data: shareLink } = await supabase
    .from("share_links")
    .select("*, documents(*)")
    .eq("token", token)
    .maybeSingle();

  if (!shareLink || shareLink.revoked || (shareLink.expires_at && new Date(shareLink.expires_at).getTime() < Date.now())) {
    return <Unavailable />;
  }

  const document = shareLink.documents;
  const { data: signed, error } = await supabase.storage
    .from(DOCUMENT_BUCKET)
    .createSignedUrl(document.storage_path, 60 * 5);

  if (error || !signed?.signedUrl) {
    return <Unavailable message="This document could not be loaded. Please request a new link from the sender." />;
  }

  await supabase.from("view_events").insert({
    share_link_id: shareLink.id,
    ip_address:
      requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      requestHeaders.get("x-real-ip") ??
      null,
    user_agent: requestHeaders.get("user-agent"),
    referrer: requestHeaders.get("referer")
  });

  const isEmbeddable = document.file_type === "application/pdf" || document.file_type?.startsWith("image/");

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <div className="border-b border-slate-200/70 bg-white">
        <div className="mx-auto flex h-16 max-w-[1040px] items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <LogoIcon size={32} />
            <span className="font-medium text-slate-900">BlinkSeal</span>
          </div>
          <div className="hidden items-center gap-2 text-xs text-slate-500 sm:flex">
            <Shield className="h-4 w-4" />
            This session may be monitored. Activity is logged.
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[940px] px-4 py-6">
        <div className="mb-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div className="min-w-0">
              <h1 className="truncate font-semibold text-slate-900">{document.file_name}</h1>
              <p className="mt-1 text-xs text-slate-500">
                Secure access granted · Expires {formatDate(shareLink.expires_at)}
              </p>
            </div>
            <Button href={signed.signedUrl} variant="outline" className="h-9" >
              <Download className="h-4 w-4" />
              Download
            </Button>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-white p-4 shadow-xl shadow-slate-200/60">
          {isEmbeddable ? (
            document.file_type?.startsWith("image/") ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={signed.signedUrl} alt="Document preview" className="mx-auto max-h-[78vh] max-w-full select-none" />
            ) : (
              <iframe title="Document preview" src={signed.signedUrl} className="h-[78vh] w-full rounded-lg bg-slate-50" />
            )
          ) : (
            <div className="flex min-h-[360px] flex-col items-center justify-center text-center">
              <Eye className="mb-4 h-10 w-10 text-slate-400" />
              <h2 className="mb-2 text-xl font-semibold text-slate-900">This file is download-only</h2>
              <p className="mb-6 max-w-md text-sm text-slate-500">
                Secure preview is available for PDF and image files. This access has been recorded.
              </p>
              <Button href={signed.signedUrl} variant="blue">
                Download file
              </Button>
            </div>
          )}
        </div>

        <div className="mt-6 flex items-center justify-between rounded-xl border border-slate-200 bg-white px-5 py-3 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
            <div className="h-2 w-2 rounded-full bg-emerald-500" />
            Viewing recorded
          </div>
          <p className="text-xs text-slate-400">Powered by BlinkSeal</p>
        </div>
      </div>
    </main>
  );
}

function TestViewer() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <div className="border-b border-slate-200/70 bg-white">
        <div className="mx-auto flex h-16 max-w-[1040px] items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <LogoIcon size={32} />
            <span className="font-medium text-slate-900">BlinkSeal</span>
          </div>
          <div className="hidden items-center gap-2 text-xs text-slate-500 sm:flex">
            <Shield className="h-4 w-4" />
            Public viewer test
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-[940px] px-4 py-6">
        <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-white p-10 text-center shadow-xl shadow-slate-200/60">
          <LogoIcon size={56} />
          <h1 className="mt-5 text-2xl font-semibold text-slate-900">Secure viewer ready</h1>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
            This public test page confirms the BlinkSeal viewer route renders without authentication.
            Real document links validate tokens server-side and use private Supabase signed URLs.
          </p>
        </div>
        <div className="mt-6 flex items-center justify-between rounded-xl border border-slate-200 bg-white px-5 py-3 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
            <div className="h-2 w-2 rounded-full bg-emerald-500" />
            Viewer route online
          </div>
          <p className="text-xs text-slate-400">Powered by BlinkSeal</p>
        </div>
      </div>
    </main>
  );
}

function Unavailable({ message = "This link is expired, revoked, or no longer available." }: { message?: string }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F9FAFB] p-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-200/60 bg-white p-8 text-center shadow-xl shadow-slate-200/50">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
          <AlertTriangle className="h-8 w-8 text-slate-400" />
        </div>
        <h1 className="mb-2 text-xl font-semibold text-slate-900">Link unavailable</h1>
        <p className="text-slate-500">{message}</p>
      </div>
    </main>
  );
}
