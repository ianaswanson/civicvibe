import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDoc, getIndex, renderMarkdown, GITHUB_REPO } from "@/lib/system";
import { Prose } from "@/components/Prose";
import { StatusBadge } from "@/components/StatusBadge";

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

  const { docs } = getIndex();
  const i = docs.findIndex((d) => d.slug === slug);
  const prev = docs[i - 1];
  const next = docs[i + 1];
  const html = await renderMarkdown(doc.content);

  return (
    <article className="container-page py-12 sm:py-16">
      <div className="max-w-3xl">
        <p className="flex items-center gap-3 text-sm text-secondary-500">
          <Link href="/system#documents" className="hover:text-primary-700 hover:underline">
            The system
          </Link>
          <span aria-hidden="true">/</span>
          <span className="font-mono">{String(doc.meta.order).padStart(2, "0")}</span>
          <StatusBadge status={doc.meta.status} />
        </p>
        <h1 className="mt-4 text-h2 text-secondary-900 sm:text-h1">{doc.meta.title}</h1>
        <div className="mt-8">
          <Prose html={html} />
        </div>

        <p className="mt-12 text-sm">
          <a
            href={`${GITHUB_REPO}/blob/main/content/system/${slug}.md`}
            className="link"
          >
            Source
          </a>
        </p>

        <nav className="mt-8 grid gap-4 border-t border-secondary-200 pt-6 sm:grid-cols-2">
          {prev ? (
            <Link href={`/system/${prev.slug}`} className="group block">
              <span className="text-sm text-secondary-500">Previous</span>
              <span className="block font-medium text-secondary-900 group-hover:text-primary-700 group-hover:underline">
                {prev.title}
              </span>
            </Link>
          ) : (
            <span />
          )}
          {next && (
            <Link href={`/system/${next.slug}`} className="group block sm:text-right">
              <span className="text-sm text-secondary-500">Next</span>
              <span className="block font-medium text-secondary-900 group-hover:text-primary-700 group-hover:underline">
                {next.title}
              </span>
            </Link>
          )}
        </nav>
      </div>
    </article>
  );
}
