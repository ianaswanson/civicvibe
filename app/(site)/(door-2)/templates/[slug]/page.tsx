import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getIndex, getTemplate, renderMarkdown, GITHUB_REPO } from "@/lib/system";
import { Arrow } from "@/components/Arrow";
import { Prose } from "@/components/Prose";
import { TemplateTabs } from "@/components/TemplateTabs";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getIndex().templates.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const template = getTemplate(slug);
  if (!template) return {};
  return {
    title: `${template.meta.title} template`,
    description: template.meta.description || "[copy needed]",
  };
}

export default async function TemplatePage({ params }: Params) {
  const { slug } = await params;
  const template = getTemplate(slug);
  if (!template) notFound();

  const { meta, intro, blank, example } = template;
  const { docs, templates } = getIndex();
  const i = templates.findIndex((t) => t.slug === slug);
  const { visuals } = templates[i];
  const explainedIn = templates[i].docs.map((d) => docs.find((x) => x.slug === d)!);
  const prev = templates[i - 1];
  const next = templates[i + 1];
  const [introHtml, blankHtml, exampleHtml] = await Promise.all([
    renderMarkdown(intro),
    renderMarkdown(blank),
    renderMarkdown(example),
  ]);

  return (
    <article className="container-page py-12 md:py-16">
      <div className="max-w-4xl">
        <p className="font-display text-small font-bold text-paper/60">
          <Link href="/templates" className="hover:text-door-lit hover:underline">
            Templates
          </Link>
        </p>
        <h1 className="mt-4 font-display text-h2 font-extrabold text-paper md:text-h1">{meta.title}</h1>
        <div className="mt-6">
          <Prose html={introHtml} />
        </div>

        {explainedIn.length > 0 && (
          <p className="mt-6 text-small text-paper/60">
            Explained in{" "}
            {explainedIn.map((d, n) => (
              <span key={d.slug}>
                {n > 0 && (n === explainedIn.length - 1 ? " and " : ", ")}
                <Link href={`/system/${d.slug}`} className="link">
                  {d.title}
                </Link>
              </span>
            ))}
            .
          </p>
        )}

        {visuals && (
          <div className="mt-6 flex flex-wrap gap-x-8 gap-y-2 border-l-4 border-door-lit bg-ink-raised px-4 py-3 text-small">
            <span className="font-display font-bold text-paper">One-page visual</span>
            {visuals.template && (
              <span>
                <a href={visuals.template} className="link">Template</a>{" "}
                <a href={visuals.template} download={`${slug}-template.html`} className="text-paper/60 hover:text-door-lit">(download)</a>
              </span>
            )}
            {visuals.example && (
              <span>
                <a href={visuals.example} className="link">DMV example</a>{" "}
                <a href={visuals.example} download={`${slug}-dmv-example.html`} className="text-paper/60 hover:text-door-lit">(download)</a>
              </span>
            )}
          </div>
        )}

        <div className="mt-10">
          <TemplateTabs
            panels={[
              {
                label: "Template",
                filename: `${slug}-template.md`,
                markdown: `# ${meta.title}\n\n${blank}`,
                html: blankHtml,
              },
              {
                label: "DMV example",
                filename: `${slug}-dmv-example.md`,
                markdown: `# ${meta.title}: DMV example\n\n${example}`,
                html: exampleHtml,
                hash: "dmv-example",
              },
            ]}
          />
        </div>

        <p className="mt-12 text-small">
          <a
            href={`${GITHUB_REPO}/blob/main/content/templates/${slug}.md`}
            className="link"
          >
            Source
          </a>
        </p>

        <nav aria-label="The DMV example, in order" className="mt-8 grid gap-6 border-t border-paper/15 pt-6 sm:grid-cols-2">
          {prev ? (
            <Link href={`/templates/${prev.slug}#dmv-example`} className="group block">
              <span className="text-small text-paper/60">Previous in the DMV example</span>
              <span className="block font-display text-body-lg font-extrabold leading-tight text-paper decoration-door-lit decoration-4 underline-offset-4 group-hover:underline">
                {prev.artifact}
              </span>
            </Link>
          ) : (
            <span />
          )}
          {next && (
            <Link href={`/templates/${next.slug}#dmv-example`} className="group block sm:text-right">
              <span className="text-small text-paper/60">Next in the DMV example</span>
              <span className="block font-display text-body-lg font-extrabold leading-tight text-paper decoration-door-lit decoration-4 underline-offset-4 group-hover:underline">
                {next.artifact}
              </span>
              <Arrow className="mt-2 h-4 w-14 text-door-lit transition-transform group-hover:translate-x-2 sm:ml-auto" />
            </Link>
          )}
        </nav>
      </div>
    </article>
  );
}
