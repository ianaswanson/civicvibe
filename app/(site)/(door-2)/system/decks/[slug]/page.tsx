import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDeck, getIndex, GITHUB_REPO } from "@/lib/system";
import { SlideFrame } from "@/components/SlideFrame";

export function generateStaticParams() {
  return getIndex().decks.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const deck = getDeck(slug);
  if (!deck) return {};
  return { title: deck.title, description: `${deck.step}. For ${deck.audience}. ${deck.leaves}` };
}

// One deck: every slide at the column's width, its speaker notes under it.
export default async function DeckPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const deck = getDeck(slug);
  if (!deck) notFound();
  const { decks, docs } = getIndex();
  const teaches = deck.docs.map((d) => docs.find((x) => x.slug === d)!);
  const i = decks.findIndex((d) => d.slug === slug);
  const prev = decks[i - 1];
  const next = decks[i + 1];
  // Which slide starts each section, for the small labels.
  const sectionAt = new Map(Object.values(deck.sections).map((s) => [s.start, s.description]));

  return (
    <article className="container-page py-12 md:py-16">
      {deck.fonts.map((href) => (
        <link key={href} rel="stylesheet" href={href} />
      ))}
      <div className="max-w-3xl">
        <p className="flex flex-wrap items-center gap-3 font-display text-small font-bold text-paper/60">
          <Link href="/system" className="hover:text-door-lit hover:underline">
            The system
          </Link>
          <span aria-hidden="true">/</span>
          <Link href="/system/decks" className="hover:text-door-lit hover:underline">
            Decks
          </Link>
          <span aria-hidden="true">/</span>
          <span className="font-mono text-door-lit">{deck.order}</span>
        </p>
        <p className="mt-6 font-display text-small font-bold uppercase tracking-wide text-paper/60">{deck.step}</p>
        <h1 className="mt-2 font-display text-h2 font-extrabold text-paper md:text-h1">{deck.title}</h1>
        <p className="mt-6 max-w-measure text-body text-paper/85 md:text-body-lg">
          For {deck.audience.charAt(0).toLowerCase() + deck.audience.slice(1)}. What it should leave behind: {deck.leaves}
          {deck.run && <> Run it {deck.run.charAt(0).toLowerCase() + deck.run.slice(1)}</>}
        </p>
        {teaches.length > 0 && (
          <p className="mt-4 text-small text-paper/85">
            Teaches{" "}
            {teaches.map((d, n) => (
              <span key={d.slug}>
                {n > 0 && ", "}
                <Link href={`/system/${d.slug}`} className="link">
                  <span className="font-mono text-door-lit">{String(d.order).padStart(2, "0")}</span> {d.title}
                </Link>
              </span>
            ))}
            .
          </p>
        )}
        <p className="mt-4 flex flex-wrap gap-x-6 gap-y-1 text-small text-paper/60">
          <span>{deck.slides.length} slides</span>
          {deck.pdf ? (
            <a href={deck.pdf} download className="link">
              Download the PDF
            </a>
          ) : (
            <span>PDF coming</span>
          )}
        </p>
      </div>

      <ol className="mt-12 max-w-4xl space-y-12">
        {deck.slides.map((s, n) => (
          <li key={s.id} id={`slide-${n + 1}`} className="scroll-mt-8">
            {sectionAt.has(s.id) && (
              <p className="mb-3 font-display text-small font-bold text-door-lit">{sectionAt.get(s.id)}</p>
            )}
            <SlideFrame html={s.html} label={`Slide ${n + 1} of ${deck.slides.length}`} />
            <div className="mt-3 flex gap-4">
              <span className="w-8 shrink-0 font-mono text-small text-paper/50">{n + 1}</span>
              {s.notes ? (
                <p className="max-w-measure text-small text-paper/85">{s.notes}</p>
              ) : (
                <p className="text-small text-paper/50">No notes.</p>
              )}
            </div>
          </li>
        ))}
      </ol>

      <nav className="mt-16 flex max-w-4xl flex-wrap justify-between gap-4 border-t border-paper/15 pt-6 text-small" aria-label="Next deck">
        {prev ? (
          <Link href={`/system/decks/${prev.slug}`} className="link">
            ← {prev.title}
          </Link>
        ) : (
          <span />
        )}
        {next && (
          <Link href={`/system/decks/${next.slug}`} className="link">
            {next.title} →
          </Link>
        )}
      </nav>

      <p className="mt-12 text-small">
        <a href={`${GITHUB_REPO}/blob/main/${deck.source}`} className="link">
          Source
        </a>
      </p>
    </article>
  );
}
