import Link from "next/link";

// A visible hole where copy hasn't been written yet. Never replace with filler.
// `see` points at what exists in the system for now.
export function CopyNeeded({ what, see }: { what: string; see?: { href: string; label: string } }) {
  return (
    <div className="my-6 border-2 border-dashed border-door-magenta px-4 py-3">
      <p className="font-mono text-small text-door-pink">[copy needed: {what}]</p>
      {see && (
        <p className="mt-2 text-small text-paper/85">
          For now:{" "}
          <Link href={see.href} className="link">
            {see.label}
          </Link>
        </p>
      )}
    </div>
  );
}
