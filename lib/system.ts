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
  // Templates linked from the doc's "## Template" section.
  templates: string[];
  // The doc carries its own blank template and DMV example.
  inlineTemplate: boolean;
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
  // Docs whose "## Template" section links here.
  docs: string[];
  // One-page HTML visuals in public/files/, where they exist.
  visuals?: { template?: string; example?: string };
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

// The process flow from the system README, with the docs that cover each step
// (from each doc's "When" section). Files come from those docs' Template links.
const PROCESS_FLOW: { step: string; docs: string[] }[] = [
  { step: "Capture ideas", docs: ["request-triage-and-idea-log"] },
  { step: "Set direction", docs: ["vision-and-strategy", "goals-and-goal-progress"] },
  {
    step: "Plan the quarter",
    docs: ["quarterly-planning-and-commitments", "now-next-later-grid", "initiatives-and-solutions"],
  },
  { step: "Discover", docs: ["discovery"] },
  { step: "Slice the work", docs: ["deliverables-and-user-stories"] },
  { step: "Build and release", docs: ["build-release-and-enable"] },
  { step: "Review the sprint", docs: ["sprint-report"] },
  { step: "Enable", docs: ["build-release-and-enable"] },
];

export function getProcessMap() {
  const { docs, templates } = getIndex();
  return PROCESS_FLOW.map(({ step, docs: slugs }) => {
    const stepDocs = slugs.map((slug) => {
      const doc = docs.find((d) => d.slug === slug);
      if (!doc) throw new Error(`Process map: no doc "${slug}" for step "${step}"`);
      return doc;
    });
    const files = [...new Set(stepDocs.flatMap((d) => d.templates))].map(
      (slug) => templates.find((t) => t.slug === slug)!,
    );
    return { step, docs: stepDocs, files };
  });
}

export function getDoc(slug: string) {
  const file = path.join(contentDir, "system", `${slug}.md`);
  if (!fs.existsSync(file)) return null;
  const { data, content } = matter(fs.readFileSync(file, "utf-8"));
  return { meta: { slug, ...data } as DocMeta, content };
}

// A doc with its own template: the text before "## Template", the blank
// template, the DMV example, and the rest (rules of thumb).
export function getDocTemplate(content: string) {
  const blankAt = content.search(/^## Template\s*$/m);
  const exampleAt = content.search(/^## DMV example\s*$/m);
  if (blankAt === -1 || exampleAt === -1 || exampleAt < blankAt) return null;
  const afterExample = content.slice(exampleAt).search(/^## (?!DMV example)/m);
  const afterAt = afterExample === -1 ? content.length : exampleAt + afterExample;
  const stripHeading = (s: string) => s.replace(/^## .+\n/, "").trim() + "\n";
  return {
    before: content.slice(0, blankAt).trim() + "\n",
    blank: stripHeading(content.slice(blankAt, exampleAt)),
    example: stripHeading(content.slice(exampleAt, afterAt)),
    after: content.slice(afterAt).trim() + "\n",
  };
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
