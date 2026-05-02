import { auth } from "@clerk/nextjs/server";
import Image from "next/image";
import { redirect } from "next/navigation";
import {
  ArrowRight,
  Award,
  Check,
  Clock3,
  Download,
  Eye,
  FileCheck2,
  FileLock2,
  Fingerprint,
  KeyRound,
  Lock,
  Scale,
  Shield,
  ShieldCheck,
  Signature,
  Timer,
  Users
} from "lucide-react";
import { Button } from "@/components/blinkseal/button";
import { BrandMark } from "@/components/blinkseal/logo";
import { hasClerkServerConfig } from "@/lib/clerk-config";

const appUrl = "https://app.blinkseal.io";

export default async function HomePage() {
  if (hasClerkServerConfig()) {
    const { userId } = await auth();
    if (userId) redirect("/dashboard");
  }

  return (
    <main className="min-h-screen bg-[#F7F8FA] text-slate-950">
      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-18 max-w-[1180px] items-center justify-between px-6">
          <BrandMark />
          <nav className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex">
            <a href="#product" className="hover:text-slate-950">Product</a>
            <a href="#proof" className="hover:text-slate-950">Proof</a>
            <a href="#security" className="hover:text-slate-950">Security</a>
            <a href="#pricing" className="hover:text-slate-950">Pricing</a>
          </nav>
          <div className="flex items-center gap-3">
            <Button href="/sign-in" variant="outline" className="h-10">Login</Button>
            <Button href="/sign-up" className="hidden h-10 sm:inline-flex">Get Started Free</Button>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-[1180px] px-6 pb-16 pt-16 lg:pb-24 lg:pt-22">
          <div className="relative z-10 max-w-[760px]">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-semibold text-[#525F7F] shadow-sm">
              <Scale className="h-4 w-4" />
              Built for law firms, legal operations, and compliance teams
            </div>
            <h1 className="text-5xl font-semibold tracking-tight text-slate-950 sm:text-6xl lg:text-7xl">
              Stop wondering if your document was seen.
            </h1>
            <p className="mt-6 max-w-2xl text-xl leading-9 text-slate-600">
              Share confidential documents through private links and issue verifiable access certificates your client, partner, or IT team can independently check.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Button href="/sign-up" variant="blue" className="h-12 px-6 text-base">
                Start Sharing Free
                <ArrowRight className="h-5 w-5" />
              </Button>
              <Button href="#proof" variant="outline" className="h-12 px-6 text-base">
                See verified proof
              </Button>
            </div>
            <p className="mt-4 text-sm font-medium text-slate-500">No credit card required. Private storage by default.</p>
          </div>

          <div className="mt-14 rounded-[28px] border border-slate-200 bg-slate-50 p-3 shadow-2xl shadow-slate-200/70">
            <Image
              src="/marketing/myfiles-hero.png"
              alt="BlinkSeal My Files dashboard"
              width={1400}
              height={820}
              priority
              className="rounded-[20px] border border-slate-200 bg-white"
            />
          </div>
        </div>
      </section>

      <section id="product" className="mx-auto max-w-[1180px] px-6 py-18">
        <div className="grid gap-4 md:grid-cols-3">
          <TrustCard icon={<Award />} title="Audit-ready exports" body="Generate signed certificate records with hashes, timestamps, and canonical evidence bundles." />
          <TrustCard icon={<ShieldCheck />} title="SOC-ready architecture" body="Private storage, server-side validation, scoped access, and production security headers." />
          <TrustCard icon={<Signature />} title="Cryptographic signatures" body="Ed25519-signed certificate payloads give IT teams a verification path beyond screenshots." />
        </div>

        <div className="mt-20 grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-[#525F7F]">Secure document sharing</p>
            <h2 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950">
              Verifiable proof of access, not a hopeful email attachment.
            </h2>
            <p className="mt-4 text-lg leading-8 text-slate-600">
              BlinkSeal gives legal teams a controlled link, a live proof timeline, and a signed certificate that captures what happened.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <FeatureCard icon={<FileLock2 />} title="Secure Links" body="Revocable links with expiration, view limits, one-time access, and private signed URLs." />
            <FeatureCard icon={<Eye />} title="Real-Time Tracking" body="Record opens, downloads, IP, device, browser, referrer, and UTC timestamps." />
            <FeatureCard icon={<FileCheck2 />} title="Exportable Proof" body="Issue a verified certificate with file hash, event hash, and public verification page." />
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-white">
        <div className="mx-auto max-w-[1180px] px-6 py-18">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-wide text-[#525F7F]">How it works</p>
            <h2 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950">Three steps from upload to court-ready proof.</h2>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            <Step number="1" icon={<FileLock2 />} title="Upload document" body="Files are stored in a private Supabase bucket. The SHA-256 file hash is recorded on upload." />
            <Step number="2" icon={<KeyRound />} title="Share secure link" body="Set access rules, then send a private link that validates server-side before any document access." />
            <Step number="3" icon={<Award />} title="Issue certificate" body="Export a signed access certificate with a public verification page and JSON evidence bundle." />
          </div>
        </div>
      </section>

      <section id="proof" className="mx-auto grid max-w-[1180px] gap-10 px-6 py-20 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
        <div>
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700">
            <ShieldCheck className="h-4 w-4" />
            Verified Access Certificate
          </div>
          <h2 className="text-4xl font-semibold tracking-tight text-slate-950">Access proof a lawyer can explain and IT can verify.</h2>
          <p className="mt-4 text-lg leading-8 text-slate-600">
            Every certificate includes a document hash, event-log hash, Ed25519 signature, public key, canonical JSON payload, and public verification URL.
          </p>
          <ul className="mt-7 space-y-3 text-sm font-medium text-slate-700">
            {["File status and SHA-256 fingerprint", "Opens, downloads, IP, browser, and device", "Local and UTC timestamps", "Tamper-evident certificate hash", "JSON evidence bundle for IT review"].map((item) => (
              <li key={item} className="flex items-center gap-3">
                <Check className="h-4 w-4 text-emerald-600" />
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/60">
          <div className="flex items-start justify-between border-b border-slate-200 pb-5">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-[#525F7F]">Certificate BSC-2026-A19F42E3C0</p>
              <h3 className="mt-2 text-2xl font-semibold text-slate-950">Settlement Agreement.pdf</h3>
            </div>
            <span className="rounded-full bg-emerald-600 px-3 py-1 text-sm font-semibold text-white">Valid</span>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <HashCard icon={<Fingerprint />} label="Document SHA-256" value="d81f…19c4" />
            <HashCard icon={<Shield />} label="Payload SHA-256" value="7c2a…92ee" />
            <HashCard icon={<Clock3 />} label="Issued UTC" value="2026-05-01 19:42" />
            <HashCard icon={<Download />} label="Events included" value="4 opens / 1 download" />
          </div>
          <div className="mt-6 rounded-2xl bg-slate-50 p-5">
            <p className="text-sm font-semibold text-slate-950">What this certificate proves</p>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              The stored document hash and the event log were signed by BlinkSeal at issuance. Any later change produces a different hash and fails verification.
            </p>
          </div>
        </div>
      </section>

      <section id="security" className="border-y border-slate-200 bg-white">
        <div className="mx-auto max-w-[1180px] px-6 py-18">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-[#525F7F]">Security lawyers can trust</p>
              <h2 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950">Built to withstand careful questions.</h2>
              <p className="mt-4 text-lg leading-8 text-slate-600">
                BlinkSeal uses private buckets, signed URLs, server-side access checks, revocation, expiration, and certificate signing keys that never enter the browser.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <SecurityItem icon={<Lock />} title="Private file storage" body="Documents are never served from public object URLs." />
              <SecurityItem icon={<Timer />} title="Short-lived access" body="Viewer sessions receive temporary signed URLs only after token validation." />
              <SecurityItem icon={<Users />} title="Owner-scoped dashboard" body="Authenticated owners can only manage their own documents and links." />
              <SecurityItem icon={<Signature />} title="Server-only signing" body="Certificate private keys remain server-side and are stored as Vercel secrets." />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1180px] px-6 py-20">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-[#525F7F]">Built for teams that need proof</p>
          <h2 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950">From settlement drafts to compliance notices.</h2>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-4">
          <Audience title="Lawyers" body="Share settlement drafts, demand letters, NDAs, and exhibits. See when opposing counsel opens." />
          <Audience title="HR Teams" body="Send offer letters and policy documents with access logs instead of follow-up guesswork." />
          <Audience title="Consultants" body="Deliver reports and proposals with proof of receipt and download tracking." />
          <Audience title="Executives" body="Distribute board materials with revocation, visibility, and proof." />
        </div>
      </section>

      <section id="pricing" className="border-y border-slate-200 bg-white">
        <div className="mx-auto max-w-[1180px] px-6 py-20">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-wide text-[#525F7F]">Simple, transparent pricing</p>
            <h2 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950">Start free. Upgrade when proof becomes workflow.</h2>
          </div>
          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            <Plan name="Free" price="$0/mo" items={["3 secure links/mo", "Basic access tracking", "7-day history"]} />
            <Plan featured name="Pro" price="$29/mo" items={["Secure links", "Access tracking", "Export proof certificates", "Clean downloads", "Unlimited views", "Retention controls"]} />
            <Plan name="Business" price="$99/mo" items={["All Pro features", "Up to 7 users", "Shared team workspace", "Admin controls"]} />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1180px] px-6 py-20">
        <div className="rounded-[28px] border border-slate-200 bg-slate-950 p-8 text-white shadow-2xl shadow-slate-300/60 lg:p-12">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <h2 className="text-4xl font-semibold tracking-tight">Start sharing with proof.</h2>
              <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-300">
                Join legal, HR, and compliance teams who need private delivery, verified access, and certificate-grade records.
              </p>
            </div>
            <Button href="/sign-up" variant="blue" className="h-12 bg-white px-6 text-base text-slate-950 hover:bg-slate-100">
              Get Started Free
              <ArrowRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto grid max-w-[1180px] gap-8 px-6 py-10 md:grid-cols-[1.2fr_1fr_1fr_1fr]">
          <div>
            <BrandMark />
            <p className="mt-4 max-w-sm text-sm leading-6 text-slate-500">
              Secure document sharing with built-in proof. A product of Code10Rx LLC.
            </p>
          </div>
          <FooterGroup title="Product" links={["Features", "Pricing", "How It Works"]} />
          <FooterGroup title="Security" links={["Security Overview", "Access Proof", "Audit Exports"]} />
          <FooterGroup title="Company" links={["Terms & Conditions", "Privacy policy", "Security & Compliance"]} />
        </div>
        <div className="border-t border-slate-200 px-6 py-5 text-center text-xs text-slate-400">
          © 2026 BlinkSeal / Code10Rx LLC. All rights reserved.
        </div>
      </footer>
    </main>
  );
}

function TrustCard({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-4 text-[#525F7F] [&_svg]:h-6 [&_svg]:w-6">{icon}</div>
      <h3 className="font-semibold text-slate-950">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-500">{body}</p>
    </div>
  );
}

function FeatureCard({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 grid h-11 w-11 place-items-center rounded-xl bg-slate-100 text-[#525F7F]">{icon}</div>
      <h3 className="font-semibold text-slate-950">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-500">{body}</p>
    </div>
  );
}

function Step({ number, icon, title, body }: { number: string; icon: React.ReactNode; title: string; body: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-center justify-between">
        <span className="grid h-10 w-10 place-items-center rounded-full bg-[#0066CC] text-sm font-semibold text-white">{number}</span>
        <div className="text-[#525F7F] [&_svg]:h-6 [&_svg]:w-6">{icon}</div>
      </div>
      <h3 className="font-semibold text-slate-950">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-500">{body}</p>
    </div>
  );
}

function HashCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <div className="mb-3 text-[#525F7F] [&_svg]:h-5 [&_svg]:w-5">{icon}</div>
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-2 font-mono text-sm text-slate-950">{value}</p>
    </div>
  );
}

function SecurityItem({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
      <div className="mb-4 text-[#525F7F] [&_svg]:h-5 [&_svg]:w-5">{icon}</div>
      <h3 className="font-semibold text-slate-950">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-500">{body}</p>
    </div>
  );
}

function Audience({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="font-semibold text-slate-950">{title}</h3>
      <p className="mt-3 text-sm leading-6 text-slate-500">{body}</p>
    </div>
  );
}

function Plan({ name, price, items, featured = false }: { name: string; price: string; items: string[]; featured?: boolean }) {
  return (
    <div className={`rounded-3xl border p-7 shadow-sm ${featured ? "border-[#525F7F] bg-slate-950 text-white" : "border-slate-200 bg-white"}`}>
      {featured && <span className="mb-5 inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white">Most Popular</span>}
      <h3 className="text-2xl font-semibold">{name}</h3>
      <p className="mt-2 text-3xl font-semibold">{price}</p>
      <ul className={`mt-6 space-y-3 text-sm ${featured ? "text-slate-200" : "text-slate-600"}`}>
        {items.map((item) => (
          <li key={item} className="flex items-center gap-3">
            <Check className="h-4 w-4 text-emerald-500" />
            {item}
          </li>
        ))}
      </ul>
      <Button href="/sign-up" variant={featured ? "blue" : "outline"} className={`mt-7 h-11 w-full ${featured ? "bg-white text-slate-950 hover:bg-slate-100" : ""}`}>
        Start Free
      </Button>
    </div>
  );
}

function FooterGroup({ title, links }: { title: string; links: string[] }) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-slate-950">{title}</h3>
      <div className="mt-3 space-y-2">
        {links.map((link) => (
          <a key={link} href={appUrl} className="block text-sm text-slate-500 hover:text-slate-950">
            {link}
          </a>
        ))}
      </div>
    </div>
  );
}
