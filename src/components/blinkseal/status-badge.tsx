export function StatusBadge({
  revoked,
  expiresAt
}: {
  revoked: boolean;
  expiresAt: string | null;
}) {
  const expired = expiresAt ? new Date(expiresAt).getTime() < Date.now() : false;
  const expiring =
    expiresAt &&
    !expired &&
    new Date(expiresAt).getTime() - Date.now() < 24 * 60 * 60 * 1000;

  if (revoked) return <Pill className="border-slate-200 bg-slate-100 text-slate-600">Revoked</Pill>;
  if (expired) return <Pill className="border-red-200 bg-red-50 text-red-700">Expired</Pill>;
  if (expiring) return <Pill className="border-amber-200 bg-amber-50 text-amber-700">Expiring</Pill>;
  return <Pill className="border-emerald-200 bg-emerald-600 text-white">Active</Pill>;
}

function Pill({ children, className }: { children: React.ReactNode; className: string }) {
  return (
    <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${className}`}>
      {children}
    </span>
  );
}
