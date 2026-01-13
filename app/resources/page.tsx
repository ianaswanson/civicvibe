import Link from "next/link";
import { getArticles } from "@/lib/mdx";
import { getTools, type Tool } from "@/lib/tools";
import { ArrowRight, ExternalLink } from "lucide-react";

export const metadata = {
  title: "Resources",
  description:
    "Articles, tools, and resources for government digital transformation and AI adoption.",
};

export default function ResourcesPage() {
  const articles = getArticles();
  const tools = getTools();

  return (
    <div className="py-16">
      <div className="container-page">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-h1 text-secondary-900">Resources</h1>
          <p className="mx-auto max-w-2xl text-body-lg text-secondary-600">
            Articles, tools, and resources for government digital transformation
            and AI adoption. Everything is free and open source.
          </p>
        </div>

        {/* Tools Section */}
        {tools.length > 0 && (
          <div className="mb-16">
            <h2 className="mb-6 text-h3 text-secondary-900">Tools</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {tools.map((tool) => (
                <ToolCard key={tool.slug} tool={tool} />
              ))}
            </div>
          </div>
        )}

        {/* Articles Section */}
        <div>
          <h2 className="mb-6 text-h3 text-secondary-900">Articles</h2>
          {articles.length === 0 ? (
            <div className="rounded-xl border border-secondary-200 bg-secondary-50 p-12 text-center">
              <p className="text-secondary-600">
                Check back for articles on government digital transformation.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {articles.map((article) => (
                <ArticleCard key={article.slug} article={article} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ToolCard({ tool }: { tool: Tool }) {
  return (
    <a
      href={tool.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group rounded-xl border border-secondary-200 bg-white p-6 transition-all hover:border-primary-300 hover:shadow-md"
    >
      <span className="mb-2 inline-block rounded-full bg-teal-100 px-3 py-1 text-sm font-medium text-teal-700">
        {tool.category}
      </span>
      <h3 className="mb-2 text-h4 text-secondary-900 group-hover:text-primary-600">
        {tool.title}
      </h3>
      <p className="mb-4 text-secondary-600">{tool.description}</p>
      <span className="flex items-center text-sm font-medium text-primary-600 group-hover:text-primary-700">
        View on GitHub
        <ExternalLink className="ml-1 h-4 w-4" />
      </span>
    </a>
  );
}

function ArticleCard({
  article,
}: {
  article: {
    slug: string;
    title: string;
    description: string;
    date: string;
    category?: string;
  };
}) {
  return (
    <Link
      href={`/resources/${article.slug}`}
      className="group rounded-xl border border-secondary-200 bg-white p-6 transition-all hover:border-primary-300 hover:shadow-md"
    >
      {article.category && (
        <span className="mb-2 inline-block rounded-full bg-primary-100 px-3 py-1 text-sm font-medium text-primary-700">
          {article.category}
        </span>
      )}
      <h3 className="mb-2 text-h4 text-secondary-900 group-hover:text-primary-600">
        {article.title}
      </h3>
      <p className="mb-4 text-secondary-600">{article.description}</p>
      <div className="flex items-center justify-between">
        <span className="text-sm text-secondary-400">
          {new Date(article.date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </span>
        <span className="flex items-center text-sm font-medium text-primary-600 group-hover:text-primary-700">
          Read more
          <ArrowRight className="ml-1 h-4 w-4" />
        </span>
      </div>
    </Link>
  );
}
