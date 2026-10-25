#!/usr/bin/env node
// Copies the digital services system docs and templates into this repo.
//
// Source of truth: ~/ai-dev/digital-services/system/ (override with CV_SYSTEM_SRC).
// Output: content/system/*.md, content/templates/*.md, content/system/_index.json.
// The output is committed so Vercel can build without the source repo. When the
// source isn't on this machine, the script leaves the committed copies alone.
//
// Along the way it:
//   - adds frontmatter (title from the H1, status from the README table, order
//     from the filename number, description from the first paragraph)
//   - rewrites relative links to site routes, and file-name link labels
//     ("deliverable.md") to the page's title
//   - records which templates each doc uses, and whether a doc carries its own
//     template and DMV example
//   - copies the roadmap visuals into public/files/
//   - strips the "Sources" / "Source materials" sections, which point at private
//     working files
//   - fails if anything BOUNDARIES.md rules out is still in the text

import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const SRC =
  process.env.CV_SYSTEM_SRC ||
  path.join(os.homedir(), "ai-dev", "digital-services", "system");
const OUT_SYSTEM = path.join(ROOT, "content", "system");
const OUT_TEMPLATES = path.join(ROOT, "content", "templates");
const OUT_FILES = path.join(ROOT, "public", "files");

// The only files taken from outside system/: the one-page roadmap visuals,
// which follow templates/roadmap.md and use the fictional DMV example.
const VISUALS = {
  roadmap: {
    template: "../_working/roadmap_v3/roadmap_template_v3.html",
    example: "../_working/roadmap_v3/dmv_roadmap_visual_v3.html",
  },
};

// Sections that list private source files. Dropped whole, heading to next H2.
const STRIPPED_SECTIONS = ["Sources", "Source materials"];

// Terms that must never reach the site (BOUNDARIES.md #2-4) and sentences to
// remove, kept in a gitignored local file: listing them here would publish them.
// Each redaction names the file and the exact text; if the text is no longer in
// the source, the sync warns so the entry can be removed.
const BOUNDARIES_FILE = path.join(ROOT, "scripts", "boundaries.local.json");

if (!fs.existsSync(SRC)) {
  console.log(`sync: source not found at ${SRC}; keeping committed content.`);
  process.exit(0);
}

if (!fs.existsSync(BOUNDARIES_FILE)) {
  console.error(`sync FAILED: ${BOUNDARIES_FILE} is missing. It holds the boundary terms; without it nothing is checked.`);
  process.exit(1);
}
const boundaries = JSON.parse(fs.readFileSync(BOUNDARIES_FILE, "utf8"));
const REDACTIONS = boundaries.redactions;
const FORBIDDEN = [/_working/i, ...boundaries.forbidden.map((t) => new RegExp(t, "i"))];

const warnings = [];
const failures = [];
const pending = [];

// --- README: doc statuses and the template table ---------------------------

const readme = fs.readFileSync(path.join(SRC, "README.md"), "utf8");
const docRows = tableRows(section(readme, "Documents")).map(([num, doc, status]) => ({
  order: Number(num),
  title: linkText(doc),
  file: linkTarget(doc),
  status: status.trim(),
}));

const templatesReadme = fs.readFileSync(path.join(SRC, "templates", "README.md"), "utf8");
const templateRows = tableRows(templatesReadme).map(([artifact, changes, file], i) => ({
  order: i + 1,
  artifact: artifact.trim(),
  changes: changes.trim(),
  file: linkTarget(file),
}));

// --- Docs -------------------------------------------------------------------

const docFiles = fs
  .readdirSync(SRC)
  .filter((f) => /^\d\d-.+\.md$/.test(f))
  .sort();

const docs = [];
const docSlugs = new Map();
for (const file of docFiles) docSlugs.set(file, docSlug(file));

// Page titles by route, so links labelled with a file name read as the page.
const titles = new Map();
for (const file of docFiles) titles.set(`/system/${docSlug(file)}`, h1Of(path.join(SRC, file)));
for (const file of fs.readdirSync(path.join(SRC, "templates"))) {
  if (file.endsWith(".md") && file !== "README.md") {
    titles.set(`/templates/${file.replace(/\.md$/, "")}`, h1Of(path.join(SRC, "templates", file)));
  }
}

for (const file of docFiles) {
  const raw = fs.readFileSync(path.join(SRC, file), "utf8");
  const order = Number(file.slice(0, 2));
  const row = docRows.find((r) => r.file === file);
  const { title, body } = transform(raw, file, "");
  const templateSection = section(body, "Template");
  const meta = {
    title,
    description: firstSentence(body),
    status: row ? row.status : "",
    order,
    source: `system/${file}`,
    // A table or code block under "## Template" is a template of its own,
    // not just a pointer to templates/.
    inlineTemplate: /^(\||```)/m.test(templateSection) && /^## DMV example\s*$/m.test(body),
  };
  if (!row) warnings.push(`${file}: not in the README table, no status`);
  write(path.join(OUT_SYSTEM, `${docSlugs.get(file)}.md`), meta, body, `system/${file}`);
  const uses = [...templateSection.matchAll(/\]\(\/templates\/([\w-]+)/g)].map((m) => m[1]);
  docs.push({ slug: docSlugs.get(file), ...meta, templates: [...new Set(uses)] });
}

// README rows without a file yet (planned docs)
const planned = docRows
  .filter((r) => !r.file)
  .map((r) => ({ order: r.order, title: r.title, status: r.status }));

// --- Templates --------------------------------------------------------------

const templateFiles = fs
  .readdirSync(path.join(SRC, "templates"))
  .filter((f) => f.endsWith(".md") && f !== "README.md")
  .sort();

const templates = [];
for (const file of templateFiles) {
  const raw = fs.readFileSync(path.join(SRC, "templates", file), "utf8");
  const row = templateRows.find((r) => r.file === file);
  const { title, body } = transform(raw, file, "templates");
  const slug = file.replace(/\.md$/, "");
  const meta = {
    title,
    description: firstSentence(body),
    artifact: row ? row.artifact : title,
    changes: row ? row.changes : "",
    order: row ? row.order : 99,
    source: `system/templates/${file}`,
  };
  if (!row) warnings.push(`templates/${file}: not in the templates README table`);
  for (const h of ["Template", "DMV example"]) {
    if (!new RegExp(`^## ${h}\\s*$`, "m").test(body)) {
      warnings.push(`templates/${file}: no "## ${h}" section`);
    }
  }
  write(path.join(OUT_TEMPLATES, `${slug}.md`), meta, body, `system/templates/${file}`);
  const usedBy = docs.filter((d) => d.templates.includes(slug)).map((d) => d.slug);
  if (!usedBy.length) warnings.push(`templates/${file}: no doc's Template section links to it`);
  templates.push({ slug, ...meta, docs: usedBy });
}
templates.sort((a, b) => a.order - b.order);

// --- Visuals ----------------------------------------------------------------

const visualFiles = [];
for (const [slug, files] of Object.entries(VISUALS)) {
  const t = templates.find((x) => x.slug === slug);
  if (!t) {
    failures.push(`visual for "${slug}": no such template`);
    continue;
  }
  t.visuals = {};
  for (const [kind, rel] of Object.entries(files)) {
    const src = path.join(SRC, rel);
    if (!fs.existsSync(src)) {
      failures.push(`visual ${rel}: not found`);
      continue;
    }
    const text = fs.readFileSync(src, "utf8");
    for (const re of FORBIDDEN) {
      const hit = text.match(re);
      if (hit) failures.push(`${rel} line ${text.slice(0, hit.index).split("\n").length}: "${hit[0]}"`);
    }
    const name = `${slug}/${kind === "example" ? "dmv-example" : "template"}.html`;
    t.visuals[kind] = `/files/${name}`;
    visualFiles.push({ dest: path.join(OUT_FILES, name), text });
  }
}

// --- Report -----------------------------------------------------------------

for (const w of warnings) console.warn(`sync warning: ${w}`);
if (failures.length) {
  for (const f of failures) console.error(`sync FAILED: ${f}`);
  console.error("Boundary check failed. Nothing should ship until the source is fixed or a redaction is added.");
  process.exit(1);
}

// Nothing is written until the boundary check passes.
resetDir(OUT_SYSTEM);
resetDir(OUT_TEMPLATES);
resetDir(OUT_FILES);
for (const { dest, text } of [...pending, ...visualFiles]) {
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, text);
}
fs.writeFileSync(
  path.join(OUT_SYSTEM, "_index.json"),
  JSON.stringify(
    {
      _generated: "by scripts/sync-content.mjs from digital-services/system/. Do not edit.",
      docs,
      planned,
      templates,
    },
    null,
    2,
  ) + "\n",
);
console.log(
  `sync: ${docs.length} docs, ${templates.length} templates, ${planned.length} planned docs, ${visualFiles.length} visuals.`,
);

// --- Helpers ----------------------------------------------------------------

function transform(raw, file, dir) {
  let text = raw.replace(/\r\n/g, "\n");

  for (const r of REDACTIONS.filter((r) => r.file === file)) {
    if (text.includes(r.text)) text = text.replace(r.text, "");
    else warnings.push(`${file}: redaction text not found; remove it from REDACTIONS`);
  }

  for (const name of STRIPPED_SECTIONS) {
    text = text.replace(new RegExp(`^## ${name}\\s*\\n[\\s\\S]*?(?=^## |(?![\\s\\S]))`, "m"), "");
  }

  const h1 = text.match(/^# (.+)$/m);
  const title = h1 ? h1[1].trim() : file;
  if (h1) text = text.replace(h1[0] + "\n", "");

  text = text.replace(/(!?)\[([^\]]*)\]\(([^)\s]+)\)/g, (m, bang, label, target) => {
    if (bang) return m;
    const route = rewriteLink(target, dir);
    if (route === null) return label;
    const page = route.split("#")[0];
    if (/^[\w-]+\.md$/.test(label) && titles.has(page)) label = titles.get(page);
    return `[${label}](${route})`;
  });

  text = text.trim() + "\n";

  for (const re of FORBIDDEN) {
    const hit = text.match(re);
    if (hit) {
      const line = text.slice(0, hit.index).split("\n").length;
      failures.push(`${dir ? dir + "/" : ""}${file} line ${line}: "${hit[0]}"`);
    }
  }
  return { title, body: text };
}

function rewriteLink(target, dir) {
  if (/^(https?:|mailto:|#)/.test(target)) return target;
  const [p, hash] = target.split("#");
  const anchor = hash ? `#${hash}` : "";
  const resolved = path.posix.normalize(path.posix.join(dir, decodeURIComponent(p)));
  if (resolved.includes("_working") || resolved.startsWith("..")) return null;
  if (resolved === "README.md") return `/system${anchor}`;
  if (resolved === "templates/README.md") return "/system#templates";
  if (resolved.startsWith("templates/")) {
    return `/templates/${resolved.slice("templates/".length).replace(/\.md$/, "")}${anchor}`;
  }
  if (/^\d\d-.+\.md$/.test(resolved)) return `/system/${docSlug(resolved)}${anchor}`;
  warnings.push(`unmapped link "${target}" in ${dir || "system"}; left as text`);
  return null;
}

function h1Of(file) {
  const m = fs.readFileSync(file, "utf8").match(/^# (.+)$/m);
  return m ? m[1].trim() : path.basename(file, ".md");
}

function docSlug(file) {
  return file.replace(/^\d\d-/, "").replace(/\.md$/, "");
}

function section(md, heading) {
  const m = md.match(new RegExp(`^## ${heading}\\s*\\n([\\s\\S]*?)(?=^## |(?![\\s\\S]))`, "m"));
  return m ? m[1] : "";
}

function tableRows(md) {
  return md
    .split("\n")
    .filter((l) => l.startsWith("|"))
    .slice(2)
    .map((l) => l.split("|").slice(1, -1));
}

function linkText(cell) {
  const m = cell.match(/\[([^\]]+)\]/);
  return (m ? m[1] : cell).trim();
}

function linkTarget(cell) {
  const m = cell.match(/\]\(([^)]+)\)/);
  return m ? m[1].trim() : null;
}

function firstSentence(body) {
  const para = body
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .find((p) => p && !/^[#|\-*>`]/.test(p));
  if (!para) return "";
  const plain = para
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[*_`]/g, "")
    .replace(/\s+/g, " ");
  const m = plain.match(/^.*?[.!?](?=\s|$)/);
  return (m ? m[0] : plain).trim();
}

function write(dest, meta, body, source) {
  const fm = [
    "---",
    `# Generated by scripts/sync-content.mjs from digital-services/${source}.`,
    "# Do not edit here. Edit the source and run `npm run sync`.",
    ...Object.entries(meta).map(([k, v]) => `${k}: ${JSON.stringify(v)}`),
    "---",
    "",
  ].join("\n");
  pending.push({ dest, text: fm + body });
}

function resetDir(dir) {
  fs.rmSync(dir, { recursive: true, force: true });
  fs.mkdirSync(dir, { recursive: true });
}
