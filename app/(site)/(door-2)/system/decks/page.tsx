import type { Metadata } from "next";
import Link from "next/link";
import { getIndex } from "@/lib/system";
import { DeckList } from "@/components/DeckList";

export const metadata: Metadata = {
  title: "Decks",
  description: "The eight decks, in the order a team hears them: leaders, partners, the team, then each practice right before its first use.",
};

export default function DecksPage() {
  const { decks } = getIndex();
  return (
    <article className="container-page py-12 md:py-16">
      <div className="max-w-3xl">
        <p className="font-display text-small font-bold text-paper/60">
          <Link href="/system" className="hover:text-door-lit hover:underline">
            The system
          </Link>
        </p>
        <h1 className="mt-4 font-display text-h2 font-extrabold text-paper md:text-h1">Decks</h1>
        <p className="mt-6 max-w-measure text-body text-paper/85 md:text-body-lg">
          Eight decks, in the order a team hears them: leaders first, then partners, then the whole team,
          then each practice the week before the team first uses it. Every slide carries its speaker notes.{" "}
          <Link href="/system/leading-the-change" className="link">
            Why this order
          </Link>
          .
        </p>
      </div>
      <DeckList decks={decks} />
    </article>
  );
}
