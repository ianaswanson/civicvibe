#!/usr/bin/env node
// Renders the digital services system docs and templates for the site.
//
// Source of truth: system/ in this repo (override with CV_SYSTEM_SRC).
// Output: content/system/*.md, content/templates/*.md, content/system/_index.json,
// public/files/roadmap/*.html. The output is committed; on Vercel the script
// exits early and the committed copies are built, because the boundary check
// needs a local file that isn't published.
//
// Along the way it:
//   - adds frontmatter (title from the H1, status from the README table, order
//     from the filename number, description from the first paragraph)
//   - rewrites relative links to site routes, and file-name link labels
//     ("deliverable.md") to the page's title
//   - records which templates each doc uses, and whether a doc carries its own
//     template and DMV example
//   - copies the roadmap visuals into public/files/ and the board chapter
//     images (system/visuals/board/) into public/images/system/board/
//   - strips any "Sources" / "Source materials" section, should one come back
//     (they listed private working files; they live in the private repo now)
//   - fails if anything BOUNDARIES.md rules out is in the text

import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const SRC = process.env.CV_SYSTEM_SRC || path.join(ROOT, "system");
const OUT_SYSTEM = path.join(ROOT, "content", "system");
const OUT_TEMPLATES = path.join(ROOT, "content", "templates");
const OUT_FILES = path.join(ROOT, "public", "files");
const OUT_BOARD = path.join(ROOT, "public", "images", "system", "board");
const BOARD_DIR = path.join(SRC, "visuals", "board");

// The one-page roadmap visuals, which follow templates/roadmap.md and use the
// fictional DMV example.
const VISUALS = {
  roadmap: {
    template: "visuals/roadmap/template.html",
    example: "visuals/roadmap/dmv-example.html",
  },
};

// Sections that listed private source files. Dropped whole, heading to next H2.
const STRIPPED_SECTIONS = ["Sources", "Source materials"];

// Terms that must never reach the site (BOUNDARIES.md #2-4) and sentences to
// remove, kept in a gitignored local file: listing them here would publish them.
// Each redaction names the file and the exact text; if the text is no longer in
// the source, the sync warns so the entry can be removed.
const BOUNDARIES_FILE = path.join(ROOT, "scripts", "boundaries.local.json");

if (process.env.VERCEL || process.env.CI) {
  console.log("sync: on a build server; keeping committed content (the boundary terms file is local only).");
  process.exit(0);
}

if (!fs.existsSync(SRC)) {
  console.error(`sync FAILED: source not found at ${SRC}.`);
  process.exit(1);
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

// --- Board chapters ---------------------------------------------------------
// system/visuals/board/board.json lists each exported chapter: file, title,
// caption, alt, and the docs it illustrates ("system" is the /system page).

const boardManifest = JSON.parse(fs.readFileSync(path.join(BOARD_DIR, "board.json"), "utf8"));
const board = { url: boardManifest.url };
const boardFiles = [];
for (const d of docs) d.visuals = [];
for (const ch of boardManifest.chapters) {
  const file = path.join(BOARD_DIR, ch.file);
  if (!fs.existsSync(file)) {
    failures.push(`board chapter ${ch.chapter}: ${ch.file} not found`);
    continue;
  }
  const png = fs.readFileSync(file);
  const { width, height } = pngSize(png, ch.file);
  for (const k of ["title", "caption", "alt"]) {
    for (const re of FORBIDDEN) {
      const hit = (ch[k] || "").match(re);
      if (hit) failures.push(`board.json chapter ${ch.chapter} ${k}: "${hit[0]}"`);
    }
  }
  const visual = {
    chapter: ch.chapter,
    title: ch.title,
    caption: ch.caption,
    alt: ch.alt,
    src: `/images/system/board/${ch.file}`,
    width,
    height,
  };
  boardFiles.push({ dest: path.join(OUT_BOARD, ch.file), text: png });
  for (const target of ch.docs) {
    if (target === "system") {
      board.overview = visual;
      continue;
    }
    const d = docs.find((x) => x.slug === target);
    if (!d) {
      failures.push(`board chapter ${ch.chapter}: no doc "${target}"`);
      continue;
    }
    d.visuals.push(visual);
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
resetDir(OUT_BOARD);
for (const { dest, text } of [...pending, ...visualFiles, ...boardFiles]) {
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, text);
}
fs.writeFileSync(
  path.join(OUT_SYSTEM, "_index.json"),
  JSON.stringify(
    {
      _generated: "by scripts/sync-content.mjs from system/. Do not edit.",
      docs,
      planned,
      templates,
      board,
    },
    null,
    2,
  ) + "\n",
);
console.log(
  `sync: ${docs.length} docs, ${templates.length} templates, ${planned.length} planned docs, ${visualFiles.length} visuals, ${boardFiles.length} board chapters.`,
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
    `# Generated by scripts/sync-content.mjs from ${source}.`,
    "# Do not edit here. Edit the source and run `npm run sync`.",
    ...Object.entries(meta).map(([k, v]) => `${k}: ${JSON.stringify(v)}`),
    "---",
    "",
  ].join("\n");
  pending.push({ dest, text: fm + body });
}

// Width and height from a PNG's IHDR chunk.
function pngSize(buf, name) {
  if (buf.toString("ascii", 1, 4) !== "PNG") throw new Error(`${name} is not a PNG`);
  return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
}

function resetDir(dir) {
  fs.rmSync(dir, { recursive: true, force: true });
  fs.mkdirSync(dir, { recursive: true });
}
