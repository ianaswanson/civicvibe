// A visible hole where copy hasn't been written yet. Never replace with filler.
export function CopyNeeded({ what }: { what: string }) {
  return (
    <p className="my-6 border-2 border-dashed border-door-magenta px-4 py-3 font-mono text-small text-door-pink">
      [copy needed: {what}]
    </p>
  );
}
