export function StatusBadge({ status }: { status: string }) {
  if (!status) return null;
  return (
    <span className="inline-block border border-paper/30 px-2 py-0.5 font-display text-small font-bold uppercase leading-none tracking-wider text-paper/75">
      {status}
    </span>
  );
}
