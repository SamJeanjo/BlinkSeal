import Link from "next/link";
import { ArrowLeft, CalendarClock, Copy, Eye, FileText, Link as LinkIcon, Shield, XCircle } from "lucide-react";
import { createShareLink, revokeShareLink } from "@/app/dashboard/documents/[id]/actions";
import { Button } from "@/components/blinkseal/button";
import { CopyLink } from "@/components/blinkseal/copy-link";
import { StatusBadge } from "@/components/blinkseal/status-badge";
import { requireCurrentUser } from "@/lib/auth/getCurrentUser";
import { getDocumentForOwner } from "@/lib/data";
import { formatDate, formatFileSize, getAppUrl } from "@/lib/format";

export default async function DocumentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await requireCurrentUser();
  const document = await getDocumentForOwner(id, user.id);
  const createAction = createShareLink.bind(null, document.id);

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-4">
        <Link href="/dashboard" className="flex items-center gap-1.5 text-sm text-slate-600 transition-colors hover:text-slate-900">
          <ArrowLeft className="h-4 w-4" />
          Documents
        </Link>
      </div>

      <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#22C55E]/10">
            <FileText className="h-7 w-7 text-[#22C55E]" />
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-2xl font-semibold text-slate-900">{document.file_name}</h1>
            <p className="mt-1 text-sm text-slate-500">
              {formatFileSize(document.file_size)} · {document.file_type || "Unknown type"} · Uploaded {formatDate(document.created_at)}
            </p>
          </div>
        </div>
      </div>

      <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="mb-1 text-lg font-semibold text-slate-900">Create secure link</h2>
        <p className="mb-5 text-sm text-slate-500">Set an optional expiration date. Access can be revoked at any time.</p>
        <form action={createAction} className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <label className="flex-1">
            <span className="mb-1.5 block text-sm font-medium text-slate-700">Expiration date</span>
            <input
              name="expires_at"
              type="datetime-local"
              className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-[#0066CC] focus:ring-2 focus:ring-[#0066CC]/15"
            />
          </label>
          <Button type="submit" variant="blue" className="h-10">
            <LinkIcon className="h-4 w-4" />
            Generate link
          </Button>
        </form>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Proof timeline</h2>
            <p className="text-sm text-slate-500">Every valid open is recorded here.</p>
          </div>
          <Shield className="h-5 w-5 text-slate-400" />
        </div>

        {!document.share_links?.length ? (
          <div className="rounded-xl bg-slate-50 p-8 text-center">
            <p className="font-medium text-slate-900">No secure links yet</p>
            <p className="mt-1 text-sm text-slate-500">Generate a link above to start tracking access.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {document.share_links.map((link: any) => {
              const shareUrl = `${getAppUrl()}/view/${link.token}`;
              const revokeAction = revokeShareLink.bind(null, document.id, link.id);

              return (
                <section key={link.id} className="rounded-xl border border-slate-100 bg-slate-50/70 p-4">
                  <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                    <div className="min-w-0">
                      <div className="mb-1 flex items-center gap-2">
                        <StatusBadge revoked={link.revoked} expiresAt={link.expires_at} />
                        <span className="text-xs text-slate-400">Created {formatDate(link.created_at)}</span>
                      </div>
                      <p className="truncate font-mono text-sm text-slate-600">{shareUrl}</p>
                      <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
                        <CalendarClock className="h-3.5 w-3.5" />
                        Expires: {formatDate(link.expires_at)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <CopyLink value={shareUrl} />
                      {!link.revoked && (
                        <form action={revokeAction}>
                          <button
                            type="submit"
                            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-red-50 hover:text-red-600 focus-ring"
                            title="Revoke link"
                          >
                            <XCircle className="h-4 w-4" />
                          </button>
                        </form>
                      )}
                    </div>
                  </div>

                  {link.view_events?.length ? (
                    <div className="space-y-3 border-t border-slate-200 pt-4">
                      {link.view_events.map((event: any) => (
                        <div key={event.id} className="flex items-start gap-3">
                          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-blue-50">
                            <Eye className="h-4 w-4 text-blue-600" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-medium text-slate-900">Opened</p>
                            <p className="truncate text-sm text-slate-500">
                              {event.ip_address || "Unknown IP"} · {event.user_agent || "Unknown device"}
                            </p>
                          </div>
                          <p className="whitespace-nowrap text-sm text-slate-500">{formatDate(event.viewed_at)}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="border-t border-slate-200 pt-4 text-sm text-slate-500">No activity yet.</div>
                  )}
                </section>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
