import { auth, currentUser } from "@clerk/nextjs/server";
import { ArrowRight, BarChart3, Eye, FileText, Search, Shield } from "lucide-react";
import { redirect } from "next/navigation";
import { Button } from "@/components/blinkseal/button";
import { StatusBadge } from "@/components/blinkseal/status-badge";
import { requireCurrentUser } from "@/lib/auth/getCurrentUser";
import { getUserDocuments } from "@/lib/data";
import { formatDate, getAppUrl } from "@/lib/format";
import { hasSupabaseAdminConfig } from "@/lib/supabase/admin";

type ShareLinkWithEvents = {
  id: string;
  token: string;
  revoked: boolean;
  expires_at: string | null;
  allow_download: boolean;
  created_at: string;
  view_events?: { id: string; viewed_at: string }[];
};

type DashboardDocument = {
  id: string;
  file_name: string;
  file_type: string | null;
  created_at: string;
  share_links?: ShareLinkWithEvents[];
};

function getLatestLink(document: DashboardDocument) {
  return [...(document.share_links ?? [])].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  )[0];
}

function getAllEvents(document: DashboardDocument) {
  return (document.share_links ?? []).flatMap((link) => link.view_events ?? []);
}

function shortShareUrl(token: string) {
  return `${getAppUrl().replace(/^https?:\/\//, "")}/view/${token.slice(0, 10)}`;
}

export default async function DashboardPage() {
  const session = await auth();
  if (!session.userId) {
    redirect("/sign-in");
  }

  const clerkUser = await currentUser();
  let documents: DashboardDocument[] = [];

  if (hasSupabaseAdminConfig()) {
    try {
      const appUser = await requireCurrentUser();
      documents = await getUserDocuments(appUser.id);
    } catch (error) {
      console.error("[dashboard] Failed to load Supabase data", error);
      documents = [];
    }
  }

  if (documents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center px-4 py-20">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100">
          <Shield className="h-10 w-10 text-blue-600" />
        </div>
        <h1 className="mb-2 text-center text-2xl font-semibold text-slate-950">
          Send sensitive documents with confidence
        </h1>
        <p className="mb-8 max-w-md text-center text-slate-500">
          {clerkUser?.firstName ? `${clerkUser.firstName}, create` : "Create"} an expiring link and see exactly when it is opened.
        </p>
        <Button href="/dashboard/upload" variant="blue" className="h-11 rounded-xl px-5">
          Create your first secure link
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pt-4">
      <div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-[#525F7F]">Matter documents</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">Secure client links</h1>
          <p className="mt-1 text-sm text-slate-500">Private documents, access status, and proof timelines.</p>
        </div>
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            className="h-11 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-sm outline-none focus:border-[#0066CC] focus:ring-2 focus:ring-[#0066CC]/15"
            placeholder="Search links..."
            readOnly
          />
        </div>
      </div>

      <label className="flex items-center gap-4 border-b border-slate-200 pb-5 pl-3 text-base font-semibold text-[#344563]">
        <span className="grid h-6 w-6 place-items-center rounded border border-slate-400 bg-white" />
        Select all
      </label>

      <div className="space-y-6">
        {documents.map((document) => {
          const latestLink = getLatestLink(document);
          const events = getAllEvents(document).sort(
            (a, b) => new Date(b.viewed_at).getTime() - new Date(a.viewed_at).getTime()
          );
          const openedCount = events.length;
          const lastOpened = events[0]?.viewed_at;

          return (
            <article
              key={document.id}
              className="rounded-3xl border border-slate-200 bg-white px-7 py-7 shadow-sm transition-all hover:border-slate-300 hover:shadow-md"
            >
              <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                <div className="flex min-w-0 flex-1 items-start gap-6">
                  <span className="mt-4 grid h-6 w-6 flex-none place-items-center rounded border border-slate-400 bg-white" />
                  <div className="grid h-16 w-16 flex-none place-items-center rounded-2xl bg-slate-100">
                    <FileText className="h-8 w-8 text-slate-400" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="mb-2 flex flex-wrap items-center gap-3">
                      <h2 className="truncate text-xl font-semibold text-slate-950">{document.file_name}</h2>
                      {latestLink ? (
                        <StatusBadge revoked={latestLink.revoked} expiresAt={latestLink.expires_at} />
                      ) : (
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-600">
                          No link
                        </span>
                      )}
                    </div>
                    <p className="mb-4 truncate font-mono text-base text-[#52627A]">
                      {latestLink ? shortShareUrl(latestLink.token) : "Create a secure link to start tracking access"}
                    </p>
                    <p className="mb-4 text-base text-slate-400">
                      {latestLink
                        ? latestLink.allow_download
                          ? "Download allowed"
                          : "View-only access - download blocked"
                        : "No access rules set yet"}
                    </p>
                    <div className="flex flex-wrap items-center gap-7 text-sm text-slate-400">
                      <span className="inline-flex items-center gap-2">
                        <Eye className="h-4 w-4" />
                        Opened {openedCount} time{openedCount === 1 ? "" : "s"}
                      </span>
                      <span>
                        Last: {lastOpened ? `Opened - ${formatDate(lastOpened)}` : `Uploaded - ${formatDate(document.created_at)}`}
                      </span>
                    </div>
                  </div>
                </div>

                <Button
                  href={`/dashboard/documents/${document.id}`}
                  variant="outline"
                  className="h-12 rounded-lg px-5 text-base font-semibold lg:mr-44"
                >
                  <BarChart3 className="h-5 w-5" />
                  View proof
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
