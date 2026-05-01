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

  if (revoked) return <Pill className="bg-slate-100 text-slate-600">Revoked</Pill>;
  if (expired) return <Pill className="bg-red-50 text-red-700">Expired</Pill>;
  if (expiring) return <Pill className="bg-amber-50 text-amber-700">Expiring</Pill>;
  return <Pill className="bg-emerald-50 text-emerald-700">Active</Pill>;
}

function Pill({ children, className }: { children: React.ReactNode; className: string }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${className}`}>
      {children}
    </span>
  );
}
