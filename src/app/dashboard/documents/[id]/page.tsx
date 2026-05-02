import Link from "next/link";
import {
  ArrowLeft,
  BarChart3,
  Check,
  ChevronUp,
  Clock3,
  Download,
  Eye,
  FileText,
  Globe2,
  KeyRound,
  ListChecks,
  Monitor,
  Shield,
  Smartphone,
  Zap,
  Users
} from "lucide-react";
import { createShareLink, issueAccessCertificate, recordTestView, revokeShareLink } from "@/app/dashboard/documents/[id]/actions";
import { Button } from "@/components/blinkseal/button";
import { CopyLink } from "@/components/blinkseal/copy-link";
import { ProofToolbar } from "@/components/blinkseal/proof-toolbar";
import { RecipientMessage } from "@/components/blinkseal/recipient-message";
import { StatusBadge } from "@/components/blinkseal/status-badge";
import { requireCurrentUser } from "@/lib/auth/getCurrentUser";
import { getDocumentForOwner } from "@/lib/data";
import { formatDate, getAppUrl, isExpired } from "@/lib/format";

type ViewEvent = {
  id: string;
  viewed_at: string;
  ip_address: string | null;
  user_agent: string | null;
  referrer: string | null;
};

type ShareLink = {
  id: string;
  token: string;
  title: string | null;
  expires_at: string | null;
  revoked: boolean;
  view_limit: number | null;
  one_time_access: boolean;
  allow_download: boolean;
  created_at: string;
  view_events?: ViewEvent[];
};

type DocumentWithLinks = {
  id: string;
  file_name: string;
  file_type: string | null;
  file_size: number | null;
  storage_path: string;
  created_at: string;
  share_links?: ShareLink[];
};

function latestLink(document: DocumentWithLinks) {
  return [...(document.share_links ?? [])].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  )[0];
}

function allEvents(link: ShareLink | undefined) {
  return [...(link?.view_events ?? [])].sort(
    (a, b) => new Date(b.viewed_at).getTime() - new Date(a.viewed_at).getTime()
  );
}

function eventDevice(userAgent: string | null) {
  if (!userAgent) return "Unknown device";
  if (/iphone|android|mobile/i.test(userAgent)) return "Mobile";
  if (/ipad|tablet/i.test(userAgent)) return "Tablet";
  return "Desktop";
}

function eventBrowser(userAgent: string | null) {
  if (!userAgent) return "Unknown";
  if (/edg/i.test(userAgent)) return "Edge";
  if (/chrome|crios/i.test(userAgent)) return "Chrome";
  if (/firefox|fxios/i.test(userAgent)) return "Firefox";
  if (/safari/i.test(userAgent)) return "Safari";
  return "Browser";
}

function formatFullDate(value: string | null | undefined) {
  if (!value) return "None";
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: "America/New_York",
    timeZoneName: "shortOffset"
  }).format(new Date(value));
}

function formatUtc(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: "UTC",
    timeZoneName: "short"
  }).format(new Date(value));
}

function countUnique(events: ViewEvent[]) {
  return new Set(events.map((event) => event.ip_address || event.user_agent || event.id)).size;
}

function countBy<T extends string>(items: T[]) {
  return items.reduce<Record<string, number>>((acc, item) => {
    acc[item] = (acc[item] ?? 0) + 1;
    return acc;
  }, {});
}

function shortShareUrl(token: string) {
  return `${getAppUrl().replace(/^https?:\/\//, "")}/view/${token}`;
}

export default async function DocumentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await requireCurrentUser();
  const document = (await getDocumentForOwner(id, user.id)) as DocumentWithLinks;
  const link = latestLink(document);
  const events = allEvents(link);
  const shareUrl = link ? `${getAppUrl()}/view/${link.token}` : "";
  const displayUrl = link ? shortShareUrl(link.token) : "";
  const createAction = createShareLink.bind(null, document.id);
  const revokeAction = link ? revokeShareLink.bind(null, document.id, link.id) : null;
  const testAction = link ? recordTestView.bind(null, document.id, link.id) : null;
  const certificateAction = link ? issueAccessCertificate.bind(null, document.id, link.id) : null;
  const active = Boolean(link && !link.revoked && !isExpired(link.expires_at));
  const uniqueOpens = countUnique(events);
  const lastEvent = events[0];
  const deviceCounts = countBy(events.map((event) => eventDevice(event.user_agent)));
  const browserCounts = countBy(events.map((event) => eventBrowser(event.user_agent)));
  const ipCounts = countBy(events.map((event) => event.ip_address || "Unknown IP"));

  return (
    <div className="mx-auto max-w-[1280px] space-y-10 pb-12">
      <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-950">
        <ArrowLeft className="h-4 w-4" />
        Documents
      </Link>

      <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-start">
        <div className="max-w-[430px]">
          <h1 className="text-4xl font-semibold tracking-tight text-slate-950">{link ? "Access Proof" : "Link Settings"}</h1>
          <p className="mt-3 text-lg leading-7 text-[#64748B]">
            {link
              ? "Access activity is system-logged automatically and appended in real time. Records are preserved for compliance, audit, and evidentiary review."
              : "Set the terms of access before creating a client link. For legal workflows, this deliberate review step is worth keeping."}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {testAction && (
            <form action={testAction}>
              <button type="submit" className="h-11 px-2 text-sm font-semibold text-slate-400 hover:text-slate-700">
                Run Test
              </button>
            </form>
          )}
          {link && <ProofToolbar shareUrl={shareUrl} fileName={document.file_name} />}
          {certificateAction && (
            <form action={certificateAction}>
              <button
                type="submit"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-950 shadow-sm transition-colors hover:bg-slate-50 focus-ring"
              >
                <Shield className="h-4 w-4" />
                Issue Verified Certificate
              </button>
            </form>
          )}
          {active && revokeAction && (
            <form action={revokeAction}>
              <button
                type="submit"
                className="inline-flex h-11 items-center justify-center rounded-lg border border-red-200 bg-white px-4 text-sm font-semibold text-red-600 shadow-sm transition-colors hover:bg-red-50 focus-ring"
              >
                Revoke link
              </button>
            </form>
          )}
        </div>
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex items-start justify-between gap-5">
          <div>
            <h2 className="text-2xl font-semibold text-slate-950">{link?.title || document.file_name}</h2>
            <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-emerald-300 bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700">
              <Shield className="h-4 w-4" />
              {link?.allow_download ? "Client View (Download Allowed)" : "Client View (View Only)"}
            </div>
          </div>
          {link && <StatusBadge revoked={link.revoked} expiresAt={link.expires_at} />}
        </div>

        {link ? (
          <div className="mt-7">
            <p className="mb-3 text-sm font-semibold text-slate-800">Client Access Link</p>
            <div className="flex h-14 items-center justify-between rounded-lg bg-slate-50 px-4">
              <p className="truncate font-mono text-base text-slate-950">{displayUrl}</p>
              <CopyLink value={shareUrl} label="Copy" className="text-blue-600 hover:bg-blue-50 hover:text-blue-700" />
            </div>
            <details className="mt-3 text-sm text-slate-500">
              <summary className="cursor-pointer">Show full link</summary>
              <p className="mt-2 break-all font-mono text-xs">{shareUrl}</p>
            </details>
            <div className="mt-5 flex flex-wrap gap-3">
              <span className="rounded-md border border-slate-950 px-3 py-1 text-sm font-semibold">Expiration: {formatDate(link.expires_at)}</span>
              <span className="rounded-md border border-slate-950 px-3 py-1 text-sm font-semibold">Download: {link.allow_download ? "Allowed" : "Blocked"}</span>
              <span className="rounded-md border border-slate-950 px-3 py-1 text-sm font-semibold">Access: {link.allow_download ? "Preview + download" : "View-only"}</span>
              <span className="rounded-md border border-slate-950 px-3 py-1 text-sm font-semibold">View limit: {link.view_limit ?? "Unlimited"}</span>
            </div>
            <RecipientMessage
              shareUrl={shareUrl}
              displayUrl={displayUrl}
              fileName={document.file_name}
              title={link.title}
              expiresAt={link.expires_at}
              allowDownload={link.allow_download}
              viewLimit={link.view_limit}
            />
          </div>
        ) : (
          <form action={createAction} className="mt-8 space-y-8">
            <div className="mx-auto mb-4 flex max-w-lg items-center justify-center gap-3 text-sm font-semibold">
              <StepBadge complete>1</StepBadge>
              <span className="text-slate-500">Upload</span>
              <span className="h-px w-14 bg-slate-200" />
              <StepBadge active>2</StepBadge>
              <span className="text-slate-950">Settings</span>
              <span className="h-px w-14 bg-slate-200" />
              <StepBadge>3</StepBadge>
              <span className="text-slate-500">Share & Track</span>
            </div>

            <div className="rounded-2xl bg-slate-50 p-5">
              <div className="flex items-center gap-4">
                <div className="grid h-12 w-12 place-items-center rounded-xl bg-white">
                  <Check className="h-5 w-5 text-emerald-600" />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-lg font-semibold text-slate-950">{document.file_name}</p>
                  <p className="text-sm text-slate-500">
                    {document.file_size ? `${(document.file_size / 1024).toFixed(1)} KB` : "Uploaded"}{" "}
                    <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700">
                      Preview: {document.file_type?.startsWith("image/") ? "Image" : document.file_type === "application/pdf" ? "PDF" : "File"}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            <section className="rounded-2xl border border-slate-200 bg-white p-6">
              <h3 className="text-xl font-semibold text-slate-950">Link Details</h3>
              <label className="mt-6 block">
                <span className="mb-2 block text-sm font-semibold text-slate-950">Title (optional)</span>
                <input
                  name="title"
                  placeholder="e.g., Signed Engagement Letter"
                  className="h-12 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-[#0066CC] focus:ring-2 focus:ring-[#0066CC]/15"
                />
              </label>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-6">
              <h3 className="mb-6 text-xl font-semibold text-slate-950">Access Rules</h3>
              <div className="space-y-6">
                <AccessRule
                  icon={<Clock3 className="h-5 w-5 text-amber-500" />}
                  tone="bg-amber-50"
                  title="Expiration"
                  body="Stops working after the selected date"
                  control={
                    <div className="flex flex-col items-end gap-2 sm:flex-row sm:items-center">
                      <input type="checkbox" name="expiration_enabled" className="h-5 w-5 accent-[#0066CC]" />
                      <input
                        name="expires_at"
                        type="datetime-local"
                        className="h-10 rounded-lg border border-slate-200 px-3 text-sm"
                      />
                    </div>
                  }
                />
                <AccessRule
                  icon={<Eye className="h-5 w-5 text-[#525F7F]" />}
                  tone="bg-slate-100"
                  title="View limit"
                  body="Maximum total opens across all recipients"
                  control={
                    <div className="flex items-center gap-2">
                      <input type="checkbox" name="view_limit_enabled" className="h-5 w-5 accent-[#0066CC]" />
                      <input
                        name="view_limit"
                        type="number"
                        min={1}
                        placeholder="10"
                        className="h-10 w-20 rounded-lg border border-slate-200 px-3 text-sm"
                      />
                    </div>
                  }
                />
                <AccessRule
                  icon={<Zap className="h-5 w-5 text-[#525F7F]" />}
                  tone="bg-slate-100"
                  title="One-time access"
                  body="Automatically blocks the link after the first successful open"
                  control={<input type="checkbox" name="one_time_access" className="h-5 w-5 accent-[#0066CC]" />}
                />
                <AccessRule
                  icon={<KeyRound className="h-5 w-5 text-red-500" />}
                  tone="bg-red-50"
                  title="Passcode Protection"
                  body="Planned next: require a passcode before the viewer loads"
                  control={<span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-400">Next</span>}
                />
                <AccessRule
                  icon={<Download className="h-5 w-5 text-emerald-600" />}
                  tone="bg-emerald-50"
                  title="Allow Download"
                  body="Show a download button in the secure viewer"
                  control={<input type="checkbox" name="allow_download" defaultChecked className="h-5 w-5 accent-[#111827]" />}
                />
                <AccessRule
                  icon={<Globe2 className="h-5 w-5 text-[#525F7F]" />}
                  tone="bg-slate-100"
                  title="IP Allowlist"
                  body="Planned next: restrict access to specific IP addresses"
                  control={<span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-400">Next</span>}
                />
              </div>
            </section>

            <Button type="submit" variant="blue" className="h-14 w-full rounded-lg text-base font-semibold">
              Create Secure Link
              <ListChecks className="h-5 w-5" />
            </Button>
          </form>
        )}
      </section>

      {link && (
        <>
          <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            <h2 className="mb-7 text-lg font-semibold text-slate-950">Access Summary</h2>
            <div className="grid gap-8 lg:grid-cols-[1fr_1.4fr]">
              <div className="space-y-4">
                <SummaryRow label="Link Status">
                  <StatusBadge revoked={link.revoked} expiresAt={link.expires_at} />
                </SummaryRow>
                <SummaryRow label="Created">{formatFullDate(link.created_at)}</SummaryRow>
                <SummaryRow label="Expiration">{formatDate(link.expires_at)}</SummaryRow>
                <SummaryRow label="View Limit">{link.view_limit ?? "Unlimited"}</SummaryRow>
                <SummaryRow label="Download Button">{link.allow_download ? "Shown" : "Hidden"}</SummaryRow>
              </div>
              <div>
                <p className="text-sm text-slate-500">Last Activity</p>
                <p className="mt-1 text-lg text-slate-950">{lastEvent ? "Opened" : "No opens yet"}</p>
                <p className="text-sm text-[#64748B]">{lastEvent ? formatFullDate(lastEvent.viewed_at) : "Waiting for first recipient view"}</p>
                <div className="mt-9 grid max-w-lg grid-cols-3 gap-10">
                  <Metric value={uniqueOpens} label="Unique Opens" />
                  <Metric value={0} label="Downloads" />
                  <Metric value={0} label="Blocked" />
                </div>
              </div>
            </div>
            <p className="mt-7 border-t border-slate-200 pt-6 text-sm text-[#64748B]">
              Metrics computed from event stream in real time. Export includes UTC timestamps and raw event history.
            </p>
          </section>

          <details open className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            <summary className="flex cursor-pointer list-none items-center justify-between border-b border-slate-100 pb-7">
              <span className="inline-flex items-center gap-3 text-lg font-semibold text-slate-950">
                <BarChart3 className="h-5 w-5 text-[#64748B]" />
                View Analytics
                <span className="rounded-full border border-amber-300 bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-700">PRO</span>
              </span>
              <span className="grid h-6 w-6 place-items-center text-slate-400">
                <ChevronUp className="h-4 w-4" />
              </span>
            </summary>
            <div className="pt-6">
              <div className="grid gap-5 md:grid-cols-3">
                <AnalyticsCard icon={<Eye className="h-6 w-6" />} value={events.length} label="Total Views" />
                <AnalyticsCard icon={<Users className="h-6 w-6" />} value={uniqueOpens} label="Unique Viewers" />
                <AnalyticsCard icon={<span className="text-3xl font-semibold">{lastEvent ? new Date(lastEvent.viewed_at).toLocaleDateString("en") : "-"}</span>} value="" label="Last View" />
              </div>
              <div className="mt-9 min-h-44">
                <p className="text-sm font-semibold uppercase tracking-wide text-slate-800">Views over time (14 days)</p>
                <div className="mt-5 h-32 rounded-lg bg-[linear-gradient(to_right,transparent_0,transparent_24%,#e2e8f0_24.2%,transparent_24.6%,transparent_49%,#e2e8f0_49.2%,transparent_49.6%,transparent_74%,#e2e8f0_74.2%,transparent_74.6%),linear-gradient(to_top,#f1f5f9_1px,transparent_1px)] bg-[length:100%_100%,100%_33%]" />
              </div>
              <div className="mt-8 grid gap-10 md:grid-cols-2">
                <Breakdown title="Device Types" icon={<Monitor className="h-4 w-4" />} counts={deviceCounts} total={events.length} />
                <Breakdown title="Browsers" icon={<Globe2 className="h-4 w-4" />} counts={browserCounts} total={events.length} />
              </div>
              <div className="mt-8">
                <p className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-800">Top Viewer IPs</p>
                <div className="space-y-2">
                  {Object.entries(ipCounts).length ? (
                    Object.entries(ipCounts).map(([ip, count]) => (
                      <div key={ip} className="flex items-center justify-between rounded-lg bg-slate-50 px-4 py-3 text-sm">
                        <span className="inline-flex items-center gap-3 font-mono text-slate-700">
                          <Smartphone className="h-4 w-4 text-slate-400" />
                          {ip}
                        </span>
                        <span className="rounded-full bg-slate-200 px-3 py-1 font-semibold text-slate-900">
                          {count} view{count === 1 ? "" : "s"}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="rounded-lg bg-slate-50 px-4 py-3 text-sm text-slate-500">No viewer IPs yet.</p>
                  )}
                </div>
              </div>
            </div>
          </details>

          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="grid w-full grid-cols-4 rounded-lg bg-slate-100 p-1 text-sm font-semibold text-slate-500 lg:max-w-lg">
              {["All", "Opens", "Downloads", "Failures"].map((tab) => (
                <span key={tab} className={`rounded-md px-4 py-2 text-center ${tab === "All" ? "bg-white text-slate-950 shadow-sm" : ""}`}>
                  {tab}
                </span>
              ))}
            </div>
            <input
              readOnly
              placeholder="Search IP / device"
              className="h-12 rounded-lg border border-slate-200 bg-white px-4 text-sm outline-none lg:w-80"
            />
          </div>

          <section className="rounded-2xl border border-slate-950 bg-white p-8">
            <div className="mb-8 flex items-start justify-between gap-5">
              <div>
                <h2 className="text-2xl font-semibold text-slate-950">Access Timeline</h2>
                <p className="mt-1 text-sm text-[#64748B]">
                  Displayed in <span className="font-semibold">America/New_York</span>. Exports use UTC.
                </p>
              </div>
              <div className="rounded-lg bg-slate-100 p-1 text-sm font-semibold">
                <span className="inline-flex rounded-md bg-white px-4 py-2 shadow-sm">Local</span>
                <span className="inline-flex px-4 py-2 text-slate-500">UTC</span>
              </div>
            </div>
            {events.length ? (
              <div className="space-y-8">
                {events.map((event) => (
                  <div key={event.id} className="grid gap-4 md:grid-cols-[1fr_auto]">
                    <div className="flex gap-5">
                      <span className="grid h-12 w-12 flex-none place-items-center rounded-lg bg-blue-50">
                        <Eye className="h-5 w-5 text-blue-600" />
                      </span>
                      <div>
                        <p className="text-xl font-semibold text-slate-950">Opened</p>
                        <p className="mt-1 text-base text-[#64748B]">Recipient opened the link</p>
                        <p className="mt-1 text-sm text-slate-400">
                          {event.ip_address || "Unknown IP"} - {eventBrowser(event.user_agent)} on {eventDevice(event.user_agent)}
                        </p>
                      </div>
                    </div>
                    <div className="text-left md:text-right">
                      <p className="text-lg text-slate-950">{formatFullDate(event.viewed_at)}</p>
                      <p className="mt-1 text-sm text-[#64748B]">{formatDate(event.viewed_at)}</p>
                      <p className="text-sm text-slate-400">{formatUtc(event.viewed_at)}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-xl bg-slate-50 p-8 text-center text-slate-500">No access activity yet.</div>
            )}
          </section>
        </>
      )}
    </div>
  );
}

function StepBadge({
  children,
  active,
  complete
}: {
  children: React.ReactNode;
  active?: boolean;
  complete?: boolean;
}) {
  return (
    <span
      className={`grid h-9 w-9 place-items-center rounded-full ${
        complete ? "bg-emerald-500 text-white" : active ? "bg-[#0066CC] text-white" : "bg-slate-200 text-slate-500"
      }`}
    >
      {complete ? <Check className="h-5 w-5" /> : children}
    </span>
  );
}

function AccessRule({
  icon,
  tone,
  title,
  body,
  control
}: {
  icon: React.ReactNode;
  tone: string;
  title: string;
  body: string;
  control: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-4">
        <span className={`grid h-11 w-11 flex-none place-items-center rounded-lg ${tone}`}>{icon}</span>
        <div>
          <p className="font-semibold text-slate-950">{title}</p>
          <p className="text-sm text-[#64748B]">{body}</p>
        </div>
      </div>
      <div className="sm:min-w-[260px] sm:text-right">{control}</div>
    </div>
  );
}

function SummaryRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-sm text-slate-500">{label}</p>
      <div className="mt-1 text-lg text-slate-950">{children}</div>
    </div>
  );
}

function Metric({ value, label }: { value: string | number; label: string }) {
  return (
    <div>
      <p className="text-3xl font-semibold text-slate-950">{value}</p>
      <p className="mt-1 text-sm text-[#64748B]">{label}</p>
    </div>
  );
}

function AnalyticsCard({
  icon,
  value,
  label
}: {
  icon: React.ReactNode;
  value: string | number;
  label: string;
}) {
  return (
    <div className="rounded-lg bg-slate-50 p-7 text-center">
      <div className="mb-3 flex justify-center text-slate-400">{icon}</div>
      {value !== "" && <p className="text-3xl font-semibold text-slate-950">{value}</p>}
      <p className="text-sm text-[#64748B]">{label}</p>
    </div>
  );
}

function Breakdown({
  title,
  icon,
  counts,
  total
}: {
  title: string;
  icon: React.ReactNode;
  counts: Record<string, number>;
  total: number;
}) {
  const entries = Object.entries(counts);
  return (
    <div>
      <p className="mb-4 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-slate-800">
        {icon}
        {title}
      </p>
      <div className="space-y-3">
        {entries.length ? (
          entries.map(([name, count]) => (
            <div key={name} className="flex items-center justify-between text-sm">
              <span className="inline-flex items-center gap-3 text-slate-700">
                <span className="h-2.5 w-2.5 rounded-full bg-[#64748B]" />
                {name}
              </span>
              <span className="font-semibold">
                {count} <span className="font-normal text-slate-400">({Math.round((count / Math.max(total, 1)) * 100)}%)</span>
              </span>
            </div>
          ))
        ) : (
          <p className="text-sm text-slate-500">No data yet.</p>
        )}
      </div>
    </div>
  );
}
