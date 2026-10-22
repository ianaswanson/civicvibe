// A visible hole where copy hasn't been written yet. Never replace with filler.
export function CopyNeeded({ what }: { what: string }) {
  return (
    <p className="my-6 rounded border border-dashed border-primary-400 bg-primary-50 px-4 py-3 font-mono text-sm text-primary-800">
      [copy needed: {what}]
    </p>
  );
}
