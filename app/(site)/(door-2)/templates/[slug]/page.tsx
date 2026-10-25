import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getIndex, getTemplate, renderMarkdown, GITHUB_REPO } from "@/lib/system";
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
  const [introHtml, blankHtml, exampleHtml] = await Promise.all([
    renderMarkdown(intro),
    renderMarkdown(blank),
    renderMarkdown(example),
  ]);

  return (
    <article className="container-page py-12 md:py-16">
      <div className="max-w-4xl">
        <p className="font-display text-small font-bold text-paper/60">
          <Link href="/system#templates" className="hover:text-door-lit hover:underline">
            Templates
          </Link>
        </p>
        <h1 className="mt-4 font-display text-h2 font-extrabold text-paper md:text-h1">{meta.title}</h1>
        <div className="mt-6">
          <Prose html={introHtml} />
        </div>

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
      </div>
    </article>
  );
}
