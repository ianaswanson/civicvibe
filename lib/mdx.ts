import fs from "fs";
import path from "path";
import matter from "gray-matter";

const contentDirectory = path.join(process.cwd(), "content");

export interface ArticleMeta {
  slug: string;
  title: string;
  description: string;
  date: string;
  author?: string;
  category?: string;
  tags?: string[];
}

export function getArticles(): ArticleMeta[] {
  const articlesPath = path.join(contentDirectory, "articles");

  if (!fs.existsSync(articlesPath)) {
    return [];
  }

  const files = fs.readdirSync(articlesPath);

  const articles = files
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => {
      const filePath = path.join(articlesPath, file);
      const fileContent = fs.readFileSync(filePath, "utf-8");
      const { data } = matter(fileContent);

      return {
        slug: file.replace(".mdx", ""),
        title: data.title || "Untitled",
        description: data.description || "",
        date: data.date || new Date().toISOString(),
        author: data.author,
        category: data.category,
        tags: data.tags || [],
      } as ArticleMeta;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return articles;
}

export function getArticleBySlug(slug: string) {
  const filePath = path.join(contentDirectory, "articles", `${slug}.mdx`);

  if (!fs.existsSync(filePath)) {
    return null;
  }

  const fileContent = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(fileContent);

  return {
    meta: {
      slug,
      title: data.title || "Untitled",
      description: data.description || "",
      date: data.date || new Date().toISOString(),
      author: data.author,
      category: data.category,
      tags: data.tags || [],
    } as ArticleMeta,
    content,
  };
}
