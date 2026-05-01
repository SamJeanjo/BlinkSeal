import { Lock, Server, Shield, Timer } from "lucide-react";
import { BrandMark } from "@/components/blinkseal/logo";
import { Button } from "@/components/blinkseal/button";

export default function SecurityPage() {
  const items = [
    {
      icon: Lock,
      title: "Private storage",
      body: "Documents are stored in a private Supabase Storage bucket and are never exposed as public objects."
    },
    {
      icon: Timer,
      title: "Short-lived signed URLs",
      body: "Public document access goes through /view/[token], then BlinkSeal issues a temporary signed URL."
    },
    {
      icon: Shield,
      title: "Revocation and expiration",
      body: "Every share link can be revoked and may include an expiration date."
    },
    {
      icon: Server,
      title: "Audit trail",
      body: "Each valid view records timestamp, IP address, user agent, and referrer metadata."
    }
  ];

  return (
    <main className="min-h-screen bg-[#F9FAFB]">
      <header className="mx-auto flex h-16 max-w-[1040px] items-center justify-between px-6">
        <BrandMark />
        <Button href="/dashboard" variant="outline">Dashboard</Button>
      </header>
      <section className="mx-auto max-w-[1040px] px-6 py-16">
        <div className="max-w-2xl">
          <h1 className="text-4xl font-semibold tracking-tight text-slate-950">Security</h1>
          <p className="mt-4 text-lg leading-8 text-slate-600">
            BlinkSeal keeps document files private and records access through controlled, auditable links.
          </p>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-[#0066CC]/10">
                  <Icon className="h-5 w-5 text-[#0066CC]" />
                </div>
                <h2 className="font-semibold text-slate-900">{item.title}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-500">{item.body}</p>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}
