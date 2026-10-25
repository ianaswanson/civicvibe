import type { Metadata } from "next";
import Link from "next/link";
import { getIndex } from "@/lib/system";
import { CopyNeeded } from "@/components/CopyNeeded";
import { PageHead } from "@/components/PageHead";
import { StatusBadge } from "@/components/StatusBadge";
import { WhoIsWriting } from "@/components/WhoIsWriting";

export const metadata: Metadata = {
  title: "The system",
  description: "One team, one service, one roadmap. Here's the whole system on one page.",
};

// The process flow and artifact chain, as written in the system README.
const processFlow = [
  "Capture ideas",
  "Set direction",
  "Plan the quarter",
  "Discover",
  "Slice the work",
  "Build and release",
  "Review the sprint",
  "Enable",
];
const artifactChain = ["Idea", "Initiative", "Solutions", "Deliverable", "User story"];

// Door 2. First screen is wireframe sentences 12-15, verbatim.
export default function SystemPage() {
  const { docs, planned, templates } = getIndex();

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

        <section id="templates" className="mt-16 scroll-mt-8">
          <p className="max-w-measure font-display text-h4 font-extrabold text-paper">
            The files. Blank template plus a filled DMV example for each.
          </p>
          <ul className="mt-6 grid gap-x-8 gap-y-1 sm:grid-cols-2 lg:grid-cols-3">
            {templates.map((t) => (
              <li key={t.slug}>
                <Link
                  href={`/templates/${t.slug}`}
                  className="group block border-b border-paper/15 py-3 hover:border-door-lit"
                >
                  <span className="block font-display font-bold text-paper group-hover:text-door-lit">
                    {t.artifact}
                  </span>
                  <span className="block text-small text-paper/60">{t.changes}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <div className="mt-16 max-w-measure">
          <p className="text-body text-paper/85 md:text-body-lg">
            Then: what AI changes about the team and the prompts that do it.{" "}
            <Link href="/system/leading-the-change" className="link">
              How to adopt it in one quarter.
            </Link>{" "}
            What broke when it was used.
          </p>
          <CopyNeeded what="what AI changes about the team, and the prompts that do it" />
          <CopyNeeded what="what broke when it was used" />
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

function Chain({ items, numbered = false }: { items: string[]; numbered?: boolean }) {
  return (
    <ol className="flex flex-wrap items-center gap-x-3 gap-y-2 border-l-4 border-door-lit bg-ink-raised px-4 py-3 font-display text-body font-bold text-paper">
      {items.map((item, i) => (
        <li key={item} className="flex items-center gap-2">
          {i > 0 && (
            <span aria-hidden="true" className="text-door-lit">
              →
            </span>
          )}
          <span>
            {numbered && <span className="font-mono text-small text-door-lit">{i + 1} </span>}
            {item}
          </span>
        </li>
      ))}
    </ol>
  );
}
