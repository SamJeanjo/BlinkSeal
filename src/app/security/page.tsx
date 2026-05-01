import { Database, FileLock2, KeyRound, Lock, Server, Shield, Timer } from "lucide-react";
import { BrandMark } from "@/components/blinkseal/logo";
import { Button } from "@/components/blinkseal/button";

export default function SecurityPage() {
  const items = [
    {
      icon: FileLock2,
      title: "Files remain private",
      body: "Documents are stored in a private Supabase Storage bucket. BlinkSeal does not expose public object URLs."
    },
    {
      icon: KeyRound,
      title: "Server-issued signed URLs",
      body: "The public viewer validates the token on the server, checks revocation and expiration, then issues a short-lived signed URL."
    },
    {
      icon: Shield,
      title: "Owner-scoped access",
      body: "Authenticated owners can only access documents, links, and proof events tied to their own account."
    },
    {
      icon: Server,
      title: "Evidence-grade event logging",
      body: "Every valid open records timestamp, IP address, user agent, and referrer metadata for the proof timeline."
    }
  ];

  return (
    <main className="min-h-screen bg-[#F9FAFB]">
      <header className="mx-auto flex h-16 max-w-[1120px] items-center justify-between px-6">
        <BrandMark />
        <Button href="/dashboard" variant="outline">Dashboard</Button>
      </header>
      <section className="mx-auto max-w-[1120px] px-6 py-16">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-[#525F7F]">Security posture</p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950">Built for confidential legal exchange</h1>
            <p className="mt-4 text-lg leading-8 text-slate-600">
              BlinkSeal is designed around private storage, server-side access checks, revocation,
              expiration, and a persistent access record that lawyers can explain to clients.
            </p>
            <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-emerald-50">
                  <Lock className="h-5 w-5 text-emerald-700" />
                </div>
                <div>
                  <h2 className="font-semibold text-slate-950">Service role keys stay server-side</h2>
                  <p className="mt-1 text-sm leading-6 text-slate-500">
                    The Supabase service role key is used only in server code and is never imported into browser components.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {items.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-[#525F7F]/10">
                    <Icon className="h-5 w-5 text-[#525F7F]" />
                  </div>
                  <h2 className="font-semibold text-slate-950">{item.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-500">{item.body}</p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-950">Access path</h2>
          <div className="mt-5 grid gap-3 md:grid-cols-4">
            {[
              { icon: Database, text: "Private bucket" },
              { icon: Timer, text: "Token validation" },
              { icon: KeyRound, text: "Signed URL" },
              { icon: Server, text: "Audit event" }
            ].map((step) => {
              const Icon = step.icon;
              return (
                <div key={step.text} className="rounded-xl bg-slate-50 p-4 text-sm font-semibold text-slate-700">
                  <Icon className="mb-3 h-5 w-5 text-[#525F7F]" />
                  {step.text}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
