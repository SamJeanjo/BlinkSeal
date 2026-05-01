import { auth, currentUser } from "@clerk/nextjs/server";
import { ArrowRight, FileText, Search, Shield } from "lucide-react";
import { redirect } from "next/navigation";
import { requireCurrentUser } from "@/lib/auth/getCurrentUser";
import { getUserDocuments } from "@/lib/data";
import { Button } from "@/components/blinkseal/button";
import { CopyLink } from "@/components/blinkseal/copy-link";
import { StatusBadge } from "@/components/blinkseal/status-badge";
import { formatDate, getAppUrl } from "@/lib/format";
import { hasSupabaseAdminConfig } from "@/lib/supabase/admin";

export default async function DashboardPage() {
  const session = await auth();
  if (!session.userId) {
    redirect("/sign-in");
  }

  const clerkUser = await currentUser();
  let documents: any[] = [];

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
        <h1 className="mb-2 text-center text-2xl font-semibold text-slate-900">
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
    <div className="space-y-8">
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">My Files</h1>
          <p className="mt-0.5 text-sm text-slate-500">Your private documents</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-700">
            {documents.length} Document{documents.length === 1 ? "" : "s"}
          </span>
          <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-700">
            {documents.reduce((count, doc) => count + (doc.share_links?.length ?? 0), 0)} Links
          </span>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-sm outline-none focus:border-[#0066CC] focus:ring-2 focus:ring-[#0066CC]/15"
            placeholder="Search links..."
            readOnly
          />
        </div>
      </div>

      <div className="space-y-4">
        {documents.map((document) => {
          const latestLink = document.share_links?.[0];
          const shareUrl = latestLink ? `${getAppUrl()}/view/${latestLink.token}` : "";
          const views = document.share_links?.reduce(
            (sum: number, link: any) => sum + (link.view_events?.length ?? 0),
            0
          );

          return (
            <div
              key={document.id}
              className="overflow-hidden rounded-2xl border border-slate-200/60 bg-white p-5 transition-all duration-200 hover:border-slate-300 hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex min-w-0 flex-1 items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-slate-100 to-slate-50">
                    <FileText className="h-6 w-6 text-slate-400" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex flex-wrap items-center gap-2">
                      <h2 className="truncate font-medium text-slate-900">{document.file_name}</h2>
                      {latestLink ? (
                        <StatusBadge revoked={latestLink.revoked} expiresAt={latestLink.expires_at} />
                      ) : (
                        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                          No link
                        </span>
                      )}
                    </div>
                    <p className="mb-2 truncate font-mono text-sm text-slate-500">
                      {latestLink ? shareUrl : "Create a secure link to start tracking access"}
                    </p>
                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
                      <span>{views === 0 ? "No views yet" : `${views} verified view${views === 1 ? "" : "s"}`}</span>
                      <span>Uploaded {formatDate(document.created_at)}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {latestLink && <CopyLink value={shareUrl} />}
                  <Button href={`/dashboard/documents/${document.id}`} variant="outline" className="h-9">
                    View proof
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
