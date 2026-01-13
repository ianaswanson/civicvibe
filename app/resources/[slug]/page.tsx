import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { getArticleBySlug, getArticles } from "@/lib/mdx";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const articles = getArticles();
  return articles.map((article) => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    return {
      title: "Article Not Found",
    };
  }

  return {
    title: article.meta.title,
    description: article.meta.description,
  };
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  return (
    <div className="py-16">
      <div className="container-page">
        <div className="mx-auto max-w-3xl">
          <Link
            href="/resources"
            className="mb-8 inline-flex items-center text-sm text-secondary-600 hover:text-primary-600"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Resources
          </Link>

          <header className="mb-12">
            {article.meta.category && (
              <span className="mb-4 inline-block rounded-full bg-primary-100 px-3 py-1 text-sm font-medium text-primary-700">
                {article.meta.category}
              </span>
            )}
            <h1 className="mb-4 text-h1 text-secondary-900">
              {article.meta.title}
            </h1>
            <p className="mb-6 text-body-lg text-secondary-600">
              {article.meta.description}
            </p>
            <div className="flex items-center gap-4 text-sm text-secondary-500">
              {article.meta.author && <span>By {article.meta.author}</span>}
              <span>
                {new Date(article.meta.date).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>
          </header>

          <article className="prose prose-lg prose-slate max-w-none prose-headings:text-secondary-900 prose-a:text-primary-600 prose-a:no-underline hover:prose-a:underline">
            <MDXRemote
              source={article.content}
              options={{
                mdxOptions: {
                  remarkPlugins: [remarkGfm],
                },
              }}
            />
          </article>

          {article.meta.tags && article.meta.tags.length > 0 && (
            <footer className="mt-12 border-t border-secondary-200 pt-8">
              <div className="flex flex-wrap gap-2">
                {article.meta.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-secondary-100 px-3 py-1 text-sm text-secondary-600"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </footer>
          )}
        </div>
      </div>
    </div>
  );
}
