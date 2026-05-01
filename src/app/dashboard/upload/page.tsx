import Link from "next/link";
import { ArrowLeft, Check, Upload as UploadIcon } from "lucide-react";
import { uploadDocument } from "@/app/dashboard/upload/actions";
import { Button } from "@/components/blinkseal/button";

export default function UploadPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-4">
        <Link href="/dashboard" className="flex items-center gap-1.5 text-sm text-slate-600 transition-colors hover:text-slate-900">
          <ArrowLeft className="h-4 w-4" />
          Documents
        </Link>
      </div>

      <div className="mb-10 flex items-center justify-center gap-2">
        <Step active>1</Step>
        <div className="h-px w-12 bg-slate-200" />
        <Step>2</Step>
        <div className="h-px w-12 bg-slate-200" />
        <Step>3</Step>
      </div>

      <form action={uploadDocument}>
        <label className="relative block cursor-pointer rounded-2xl border-2 border-dashed border-[#E5E7EB] bg-white p-12 text-center transition-all duration-200 hover:border-[#9CA3AF]">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#0066CC]/10">
            <UploadIcon className="h-8 w-8 text-[#0066CC]" />
          </div>
          <h1 className="mb-2 text-xl font-semibold text-[#111827]">Drop your file here</h1>
          <p className="mb-6 text-[#6B7280]">or click to browse from your device</p>
          <input
            name="file"
            type="file"
            required
            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
          />
          <p className="text-xs text-[#9CA3AF]">Files are encrypted and stored privately</p>
        </label>

        <Button type="submit" variant="blue" className="mt-6 h-12 w-full text-base">
          Upload securely
        </Button>
      </form>
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
