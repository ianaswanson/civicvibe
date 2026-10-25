import type { Metadata } from "next";
import Link from "next/link";
import { getIndex } from "@/lib/system";

export const metadata: Metadata = {
  title: "Templates",
  description: "The files. Blank template plus a filled DMV example for each.",
};

// Every template in the order of the artifact chain, so the DMV examples read
// start to end: one thing becomes the next.
export default function TemplatesPage() {
  const { docs, templates } = getIndex();

  return (
    <article className="container-page py-12 md:py-16">
      <div className="max-w-4xl">
        <p className="font-display text-small font-bold text-paper/60">
          <Link href="/system" className="hover:text-door-lit hover:underline">
            The system
          </Link>
        </p>
        <h1 className="mt-4 font-display text-h2 font-extrabold text-paper md:text-h1">Templates</h1>
        <p className="mt-6 max-w-measure text-body text-paper/85 md:text-body-lg">
          The files. Blank template plus a filled DMV example for each. Every
          example runs on the same made-up Oregon DMV service, so the pieces
          connect and you can see how one thing becomes the next.
        </p>

        <ol className="mt-10 divide-y divide-paper/15 border-y border-paper/15">
          {templates.map((t) => {
            const explainedIn = t.docs.map((d) => docs.find((x) => x.slug === d)!);
            return (
              <li key={t.slug} className="flex flex-wrap items-baseline gap-x-4 gap-y-1 py-4">
                <span className="w-8 shrink-0 font-mono text-small text-door-lit">{String(t.order).padStart(2, "0")}</span>
                <div className="min-w-0 flex-1">
                  <Link
                    href={`/templates/${t.slug}`}
                    className="font-display text-body-lg font-extrabold text-paper decoration-door-lit decoration-2 underline-offset-4 hover:underline"
                  >
                    {t.artifact}
                  </Link>
                  <p className="text-small text-paper/60">
                    {t.changes}
                    {explainedIn.length > 0 && (
                      <>
                        {" · "}
                        {explainedIn.map((d, n) => (
                          <span key={d.slug}>
                            {n > 0 && ", "}
                            <Link href={`/system/${d.slug}`} className="hover:text-door-lit hover:underline">
                              {d.title}
                            </Link>
                          </span>
                        ))}
                      </>
                    )}
                  </p>
                </div>
                <p className="flex w-full gap-4 pl-12 text-small sm:w-auto sm:pl-0">
                  <Link href={`/templates/${t.slug}`} className="link">
                    Template
                  </Link>
                  <Link href={`/templates/${t.slug}#dmv-example`} className="link">
                    DMV example
                  </Link>
                </p>
              </li>
            );
          })}
        </ol>
      </div>
    </article>
  );
}
