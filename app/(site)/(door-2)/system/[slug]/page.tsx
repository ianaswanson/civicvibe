import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDoc, getDocTemplate, getIndex, renderMarkdown, GITHUB_REPO } from "@/lib/system";
import { Arrow } from "@/components/Arrow";
import { Prose } from "@/components/Prose";
import { StatusBadge } from "@/components/StatusBadge";
import { TemplateList } from "@/components/TemplateList";
import { TemplateTabs } from "@/components/TemplateTabs";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getIndex().docs.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const doc = getDoc(slug);
  if (!doc) return {};
  return {
    title: doc.meta.title,
    description: doc.meta.description || "[copy needed]",
  };
}

export default async function DocPage({ params }: Params) {
  const { slug } = await params;
  const doc = getDoc(slug);
  if (!doc) notFound();

  const { docs, templates } = getIndex();
  const i = docs.findIndex((d) => d.slug === slug);
  const meta = docs[i];
  const prev = docs[i - 1];
  const next = docs[i + 1];
  const files = meta.templates.map((t) => templates.find((x) => x.slug === t)!);
  const inline = meta.inlineTemplate ? getDocTemplate(doc.content) : null;
  const [html, blankHtml, exampleHtml, afterHtml] = await Promise.all(
    inline
      ? [inline.before, inline.blank, inline.example, inline.after].map(renderMarkdown)
      : [renderMarkdown(doc.content)],
  );

  return (
    <article className="container-page py-12 md:py-16">
      <div className="max-w-3xl">
        <p className="flex flex-wrap items-center gap-3 font-display text-small font-bold text-paper/60">
          <Link href="/system#documents" className="hover:text-door-lit hover:underline">
            The system
          </Link>
          <span aria-hidden="true">/</span>
          <span className="font-mono text-door-lit">{String(doc.meta.order).padStart(2, "0")}</span>
          <StatusBadge status={doc.meta.status} />
        </p>
        <h1 className="mt-4 font-display text-h2 font-extrabold text-paper md:text-h1">{doc.meta.title}</h1>
        <div className="mt-10">
          <Prose html={html} />
        </div>

        {inline && (
          <>
            <div className="mt-10">
              <TemplateTabs
                panels={[
                  {
                    label: "Template",
                    filename: `${slug}-template.md`,
                    markdown: `# ${doc.meta.title}\n\n${inline.blank}`,
                    html: blankHtml,
                  },
                  {
                    label: "DMV example",
                    filename: `${slug}-dmv-example.md`,
                    markdown: `# ${doc.meta.title}: DMV example\n\n${inline.example}`,
                    html: exampleHtml,
                    hash: "dmv-example",
                  },
                ]}
              />
            </div>
            <div className="mt-10">
              <Prose html={afterHtml} />
            </div>
          </>
        )}

        {files.length > 0 && (
          <section className="mt-12 border-t border-paper/15 pt-6">
            <h2 className="font-display text-h4 font-extrabold text-paper">Files for this chapter</h2>
            <p className="mt-2 text-small text-paper/60">Blank template plus a filled DMV example for each.</p>
            <TemplateList templates={files} />
          </section>
        )}

        <p className="mt-12 text-small">
          <a
            href={`${GITHUB_REPO}/blob/main/content/system/${slug}.md`}
            className="link"
          >
            Source
          </a>
        </p>

        <nav aria-label="Documents" className="mt-8 grid gap-6 border-t border-paper/15 pt-6 sm:grid-cols-2">
          {prev ? (
            <Link href={`/system/${prev.slug}`} className="group block">
              <span className="text-small text-paper/60">Previous</span>
              <span className="block font-display text-body-lg font-extrabold leading-tight text-paper decoration-door-lit decoration-4 underline-offset-4 group-hover:underline">
                {prev.title}
              </span>
            </Link>
          ) : (
            <span />
          )}
          {next && (
            <Link href={`/system/${next.slug}`} className="group block sm:text-right">
              <span className="text-small text-paper/60">Next</span>
              <span className="block font-display text-body-lg font-extrabold leading-tight text-paper decoration-door-lit decoration-4 underline-offset-4 group-hover:underline">
                {next.title}
              </span>
              <Arrow className="mt-2 h-4 w-14 text-door-lit transition-transform group-hover:translate-x-2 sm:ml-auto" />
            </Link>
          )}
        </nav>
      </div>
    </article>
  );
}
