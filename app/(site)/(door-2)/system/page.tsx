import type { Metadata } from "next";
import Link from "next/link";
import { getIndex, getProcessMap } from "@/lib/system";
import { BoardFigure } from "@/components/BoardFigure";
import { DeckList } from "@/components/DeckList";
import { PageHead } from "@/components/PageHead";
import { StatusBadge } from "@/components/StatusBadge";
import { TemplateList } from "@/components/TemplateList";
import { WhoIsWriting } from "@/components/WhoIsWriting";

export const metadata: Metadata = {
  title: "The system",
  description: "One team, one service, one roadmap. Here's the whole system on one page.",
};

// The artifact chain, as written in the system README, with each link's template.
const artifactChain = [
  { label: "Idea", href: "/templates/idea" },
  { label: "Initiative", href: "/templates/initiative" },
  { label: "Solutions", href: "/templates/solution" },
  { label: "Deliverable", href: "/templates/deliverable" },
  { label: "User story", href: "/templates/user-story" },
];

// Door 2. First screen is wireframe sentences 12-15, verbatim.
export default function SystemPage() {
  const { docs, planned, templates, board, decks } = getIndex();
  const map = getProcessMap();
  const processFlow = map.map((s) => ({ label: s.step, href: `#step-${s.step.toLowerCase().replace(/\s+/g, "-")}` }));

  return (
    <>
      <div className="container-page py-12 md:py-20">
        <PageHead door={2}>
          <p className="font-display text-h3 font-extrabold text-paper md:text-h1">
            One team, one service, one roadmap. Here&apos;s the whole system on{" "}
            <span className="ruled whitespace-nowrap">one page</span>.
          </p>
        </PageHead>

        <div className="mt-14 space-y-4">
          <Chain items={processFlow} numbered />
          <Chain items={artifactChain} />
        </div>

        <p className="mt-10 max-w-measure text-body text-paper/85 md:text-body-lg">
          Every example below runs on the same made-up Oregon DMV service, so
          the pieces connect and you can see how one thing becomes the next.
        </p>

        {board.overview && (
          <section className="mt-12">
            <BoardFigure visual={board.overview} priority />
            <p className="mt-3 text-small text-paper/60">
              From the{" "}
              <a href={board.url} className="link">
                board
              </a>
              , where the whole system is drawn chapter by chapter.
            </p>
          </section>
        )}

        <section id="map" aria-label="The process flow, step by step" className="mt-12 scroll-mt-8">
          <ol className="max-w-4xl divide-y divide-paper/15 border-y border-paper/15">
            {map.map((s, i) => (
              <li
                key={s.step}
                id={processFlow[i].href.slice(1)}
                className="flex scroll-mt-8 flex-wrap items-baseline gap-x-4 gap-y-1 py-3"
              >
                <span className="w-8 shrink-0 font-mono text-small text-door-lit">{i + 1}</span>
                <span className="w-44 shrink-0 font-display font-extrabold text-paper">{s.step}</span>
                <span className="min-w-0 flex-1 text-small">
                  {s.docs.map((d, n) => (
                    <span key={d.slug}>
                      {n > 0 && ", "}
                      <Link href={`/system/${d.slug}`} className="link">
                        {d.title}
                      </Link>
                    </span>
                  ))}
                  {s.files.length > 0 && (
                    <span className="block text-paper/60">
                      {s.files.map((t, n) => (
                        <span key={t.slug}>
                          {n > 0 && " · "}
                          <Link href={`/templates/${t.slug}`} className="hover:text-door-lit hover:underline">
                            {t.artifact}
                          </Link>
                        </span>
                      ))}
                    </span>
                  )}
                </span>
              </li>
            ))}
          </ol>
        </section>

        <section id="templates" className="mt-16 scroll-mt-8">
          <p className="max-w-measure font-display text-h4 font-extrabold text-paper">
            The files. Blank template plus a filled DMV example for each.
          </p>
          <TemplateList templates={templates} />
          <p className="mt-6 text-small">
            <Link href="/templates" className="link">
              Follow the DMV example through every template, in order
            </Link>
          </p>
        </section>

        <section id="decks" className="mt-16 scroll-mt-8">
          <p className="max-w-measure font-display text-h4 font-extrabold text-paper">
            The practice sessions. Each one taught the week before the team first uses it.
          </p>
          <DeckList decks={decks.filter((d) => d.kind === "practice")} />
          <p className="mt-6 text-small">
            <Link href="/system/decks" className="link">
              All eight decks, in the order a team hears them
            </Link>
            , including the three that bring leaders, partners and the team along.
          </p>
        </section>

        <div className="mt-16 max-w-measure">
          <p className="text-body text-paper/85 md:text-body-lg">
            Then: what AI changes about the team and the prompts that do it.{" "}
            <Link href="/system/leading-the-change" className="link">
              How to adopt it in one quarter.
            </Link>{" "}
            What broke when it was used.
          </p>
          {/* "What AI changes about the team" has no page yet: doc 16, Agent setup, is the next document (cv-vy1.9). */}
          <div className="mt-8">
            <h2 className="font-display text-h4 font-extrabold text-paper">What broke when it was used</h2>
            <ul className="mt-3 space-y-3 text-small text-paper/85">
              <li>
                One early planning week gave the technical maintenance session an hour, and the foundation slipped.
                The session is now a half day and the rule is don&apos;t skip it.{" "}
                <Link href="/system/decks/how-we-plan-the-quarter#slide-8" className="link">
                  Planning deck, slide 8
                </Link>
                .
              </li>
              <li>
                A team that went through this before had no written definition of ready, no definition of done and
                no sprint goal, so the gaps were agreements nobody had written down, not effort.{" "}
                <Link href="/system/decks/how-we-run-a-sprint#slide-2" className="link">
                  Sprint deck, slide 2
                </Link>
                .
              </li>
              <li>
                The first quarter can miss. Teams new to planning don&apos;t know how to commit yet, and committing
                is how they learn; the fix is to say what isn&apos;t ready, not to skip committing.{" "}
                <Link href="/system/leading-the-change" className="link">
                  Leading the change
                </Link>
                .
              </li>
            </ul>
          </div>
        </div>

        <section id="documents" className="mt-16 scroll-mt-8">
          <h2 className="font-display text-h3 font-extrabold text-paper md:text-h2">Documents</h2>
          <ol className="mt-6 max-w-3xl divide-y divide-paper/15 border-y border-paper/15">
            {docs.map((d) => (
              <li key={d.slug}>
                <Link
                  href={`/system/${d.slug}`}
                  className="group flex items-baseline gap-4 py-3"
                >
                  <span className="w-8 shrink-0 font-mono text-small text-door-lit">
                    {String(d.order).padStart(2, "0")}
                  </span>
                  <span className="flex-1 font-display font-bold text-paper decoration-door-lit decoration-2 underline-offset-4 group-hover:underline">
                    {d.title}
                  </span>
                  <StatusBadge status={d.status} />
                </Link>
              </li>
            ))}
            {planned.map((d) => (
              <li key={d.order} className="flex items-baseline gap-4 py-3">
                <span className="w-8 shrink-0 font-mono text-small text-paper/50">
                  {String(d.order).padStart(2, "0")}
                </span>
                <span className="flex-1 text-paper/50">{d.title}</span>
                <StatusBadge status={d.status} />
              </li>
            ))}
          </ol>
        </section>
      </div>
      <WhoIsWriting />
    </>
  );
}

function Chain({ items, numbered = false }: { items: { label: string; href: string }[]; numbered?: boolean }) {
  return (
    <ol className="flex flex-wrap items-center gap-x-3 gap-y-2 border-l-4 border-door-lit bg-ink-raised px-4 py-3 font-display text-body font-bold text-paper">
      {items.map((item, i) => (
        <li key={item.label} className="flex items-center gap-2">
          {i > 0 && (
            <span aria-hidden="true" className="text-door-lit">
              →
            </span>
          )}
          <Link href={item.href} className="decoration-door-lit decoration-2 underline-offset-4 hover:underline">
            {numbered && <span className="font-mono text-small text-door-lit">{i + 1} </span>}
            {item.label}
          </Link>
        </li>
      ))}
    </ol>
  );
}
