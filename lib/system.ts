import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeRaw from "rehype-raw";
import rehypeSlug from "rehype-slug";
import rehypeStringify from "rehype-stringify";
import type { Root, Element, ElementContent, RootContent } from "hast";

// Reads the content synced from digital-services/system by scripts/sync-content.mjs.

const contentDir = path.join(process.cwd(), "content");

export const GITHUB_REPO = "https://github.com/ianaswanson/civicvibe";

export interface DocMeta {
  slug: string;
  title: string;
  description: string;
  status: string;
  order: number;
  source: string;
}

export interface PlannedDoc {
  order: number;
  title: string;
  status: string;
}

export interface TemplateMeta {
  slug: string;
  title: string;
  description: string;
  artifact: string;
  changes: string;
  order: number;
  source: string;
}

interface SystemIndex {
  docs: DocMeta[];
  planned: PlannedDoc[];
  templates: TemplateMeta[];
}

export function getIndex(): SystemIndex {
  const raw = fs.readFileSync(path.join(contentDir, "system", "_index.json"), "utf-8");
  const index = JSON.parse(raw) as SystemIndex;
  index.docs.sort((a, b) => a.order - b.order);
  index.templates.sort((a, b) => a.order - b.order);
  return index;
}

export function getDoc(slug: string) {
  const file = path.join(contentDir, "system", `${slug}.md`);
  if (!fs.existsSync(file)) return null;
  const { data, content } = matter(fs.readFileSync(file, "utf-8"));
  return { meta: { slug, ...data } as DocMeta, content };
}

export function getTemplate(slug: string) {
  const file = path.join(contentDir, "templates", `${slug}.md`);
  if (!fs.existsSync(file)) return null;
  const { data, content } = matter(fs.readFileSync(file, "utf-8"));
  return { meta: { slug, ...data } as TemplateMeta, ...splitTemplate(content) };
}

// A template file is: intro, "## Template", "## DMV example".
function splitTemplate(content: string) {
  const blankAt = content.search(/^## Template\s*$/m);
  const exampleAt = content.search(/^## DMV example\s*$/m);
  if (blankAt === -1 || exampleAt === -1 || exampleAt < blankAt) {
    return { intro: content, blank: "", example: "" };
  }
  const stripHeading = (s: string) => s.replace(/^## .+\n/, "").trim() + "\n";
  return {
    intro: content.slice(0, blankAt).trim() + "\n",
    blank: stripHeading(content.slice(blankAt, exampleAt)),
    example: stripHeading(content.slice(exampleAt)),
  };
}

// Wide tables scroll inside their own box instead of pushing the page sideways.
function wrapTables() {
  return (tree: Root) => {
    const walk = (node: Root | Element) => {
      node.children = node.children.map((child) => {
        if (child.type !== "element") return child;
        if (child.tagName === "table") {
          const wrapper: Element = {
            type: "element",
            tagName: "div",
            properties: { className: ["table-wrap"] },
            children: [child],
          };
          return wrapper;
        }
        walk(child);
        return child;
      }) as (RootContent & ElementContent)[];
    };
    walk(tree);
  };
}

export async function renderMarkdown(md: string): Promise<string> {
  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeSlug)
    .use(wrapTables)
    .use(rehypeStringify)
    .process(md);
  return String(file);
}
