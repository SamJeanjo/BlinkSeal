import { requireCurrentUser } from "@/lib/auth/getCurrentUser";

export default async function SettingsPage() {
  const user = await requireCurrentUser();

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-semibold text-slate-900">Settings</h1>
      <p className="mt-1 text-sm text-slate-500">Account details managed by Clerk.</p>

      <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6">
        <div className="space-y-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Name</p>
            <p className="mt-1 text-sm text-slate-900">{user.name || "Not provided"}</p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Email</p>
            <p className="mt-1 text-sm text-slate-900">{user.email}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
