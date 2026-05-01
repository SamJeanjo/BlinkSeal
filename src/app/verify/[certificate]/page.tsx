import { CheckCircle2, FileJson, Fingerprint, ShieldCheck, XCircle } from "lucide-react";
import { BrandMark } from "@/components/blinkseal/logo";
import { stableStringify, sha256Hex, verifyPayloadSignature } from "@/lib/certificates";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export default async function VerifyCertificatePage({ params }: { params: Promise<{ certificate: string }> }) {
  const { certificate } = await params;
  const supabase = getSupabaseAdmin();
  const { data } = await supabase
    .from("access_certificates")
    .select("*")
    .eq("certificate_number", certificate)
    .maybeSingle();

  if (!data) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F9FAFB] p-6">
        <div className="max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <XCircle className="mx-auto h-12 w-12 text-red-500" />
          <h1 className="mt-4 text-2xl font-semibold text-slate-950">Certificate not found</h1>
          <p className="mt-2 text-sm text-slate-500">BlinkSeal could not locate a certificate with this ID.</p>
        </div>
      </main>
    );
  }

  const computedPayloadHash = sha256Hex(stableStringify(data.payload));
  const hashMatches = computedPayloadHash === data.payload_sha256;
  const signatureValid = hashMatches && verifyPayloadSignature(data.payload_sha256, data.signature, data.public_key);
  const payload = data.payload as any;

  return (
    <main className="min-h-screen bg-[#F9FAFB]">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-16 max-w-[1120px] items-center justify-between px-6">
          <BrandMark />
          <span className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-500">
            Public verification
          </span>
        </div>
      </header>
      <section className="mx-auto max-w-[1120px] px-6 py-12">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-start">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-[#525F7F]">Verified Access Certificate</p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">{data.certificate_number}</h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
                This page recomputes the certificate hash and verifies the BlinkSeal Ed25519 signature against the stored public key.
              </p>
            </div>
            <div
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ${
                signatureValid ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"
              }`}
            >
              {signatureValid ? <CheckCircle2 className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
              {signatureValid ? "Valid certificate" : "Verification failed"}
            </div>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <ProofMetric icon={<Fingerprint className="h-5 w-5" />} label="Document SHA-256" value={payload.document.sha256} />
            <ProofMetric icon={<ShieldCheck className="h-5 w-5" />} label="Payload SHA-256" value={data.payload_sha256} />
            <ProofMetric icon={<FileJson className="h-5 w-5" />} label="Event Log SHA-256" value={data.event_log_sha256} />
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <div className="rounded-xl border border-slate-200 p-5">
              <h2 className="font-semibold text-slate-950">What this verifies</h2>
              <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-600">
                <li>The certificate payload has not changed since issuance.</li>
                <li>The payload hash matches the signature created by BlinkSeal.</li>
                <li>The event list and document hash are preserved in the signed payload.</li>
              </ul>
            </div>
            <div className="rounded-xl border border-slate-200 p-5">
              <h2 className="font-semibold text-slate-950">What it does not prove</h2>
              <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-600">
                <li>It does not prove the recipient personally read or understood the document.</li>
                <li>It does not replace legal analysis about service, notice, or admissibility.</li>
              </ul>
            </div>
          </div>

          <div className="mt-8 rounded-xl bg-slate-50 p-5">
            <h2 className="font-semibold text-slate-950">Document and access record</h2>
            <dl className="mt-4 grid gap-4 text-sm md:grid-cols-2">
              <Info label="File name" value={payload.document.file_name} />
              <Info label="Issued at UTC" value={payload.certificate.issued_at_utc} />
              <Info label="Link created at UTC" value={payload.share_link.created_at_utc} />
              <Info label="Events included" value={String(payload.events.length)} />
            </dl>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={`/api/certificates/${data.certificate_number}/evidence`}
              className="inline-flex h-11 items-center justify-center rounded-lg bg-[#525F7F] px-4 text-sm font-semibold text-white"
            >
              Download JSON evidence
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}

function ProofMetric({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
      <div className="mb-3 text-[#525F7F]">{icon}</div>
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-2 break-all font-mono text-xs text-slate-950">{value}</p>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-slate-500">{label}</dt>
      <dd className="mt-1 break-all font-medium text-slate-950">{value}</dd>
    </div>
  );
}
