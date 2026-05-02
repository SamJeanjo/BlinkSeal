import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Check,
  Clock3,
  Download,
  Eye,
  FileCheck2,
  FileLock2,
  Fingerprint,
  Gavel,
  KeyRound,
  Lock,
  Scale,
  ShieldCheck,
  Signature,
  Timer,
  Users
} from "lucide-react";
import { LogoIcon } from "@/components/blinkseal/logo";

const card =
  "rounded-2xl border border-white/10 bg-white/[0.05] shadow-[0_0_40px_rgba(56,189,248,0.08)] backdrop-blur-xl";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#020617] text-[#E5E7EB] selection:bg-sky-400/30">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-[-18rem] h-[42rem] w-[42rem] -translate-x-1/2 rounded-full bg-sky-400/10 blur-3xl" />
        <div className="absolute right-[-16rem] top-40 h-[34rem] w-[34rem] rounded-full bg-violet-500/10 blur-3xl" />
        <div className="absolute bottom-[-18rem] left-[-10rem] h-[34rem] w-[34rem] rounded-full bg-emerald-500/8 blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:72px_72px] [mask-image:linear-gradient(to_bottom,black,transparent_82%)]" />
      </div>

      <header className="sticky top-0 z-50 border-b border-white/10 bg-black/30 backdrop-blur-xl">
        <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-3">
            <span className="relative grid h-11 w-11 place-items-center rounded-2xl border border-sky-300/20 bg-white shadow-[0_0_34px_rgba(56,189,248,0.18)]">
              <span className="absolute inset-0 rounded-2xl bg-sky-300/10 blur-md" />
              <span className="relative grid h-9 w-9 place-items-center rounded-xl bg-white">
                <LogoIcon size={29} />
              </span>
            </span>
            <span className="text-xl tracking-wide text-white">
              <span className="font-normal">Blink</span>
              <span className="font-semibold">Seal</span>
            </span>
          </Link>
          <nav className="hidden items-center gap-8 text-sm font-medium text-slate-300 md:flex">
            <a href="#features" className="transition hover:text-white">Product</a>
            <a href="#access-proof" className="transition hover:text-white">Proof</a>
            <a href="#security" className="transition hover:text-white">Security</a>
            <a href="#pricing" className="transition hover:text-white">Pricing</a>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/sign-in" className="hidden rounded-lg border border-white/10 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-white/20 hover:bg-white/5 sm:inline-flex">
              Login
            </Link>
            <Link href="/sign-up" className="inline-flex items-center gap-2 rounded-lg bg-sky-400 px-4 py-2 text-sm font-semibold text-slate-950 shadow-[0_0_40px_rgba(56,189,248,0.25)] transition hover:bg-sky-300">
              Get Started Free
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </header>

      <section className="relative z-10">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-6 pb-14 pt-16 lg:grid-cols-[0.98fr_1.02fr] lg:pb-16 lg:pt-18">
          <div>
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm font-semibold text-slate-300 shadow-[0_0_30px_rgba(56,189,248,0.08)] backdrop-blur-xl">
              <Scale className="h-4 w-4 text-sky-300" />
              Built for law firms, legal operations, and compliance teams
            </div>
            <h1 className="max-w-4xl text-5xl font-semibold tracking-tight text-white sm:text-6xl lg:text-[78px] lg:leading-[0.94]">
              Court-ready proof that your document was accessed.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300 sm:text-xl sm:leading-9">
              Share confidential legal documents, track every open, and generate verifiable access certificates with timestamps, hashes, and cryptographic signatures.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/sign-up" className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-sky-400 px-6 text-base font-semibold text-slate-950 shadow-[0_0_40px_rgba(56,189,248,0.25)] transition hover:-translate-y-0.5 hover:bg-sky-300">
                Get Started Free
                <ArrowRight className="h-5 w-5" />
              </Link>
              <a href="#proof" className="inline-flex h-12 items-center justify-center rounded-lg border border-white/10 bg-white/5 px-6 text-base font-semibold text-white transition hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/10">
                See verified proof
              </a>
            </div>
            <p className="mt-4 text-sm font-medium text-slate-400">No credit card required. Built for confidential client work.</p>
            <div className="mt-7 grid max-w-2xl gap-3 sm:grid-cols-4">
              <HeroTrust icon={<Lock />} label="Private storage" />
              <HeroTrust icon={<Fingerprint />} label="SHA-256 hash" />
              <HeroTrust icon={<Signature />} label="Signed certificate" />
              <HeroTrust icon={<ShieldCheck />} label="Verify page" />
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-5 rounded-[2rem] bg-[radial-gradient(circle_at_50%_0%,rgba(56,189,248,0.22),transparent_58%)] blur-2xl" />
            <div className={`${card} relative p-4 transition duration-300 hover:-translate-y-1 hover:shadow-[0_0_70px_rgba(56,189,248,0.20)] sm:p-6`}>
              <div className="rounded-2xl border border-white/10 bg-[#030712]/95 p-5 shadow-2xl shadow-black/40">
                <div className="flex items-center justify-between gap-5">
                  <span className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-300">Verified Access Certificate</span>
                  <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-300 ring-1 ring-emerald-400/30 [animation:shieldPulse_1.9s_ease-in-out_infinite]">
                    Valid
                  </span>
                </div>
                <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white">BSC-2026-A19F42E3C0</h2>
                <div className="mt-7 rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                  <p className="text-base font-semibold text-white">Settlement_Agreement.pdf</p>
                  <p className="mt-2 text-sm text-slate-400">Issued May 1, 2026 - 4 access events</p>
                </div>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <MiniProof label="Document hash" value="d81f...19c4" />
                  <MiniProof label="Event log hash" value="7c2a...92ee" />
                  <MiniProof label="Signature" value="Ed25519 valid" />
                  <MiniProof label="Verification" value="/verify/BSC..." />
                </div>
                <div className="mt-5 grid grid-cols-3 gap-3">
                  <CertStat value="4" label="Opens" />
                  <CertStat value="1" label="Download" />
                  <CertStat value="UTC" label="Timeline" />
                </div>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <ProofPill icon={<FileLock2 />} text="Private bucket" />
                <ProofPill icon={<KeyRound />} text="Signed URLs" />
                <ProofPill icon={<BadgeCheck />} text="Public verify" />
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-6 pb-18">
          <ProductMockup />
        </div>
      </section>

      <section id="features" className="relative z-10 mx-auto max-w-7xl scroll-mt-24 px-6 py-20">
        <div id="audit-exports" className="scroll-mt-28" />
        <div className="grid gap-4 md:grid-cols-3">
          <TrustCard icon={<FileCheck2 />} title="Audit-ready exports" body="Generate signed certificate records with hashes, timestamps, UTC event history, and canonical evidence bundles." />
          <TrustCard icon={<ShieldCheck />} title="Security-first access" body="Private storage, server-side validation, scoped access, no public files, and production security headers." />
          <TrustCard icon={<Signature />} title="Cryptographic signatures" body="Ed25519-signed certificate payloads give IT teams a verification path beyond screenshots." />
        </div>

        <div className="mt-24 grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <SectionIntro eyebrow="Secure document sharing" title="Verifiable proof of access, not a hopeful email attachment." body="BlinkSeal gives legal teams a controlled link, a live proof timeline, and a signed evidence bundle that captures what happened without making files public." />
          <div className="grid gap-4 sm:grid-cols-3">
            <FeatureCard icon={<FileLock2 />} title="Secure Links" body="Revocable links with expiration, view limits, one-time access, and private signed URLs." />
            <FeatureCard icon={<Eye />} title="Real-Time Tracking" body="Record opens, downloads, IP, device, browser, referrer, and UTC timestamps." />
            <FeatureCard icon={<FileCheck2 />} title="Exportable Proof" body="Issue a verified certificate with file hash, event hash, and public verification page." />
          </div>
        </div>
      </section>

      <section id="how-it-works" className="relative z-10 scroll-mt-24 border-y border-white/10 bg-white/[0.03]">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <SectionIntro eyebrow="How it works" title="Three steps from upload to court-ready proof." />
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            <Step number="1" icon={<FileLock2 />} title="Upload document" body="Files are stored in a private bucket. The SHA-256 file hash is recorded on upload." />
            <Step number="2" icon={<KeyRound />} title="Share secure link" body="Set access rules, then send a private link that validates server-side before any document access." />
            <Step number="3" icon={<BadgeCheck />} title="Issue certificate" body="Export a signed access certificate with a public verification page and JSON evidence bundle." />
          </div>
        </div>
      </section>

      <section id="access-proof" className="relative z-10 mx-auto grid max-w-7xl scroll-mt-24 gap-10 px-6 py-24 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
        <div>
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-1 text-sm font-semibold text-emerald-300">
            <ShieldCheck className="h-4 w-4" />
            Verified Access Certificate
          </div>
          <SectionIntro title="Access proof a lawyer can explain and IT can verify." body="Every certificate includes a document hash, event-log hash, Ed25519 signature, public key, canonical JSON payload, and public verification URL." />
          <ul className="mt-7 space-y-3 text-sm font-medium text-slate-300">
            {["File status and SHA-256 fingerprint", "Opens, downloads, IP, browser, and device", "Local and UTC timestamps", "Tamper-evident certificate hash", "JSON evidence bundle for IT review"].map((item) => (
              <li key={item} className="flex items-center gap-3">
                <Check className="h-4 w-4 text-emerald-400" />
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className={`${card} p-6`}>
          <div className="flex items-start justify-between gap-6 border-b border-white/10 pb-5">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-300">Certificate BSC-2026-A19F42E3C0</p>
              <h3 className="mt-2 text-2xl font-semibold text-white">Settlement Agreement.pdf</h3>
            </div>
            <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-sm font-semibold text-emerald-300 ring-1 ring-emerald-400/30">Valid</span>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <HashCard icon={<Fingerprint />} label="Document SHA-256" value="d81f...19c4" />
            <HashCard icon={<ShieldCheck />} label="Payload SHA-256" value="7c2a...92ee" />
            <HashCard icon={<Clock3 />} label="Issued UTC" value="2026-05-01 19:42" />
            <HashCard icon={<Download />} label="Events included" value="4 opens / 1 download" />
          </div>
          <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.04] p-5">
            <p className="text-sm font-semibold text-white">What this certificate proves</p>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              The stored document hash and the event log were signed by BlinkSeal at issuance. Any later change produces a different hash and fails verification.
            </p>
          </div>
        </div>
      </section>

      <section id="security" className="relative z-10 scroll-mt-24 border-y border-white/10 bg-white/[0.03]">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
            <SectionIntro eyebrow="Security lawyers can trust" title="Built to withstand careful questions." body="BlinkSeal uses private buckets, signed URLs, server-side access checks, revocation, expiration, and certificate signing keys that never enter the browser." />
            <div className="grid gap-4 md:grid-cols-2">
              <SecurityItem icon={<Lock />} title="Private file storage" body="Documents are never served from public object URLs." />
              <SecurityItem icon={<Timer />} title="Short-lived access" body="Viewer sessions receive temporary signed URLs only after token validation." />
              <SecurityItem icon={<Users />} title="Owner-scoped dashboard" body="Authenticated owners can only manage their own documents and links." />
              <SecurityItem icon={<Signature />} title="Server-only signing" body="Certificate private keys remain server-side and are stored as Vercel secrets." />
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-7xl px-6 py-24">
        <SectionIntro eyebrow="Built for teams that need proof" title="From settlement drafts to compliance notices." />
        <div className="mt-10 grid gap-4 md:grid-cols-4">
          <Audience title="Lawyers" body="Share settlement drafts, demand letters, NDAs, and exhibits. See when opposing counsel opens." />
          <Audience title="HR Teams" body="Send offer letters and policy documents with access logs instead of follow-up guesswork." />
          <Audience title="Consultants" body="Deliver reports and proposals with proof of receipt and download tracking." />
          <Audience title="Executives" body="Distribute board materials with revocation, visibility, and proof." />
        </div>
      </section>

      <section className="relative z-10 border-y border-white/10 bg-[radial-gradient(circle_at_50%_0%,rgba(56,189,248,0.10),transparent_45%),rgba(255,255,255,0.03)]">
        <div className="mx-auto max-w-7xl px-6 py-18">
          <div className="grid gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:items-center">
            <SectionIntro
              eyebrow="How verification works"
              title="A simple chain of evidence IT can validate."
              body="Each certificate ties the original file to the access log, then signs the canonical payload. The verification page checks that chain independently."
            />
            <div className={`${card} p-5`}>
              <div className="grid gap-3 md:grid-cols-4">
                <VerifyStep icon={<Fingerprint />} title="Document hash" body="SHA-256 fingerprint of the uploaded file." />
                <VerifyStep icon={<Clock3 />} title="Event hash" body="Canonical hash of opens, downloads, IP, and UTC timestamps." />
                <VerifyStep icon={<Signature />} title="Signature" body="Server-side Ed25519 signature over the evidence payload." />
                <VerifyStep icon={<BadgeCheck />} title="Public verify" body="Certificate URL confirms the payload has not changed." />
              </div>
              <div className="mt-5 rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-4 text-sm leading-6 text-emerald-100">
                Retention-ready records include private storage path, file hash, signed evidence bundle, UTC timestamps, revocation state, and proof that the file was never exposed through a public bucket.
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="pricing" className="relative z-10 border-y border-white/10 bg-white/[0.03]">
        <div className="mx-auto max-w-7xl px-6 py-18">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-300">Simple, transparent pricing</p>
            <h2 className="mx-auto mt-3 max-w-3xl text-4xl font-semibold tracking-tight text-white sm:text-5xl">Start free. Upgrade when proof becomes workflow.</h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-slate-400">
              Every plan keeps documents private by default. Paid plans add longer retention, signed evidence exports, and certificate verification for legal and IT review.
            </p>
          </div>
          <div className="mt-8 grid gap-5 lg:grid-cols-3">
            <Plan name="Free" price="$0/mo" items={["3 secure links/mo", "Basic access tracking", "7-day history"]} />
            <Plan featured name="Pro" price="$29/mo" items={["Secure links", "Access tracking", "Signed proof certificates", "Private signed URLs", "Unlimited views", "Retention controls"]} />
            <Plan name="Business" price="$99/mo" items={["All Pro features", "Up to 7 users", "Shared workspace", "Admin controls"]} />
          </div>
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-7xl px-6 py-24">
        <div className="rounded-[2rem] border border-sky-300/20 bg-[radial-gradient(circle_at_12%_0%,rgba(56,189,248,0.20),transparent_35%),rgba(255,255,255,0.06)] p-8 shadow-[0_0_70px_rgba(56,189,248,0.14)] backdrop-blur-xl lg:p-12">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <h2 className="text-4xl font-semibold tracking-tight text-white">Start sharing with proof.</h2>
              <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-300">
                Join legal, HR, and compliance teams who need private delivery, verified access, and certificate-grade records.
              </p>
            </div>
            <Link href="/sign-up" className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-white px-6 text-base font-semibold text-slate-950 transition hover:bg-slate-100">
              Get Started Free
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      <footer className="relative z-10 border-t border-white/10 bg-black/20">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 py-10 md:grid-cols-[1.2fr_1fr_1fr_1fr]">
          <div>
            <Link href="/" className="flex items-center gap-3">
              <span className="relative grid h-11 w-11 place-items-center rounded-2xl border border-sky-300/20 bg-white shadow-[0_0_34px_rgba(56,189,248,0.18)]">
                <span className="absolute inset-0 rounded-2xl bg-sky-300/10 blur-md" />
                <span className="relative grid h-9 w-9 place-items-center rounded-xl bg-white">
                  <LogoIcon size={29} />
                </span>
              </span>
              <span className="text-xl tracking-wide text-white"><span>Blink</span><span className="font-semibold">Seal</span></span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-6 text-slate-400">
              Secure document sharing with built-in proof. A product of Code10Rx LLC.
            </p>
          </div>
          <FooterGroup
            title="Product"
            links={[
              { label: "Features", href: "/#features" },
              { label: "Pricing", href: "/#pricing" },
              { label: "How It Works", href: "/#how-it-works" }
            ]}
          />
          <FooterGroup
            title="Security"
            links={[
              { label: "Security Overview", href: "/security" },
              { label: "Access Proof", href: "/#access-proof" },
              { label: "Audit Exports", href: "/#audit-exports" }
            ]}
          />
          <FooterGroup
            title="Company"
            links={[
              { label: "Terms & Conditions", href: "/terms" },
              { label: "Privacy policy", href: "/privacy-policy" },
              { label: "Security & Compliance", href: "/security-compliance" }
            ]}
          />
        </div>
        <div className="border-t border-white/10 px-6 py-5 text-center text-xs text-slate-500">
          (c) 2026 BlinkSeal / Code10Rx LLC. All rights reserved.
        </div>
      </footer>
    </main>
  );
}

function ProductMockup() {
  const rows = [
    {
      name: "Settlement_Agreement_Confidential.pdf",
      status: "Viewed today",
      meta: "Download blocked - Watermark enabled",
      opens: "Opened 4 times",
      activity: "Last activity 1 hour ago"
    },
    {
      name: "Offer_Letter_Director_of_Legal.pdf",
      status: "Active",
      meta: "Download blocked - Private signed URL",
      opens: "Opened once",
      activity: "Last activity 3 days ago"
    },
    {
      name: "NDA_Johnson_&_Partners_2026.pdf",
      status: "Active",
      meta: "No public file - Certificate ready",
      opens: "Opened 11 times",
      activity: "Last activity 22 days ago"
    }
  ];

  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(135deg,rgba(15,23,42,0.92),rgba(2,6,23,0.96))] p-4 shadow-[0_0_80px_rgba(56,189,248,0.12)] backdrop-blur-xl">
      <div className="absolute right-8 top-6 h-24 w-24 rounded-full bg-sky-400/10 blur-2xl" />
      <div className="absolute bottom-0 left-20 h-20 w-64 rounded-full bg-violet-500/10 blur-2xl" />
      <div className="relative rounded-[1.4rem] border border-white/10 bg-[#030712] p-5">
        <div className="mb-5 flex flex-col gap-4 border-b border-white/10 pb-5 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-sky-300">
              <Gavel className="h-4 w-4" />
              Legal workspace
            </div>
            <h3 className="mt-2 text-2xl font-semibold tracking-tight text-white">My Files</h3>
            <p className="mt-1 text-sm text-slate-400">Private documents with retained proof records</p>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center">
            <DashboardStat value="7" label="Active" />
            <DashboardStat value="2" label="Viewed today" />
            <DashboardStat value="0" label="Public files" />
          </div>
        </div>

        <div className="mb-4 flex flex-wrap gap-2">
          {["Active", "Expiring", "All", "Expired", "Revoked"].map((tab, index) => (
            <span key={tab} className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${index === 0 ? "bg-white text-slate-950" : "bg-white/[0.05] text-slate-400 ring-1 ring-white/10"}`}>
              {tab}
            </span>
          ))}
        </div>

        <div className="space-y-3">
          {rows.map((row) => (
            <div key={row.name} className="grid gap-4 rounded-2xl border border-white/10 bg-white/[0.045] p-4 md:grid-cols-[1fr_auto] md:items-center">
              <div className="flex gap-4">
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-sky-300/20 bg-sky-400/10 text-sky-300">
                  <FileCheck2 className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold text-white">{row.name}</p>
                    <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${row.status === "Viewed today" ? "bg-amber-400/10 text-amber-200 ring-1 ring-amber-300/20" : "bg-emerald-500/10 text-emerald-300 ring-1 ring-emerald-400/20"}`}>
                      {row.status}
                    </span>
                  </div>
                  <p className="mt-1 font-mono text-xs text-slate-500">app.blinkseal.io/?c=AHKZDD</p>
                  <p className="mt-2 text-xs text-slate-400">{row.meta}</p>
                  <p className="mt-1 text-xs text-slate-500">{row.opens} - {row.activity}</p>
                </div>
              </div>
              <Link href="/sign-up" className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-4 text-sm font-semibold text-white transition hover:bg-white/10">
                View proof
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function DashboardStat({ value, label }: { value: string; label: string }) {
  return (
    <div className="min-w-24 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2">
      <p className="text-lg font-semibold text-white">{value}</p>
      <p className="text-[11px] text-slate-500">{label}</p>
    </div>
  );
}

function SectionIntro({ eyebrow, title, body }: { eyebrow?: string; title: string; body?: string }) {
  return (
    <div className="max-w-3xl">
      {eyebrow && <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-300">{eyebrow}</p>}
      <h2 className="mt-3 text-4xl font-semibold tracking-tight text-white sm:text-5xl">{title}</h2>
      {body && <p className="mt-4 text-lg leading-8 text-slate-400">{body}</p>}
    </div>
  );
}

function VerifyStep({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
      <div className="mb-4 grid h-11 w-11 place-items-center rounded-xl border border-sky-300/20 bg-sky-400/10 text-sky-300">{icon}</div>
      <h3 className="font-semibold text-white">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-400">{body}</p>
    </div>
  );
}

function HeroTrust({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.05] p-3 backdrop-blur-xl">
      <div className="mb-2 text-sky-300 [&_svg]:h-4 [&_svg]:w-4">{icon}</div>
      <p className="text-xs font-semibold text-slate-300">{label}</p>
    </div>
  );
}

function MiniProof({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.05] p-3">
      <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 font-mono text-xs text-white">{value}</p>
    </div>
  );
}

function CertStat({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.04] p-3 text-center">
      <p className="text-xl font-semibold text-white">{value}</p>
      <p className="text-xs text-slate-500">{label}</p>
    </div>
  );
}

function ProofPill({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-semibold text-slate-300">
      <span className="text-sky-300 [&_svg]:h-4 [&_svg]:w-4">{icon}</span>
      {text}
    </div>
  );
}

function TrustCard({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
  return (
    <div className={`${card} p-6`}>
      <div className="mb-4 text-sky-300 [&_svg]:h-6 [&_svg]:w-6">{icon}</div>
      <h3 className="font-semibold text-white">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-400">{body}</p>
    </div>
  );
}

function FeatureCard({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
  return (
    <div className={`${card} p-5`}>
      <div className="mb-4 grid h-11 w-11 place-items-center rounded-xl border border-sky-300/20 bg-sky-400/10 text-sky-300">{icon}</div>
      <h3 className="font-semibold text-white">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-400">{body}</p>
    </div>
  );
}

function Step({ number, icon, title, body }: { number: string; icon: React.ReactNode; title: string; body: string }) {
  return (
    <div className={`${card} p-6`}>
      <div className="mb-5 flex items-center justify-between">
        <span className="grid h-10 w-10 place-items-center rounded-full bg-sky-400 text-sm font-semibold text-slate-950 shadow-[0_0_30px_rgba(56,189,248,0.24)]">{number}</span>
        <div className="text-violet-300 [&_svg]:h-6 [&_svg]:w-6">{icon}</div>
      </div>
      <h3 className="font-semibold text-white">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-400">{body}</p>
    </div>
  );
}

function HashCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
      <div className="mb-3 text-sky-300 [&_svg]:h-5 [&_svg]:w-5">{icon}</div>
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-2 font-mono text-sm text-white">{value}</p>
    </div>
  );
}

function SecurityItem({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
  return (
    <div className={`${card} p-5`}>
      <div className="mb-4 text-emerald-300 [&_svg]:h-5 [&_svg]:w-5">{icon}</div>
      <h3 className="font-semibold text-white">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-400">{body}</p>
    </div>
  );
}

function Audience({ title, body }: { title: string; body: string }) {
  return (
    <div className={`${card} p-6`}>
      <h3 className="font-semibold text-white">{title}</h3>
      <p className="mt-3 text-sm leading-6 text-slate-400">{body}</p>
    </div>
  );
}

function Plan({ name, price, items, featured = false }: { name: string; price: string; items: string[]; featured?: boolean }) {
  return (
    <div className={`rounded-3xl border p-7 ${featured ? "border-sky-300/30 bg-sky-400/10 shadow-[0_0_60px_rgba(56,189,248,0.16)]" : "border-white/10 bg-white/[0.05]"} backdrop-blur-xl`}>
      {featured && <span className="mb-5 inline-flex rounded-full bg-sky-400/15 px-3 py-1 text-xs font-semibold text-sky-300 ring-1 ring-sky-300/20">Most Popular</span>}
      <h3 className="text-2xl font-semibold text-white">{name}</h3>
      <p className="mt-2 text-3xl font-semibold text-white">{price}</p>
      <ul className="mt-6 space-y-3 text-sm text-slate-300">
        {items.map((item) => (
          <li key={item} className="flex items-center gap-3">
            <Check className="h-4 w-4 text-emerald-400" />
            {item}
          </li>
        ))}
      </ul>
      <Link href="/sign-up" className={`mt-7 inline-flex h-11 w-full items-center justify-center rounded-lg text-sm font-semibold transition ${featured ? "bg-white text-slate-950 hover:bg-slate-100" : "border border-white/10 bg-white/[0.04] text-white hover:bg-white/10"}`}>
        Start Free
      </Link>
    </div>
  );
}

function FooterGroup({ title, links }: { title: string; links: Array<{ label: string; href: string }> }) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-white">{title}</h3>
      <div className="mt-3 space-y-2">
        {links.map((link) => (
          <Link key={link.label} href={link.href} className="block text-sm text-slate-400 transition hover:text-white">
            {link.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
