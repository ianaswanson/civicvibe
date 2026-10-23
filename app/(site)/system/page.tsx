import type { Metadata } from "next";
import Link from "next/link";
import { getIndex } from "@/lib/system";
import { CopyNeeded } from "@/components/CopyNeeded";
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
      <div className="container-page py-16 sm:py-20">
        <p className="max-w-2xl text-body-xl font-semibold text-secondary-900">
          One team, one service, one roadmap. Here&apos;s the whole system on
          one page.
        </p>

        <div className="mt-10 space-y-4">
          <Chain items={processFlow} numbered />
          <Chain items={artifactChain} />
        </div>

        <p className="mt-10 max-w-2xl text-body-lg text-secondary-700">
          Every example below runs on the same made-up Oregon DMV service, so
          the pieces connect and you can see how one thing becomes the next.
        </p>

        <section id="templates" className="mt-14 scroll-mt-8">
          <p className="max-w-2xl text-body-lg text-secondary-800">
            The files. Blank template plus a filled DMV example for each.
          </p>
          <ul className="mt-6 grid gap-x-8 gap-y-1 sm:grid-cols-2 lg:grid-cols-3">
            {templates.map((t) => (
              <li key={t.slug}>
                <Link
                  href={`/templates/${t.slug}`}
                  className="group block border-b border-secondary-200 py-3 hover:border-primary-600"
                >
                  <span className="block font-medium text-secondary-900 group-hover:text-primary-700">
                    {t.artifact}
                  </span>
                  <span className="block text-sm text-secondary-500">{t.changes}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <div className="mt-14 max-w-2xl">
          <p className="text-body-lg text-secondary-800">
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
          <h2 className="text-h3 text-secondary-900">Documents</h2>
          <ol className="mt-6 max-w-3xl divide-y divide-secondary-200 border-y border-secondary-200">
            {docs.map((d) => (
              <li key={d.slug}>
                <Link
                  href={`/system/${d.slug}`}
                  className="group flex items-baseline gap-4 py-3"
                >
                  <span className="w-8 shrink-0 font-mono text-sm text-secondary-400">
                    {String(d.order).padStart(2, "0")}
                  </span>
                  <span className="flex-1 font-medium text-secondary-900 group-hover:text-primary-700 group-hover:underline">
                    {d.title}
                  </span>
                  <StatusBadge status={d.status} />
                </Link>
              </li>
            ))}
            {planned.map((d) => (
              <li key={d.order} className="flex items-baseline gap-4 py-3">
                <span className="w-8 shrink-0 font-mono text-sm text-secondary-400">
                  {String(d.order).padStart(2, "0")}
                </span>
                <span className="flex-1 text-secondary-500">{d.title}</span>
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
    <ol className="flex flex-wrap items-center gap-x-2 gap-y-2 rounded bg-secondary-50 px-4 py-3 font-mono text-sm text-secondary-800">
      {items.map((item, i) => (
        <li key={item} className="flex items-center gap-2">
          {i > 0 && (
            <span aria-hidden="true" className="text-primary-600">
              →
            </span>
          )}
          <span>
            {numbered && <span className="text-secondary-400">{i + 1} </span>}
            {item}
          </span>
        </li>
      ))}
    </ol>
  );
}
