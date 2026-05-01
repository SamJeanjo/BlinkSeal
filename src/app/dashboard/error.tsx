"use client";

import { AlertTriangle } from "lucide-react";

export default function DashboardError({
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[480px] items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-xl shadow-slate-200/50">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50">
          <AlertTriangle className="h-7 w-7 text-red-500" />
        </div>
        <h1 className="text-xl font-semibold text-slate-900">Dashboard could not load</h1>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          The app shell is online. A backend setting still needs attention before document data can load.
        </p>
        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={reset}
            className="inline-flex h-10 items-center justify-center rounded-lg bg-[#0066CC] px-4 text-sm font-medium text-white transition-colors hover:bg-[#0052A3]"
          >
            Try again
          </button>
        </div>
      </div>
    </div>
  );
}
