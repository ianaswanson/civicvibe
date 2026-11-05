import Link from "next/link";
import type { DeckMeta } from "@/lib/system";

// The decks in rollout order: who each is for and what it should leave behind.
export function DeckList({ decks }: { decks: DeckMeta[] }) {
  return (
    <ol className="mt-8 max-w-3xl divide-y divide-paper/15 border-y border-paper/15">
      {decks.map((d) => (
        <li key={d.slug}>
          <Link href={`/system/decks/${d.slug}`} className="group flex gap-4 py-4">
            <span className="w-8 shrink-0 font-mono text-small text-door-lit">{d.order}</span>
            <span className="min-w-0 flex-1">
              <span className="block font-display text-small font-bold uppercase tracking-wide text-paper/60">{d.step}</span>
              <span className="block font-display text-body-lg font-bold text-paper decoration-door-lit decoration-2 underline-offset-4 group-hover:underline">
                {d.title}
              </span>
              <span className="mt-1 block text-small text-paper/85">
                For {d.audience.charAt(0).toLowerCase() + d.audience.slice(1)}. Leaves behind: {d.leaves}
              </span>
            </span>
            <span className="shrink-0 self-start font-mono text-small text-paper/50">{d.slides} slides</span>
          </Link>
        </li>
      ))}
    </ol>
  );
}
