import { auth } from "@clerk/nextjs/server";
import { ArrowRight, Eye, Lock, Shield } from "lucide-react";
import { redirect } from "next/navigation";
import { Button } from "@/components/blinkseal/button";
import { BrandMark, LogoIcon } from "@/components/blinkseal/logo";

export default async function HomePage() {
  const { userId } = await auth();
  if (userId) redirect("/dashboard");

  return (
    <main className="min-h-screen bg-[#F9FAFB]">
      <header className="mx-auto flex h-16 max-w-[1120px] items-center justify-between px-6">
        <BrandMark />
        <div className="flex items-center gap-3">
          <Button href="/sign-in" variant="outline">
            Sign in
          </Button>
          <Button href="/sign-up" className="hidden sm:inline-flex">
            Get started
          </Button>
        </div>
      </header>

      <section className="mx-auto grid max-w-[1120px] items-center gap-12 px-6 py-20 lg:grid-cols-[1fr_440px]">
        <div>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-600">
            <Shield className="h-4 w-4 text-[#0066CC]" />
            Secure document links with proof
          </div>
          <h1 className="max-w-3xl text-5xl font-semibold tracking-tight text-slate-950 sm:text-6xl">
            BlinkSeal
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-8 text-slate-600">
            Upload a document, generate a private secure link, and see exactly when it is opened.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button href="/sign-up" variant="blue" className="h-12 px-6 text-base">
              Create your first secure link
              <ArrowRight className="h-5 w-5" />
            </Button>
            <Button href="/security" variant="outline" className="h-12 px-6 text-base">
              Security
            </Button>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/60">
          <div className="mb-8 flex items-center justify-between">
            <LogoIcon size={44} />
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
              Active
            </span>
          </div>
          <div className="space-y-4">
            <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
              <p className="text-sm font-medium text-slate-900">Q4 Investor Packet.pdf</p>
              <p className="mt-1 font-mono text-xs text-slate-500">app.blinkseal.io/view/8fK2...pQ</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-slate-100 p-4">
                <Eye className="mb-3 h-4 w-4 text-[#0066CC]" />
                <p className="text-2xl font-semibold text-slate-900">3</p>
                <p className="text-xs text-slate-500">Verified opens</p>
              </div>
              <div className="rounded-xl border border-slate-100 p-4">
                <Lock className="mb-3 h-4 w-4 text-[#525F7F]" />
                <p className="text-2xl font-semibold text-slate-900">Private</p>
                <p className="text-xs text-slate-500">Signed access only</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
