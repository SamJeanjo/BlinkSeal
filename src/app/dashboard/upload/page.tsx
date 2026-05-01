import Link from "next/link";
import { ArrowLeft, Check, Lock, ShieldCheck, Upload as UploadIcon } from "lucide-react";
import { uploadDocument } from "@/app/dashboard/upload/actions";
import { Button } from "@/components/blinkseal/button";

export default function UploadPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-4">
        <Link href="/dashboard" className="flex items-center gap-1.5 text-sm text-slate-600 transition-colors hover:text-slate-900">
          <ArrowLeft className="h-4 w-4" />
          Documents
        </Link>
      </div>

      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-wide text-[#525F7F]">Private intake</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">Upload a confidential document</h1>
        <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
          Files are stored in a private Supabase bucket. Public access is never granted directly;
          recipients only receive short-lived signed access after the share token is validated.
        </p>
      </div>

      <div className="mb-10 flex items-center justify-center gap-2">
        <Step active>1</Step>
        <div className="h-px w-12 bg-slate-200" />
        <Step>2</Step>
        <div className="h-px w-12 bg-slate-200" />
        <Step>3</Step>
      </div>

      <form action={uploadDocument}>
        <label className="relative block cursor-pointer rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center shadow-sm transition-all duration-200 hover:border-[#525F7F] hover:shadow-md">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#0066CC]/10">
            <UploadIcon className="h-8 w-8 text-[#0066CC]" />
          </div>
          <h2 className="mb-2 text-xl font-semibold text-[#111827]">Drop your file here</h2>
          <p className="mb-6 text-[#6B7280]">or click to browse from your device</p>
          <input
            name="file"
            type="file"
            accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.webp,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,image/png,image/jpeg,image/webp"
            required
            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
          />
          <p className="text-xs text-[#9CA3AF]">PDF, Word, PNG, JPG, or WebP up to 25 MB</p>
        </label>

        <Button type="submit" variant="blue" className="mt-6 h-12 w-full text-base">
          Upload securely
        </Button>
      </form>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-600">
          <ShieldCheck className="mb-2 h-5 w-5 text-[#525F7F]" />
          Private bucket storage. No public object URLs.
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-600">
          <Lock className="mb-2 h-5 w-5 text-[#525F7F]" />
          Signed viewer links are generated only after server validation.
        </div>
      </div>
    </div>
  );
}

function Step({ children, active }: { children: React.ReactNode; active?: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <div
        className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${
          active ? "bg-blue-600 text-white" : "bg-slate-200 text-slate-500"
        }`}
      >
        {active ? children : children === "1" ? <Check className="h-4 w-4" /> : children}
      </div>
      <span className={`text-sm ${active ? "font-medium text-slate-900" : "text-slate-500"}`}>
        {children === "1" ? "Upload" : children === "2" ? "Settings" : "Share"}
      </span>
    </div>
  );
}
