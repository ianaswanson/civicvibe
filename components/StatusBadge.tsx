export function StatusBadge({ status }: { status: string }) {
  if (!status) return null;
  return (
    <span className="inline-block rounded border border-secondary-300 px-2 py-0.5 text-xs font-medium uppercase tracking-wide text-secondary-600">
      {status}
    </span>
  );
}
