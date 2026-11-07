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
//   - lists the decks in system/decks/ (rendered by cv-vy1.7; for now only
//     indexed and scanned)
//   - fails if anything BOUNDARIES.md rules out is in the text, decks included

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
for (const d of docs) {
  d.visuals = [];
  d.decks = [];
}
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

const ICONS = {
  CheckCircle: '<circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>',
  Users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8"/>',
  Chart: '<path d="M3 3v18h18"/><path d="M7 16v-5M12 16V8M17 16v-3"/>',
  Search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
  Chat: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
  Lightning: '<path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/>',
  Warning: '<path d="m21.7 18-8-14a2 2 0 0 0-3.4 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.7-3"/><path d="M12 9v4M12 17h.01"/>',
  Lightbulb: '<path d="M15 14c.2-1 .7-1.7 1.5-2.5A6 6 0 1 0 6 11c0 1 .5 1.7 1.5 2.5.8.7 1.3 1.6 1.5 2.5h6z"/><path d="M9 18h6M10 22h4"/>',
  Trust: '<path d="m11 17 2 2a1.4 1.4 0 1 0 2-2"/><path d="m14 14 2.5 2.5a1.4 1.4 0 1 0 2-2l-3.9-3.9a5 5 0 0 0-7 0l-.6.6"/><path d="M3 4h7l2 2"/><path d="M21 4h-7l-3 3"/><path d="M2 14l6.5 6.5a1.4 1.4 0 1 0 2-2"/>',
};

const SHAPES = {
  "arrow-right": "polygon(0 25%, 60% 25%, 60% 0, 100% 50%, 60% 100%, 60% 75%, 0 75%)",
  "arrow-left": "polygon(100% 25%, 40% 25%, 40% 0, 0 50%, 40% 100%, 40% 75%, 100% 75%)",
  "arrow-up": "polygon(25% 100%, 25% 40%, 0 40%, 50% 0, 100% 40%, 75% 40%, 75% 100%)",
  "arrow-down": "polygon(25% 0, 25% 60%, 0 60%, 50% 100%, 100% 60%, 75% 60%, 75% 0)",
  diamond: "polygon(50% 0, 100% 50%, 50% 100%, 0 50%)",
  ellipse: "ellipse(50% 50% at 50% 50%)",
  line: "none",
};

// --- Decks ------------------------------------------------------------------
// system/decks/<slug>/deck.json + slides/*.html (+ assets/), as
// exported from the Slides artifacts and DMV-ified; decks.json gives the
// rollout order, audience and what each leaves behind. Every text file is
// scanned. Each slide is rendered to a fragment the site can show: the
// speaker notes come out, images point at public/, and the format's custom
// elements (x-icon, x-shape, x-connector) become SVG.

const DECKS_DIR = path.join(SRC, "decks");
const OUT_DECKS = path.join(ROOT, "content", "decks");
const OUT_DECK_IMAGES = path.join(ROOT, "public", "images", "system", "decks");
const OUT_DECK_FILES = path.join(OUT_FILES, "decks");
const decks = [];
const deckFiles = [];
if (fs.existsSync(DECKS_DIR)) {
  const manifest = JSON.parse(fs.readFileSync(path.join(DECKS_DIR, "decks.json"), "utf8"));
  manifest.decks.forEach((entry, i) => {
    const slug = entry.slug;
    const dir = path.join(DECKS_DIR, slug);
    if (!fs.existsSync(dir)) {
      failures.push(`decks.json: no folder for "${slug}"`);
      return;
    }
    const deck = JSON.parse(fs.readFileSync(path.join(dir, "deck.json"), "utf8"));
    for (const file of walk(dir)) {
      if (!/\.(html|json|md)$/.test(file)) continue;
      const text = fs.readFileSync(file, "utf8");
      for (const re of FORBIDDEN) {
        const hit = text.match(re);
        if (hit) failures.push(`${path.relative(ROOT, file)} line ${text.slice(0, hit.index).split("\n").length}: "${hit[0]}"`);
      }
    }
    const assetsDir = path.join(dir, "assets");
    if (fs.existsSync(assetsDir)) {
      for (const f of fs.readdirSync(assetsDir)) {
        deckFiles.push({ dest: path.join(OUT_DECK_IMAGES, slug, f), text: fs.readFileSync(path.join(assetsDir, f)) });
      }
    }
    const slides = deck.order.map((id) => {
      const raw = fs.readFileSync(path.join(dir, "slides", `${id}.html`), "utf8");
      return renderSlide(raw, id, slug);
    }).filter(Boolean);
    // The PDF is written by scripts/export-decks.mjs straight into public/files/decks/
    // (one copy in the repo, not two); keep it across the reset below.
    const pdfFile = path.join(OUT_DECK_FILES, `${slug}.pdf`);
    let pdf = null;
    if (fs.existsSync(pdfFile)) {
      pdf = `/files/decks/${slug}.pdf`;
      deckFiles.push({ dest: pdfFile, text: fs.readFileSync(pdfFile) });
    }
    for (const docSlug of entry.docs || []) {
      const d = docs.find((x) => x.slug === docSlug);
      if (!d) failures.push(`decks.json "${slug}": no doc "${docSlug}"`);
      else d.decks.push(slug);
    }
    const meta = {
      slug,
      title: deck.title,
      order: i + 1,
      kind: entry.kind || "practice",
      docs: entry.docs || [],
      step: entry.step,
      audience: entry.audience,
      leaves: entry.leaves,
      run: entry.run || null,
      slides: slides.length,
      fonts: Object.values(deck.faces || {}).map((f) => f.href),
      pdf,
      source: `system/decks/${slug}`,
    };
    decks.push(meta);
    pending.push({ dest: path.join(OUT_DECKS, `${slug}.json`), text: JSON.stringify({ ...meta, sections: deck.sections || {}, slides }, null, 2) + "\n" });
  });
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
resetDir(OUT_DECKS);
resetDir(OUT_DECK_IMAGES);
for (const { dest, text } of [...pending, ...visualFiles, ...boardFiles, ...deckFiles]) {
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
      decks,
    },
    null,
    2,
  ) + "\n",
);
console.log(
  `sync: ${docs.length} docs, ${templates.length} templates, ${planned.length} planned docs, ${visualFiles.length} visuals, ${boardFiles.length} board chapters, ${decks.length} decks (${decks.reduce((n, d) => n + d.slides, 0)} slides, ${decks.filter((d) => d.pdf).length} PDFs).`,
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

// --- Slides -----------------------------------------------------------------

function renderSlide(raw, id, slug) {
  let html = raw.replace(/\r\n/g, "\n").trim();
  if (/<section[^>]*\shidden[\s>]/.test(html)) return null;
  // Speaker notes
  let notes = "";
  html = html.replace(/<aside>([\s\S]*?)<\/aside>\s*/g, (m, t) => {
    notes = t.trim();
    return "";
  });
  // Images
  html = html.replace(/src="assets\/([^"]+)"/g, (m, f) => `src="/images/system/decks/${slug}/${f}"`);
  // Icons
  html = html.replace(/<x-icon name="([A-Za-z]+)"([^>]*)><\/x-icon>/g, (m, name, rest) => {
    const paths = ICONS[name];
    if (!paths) {
      warnings.push(`${slug}/${id}: unknown icon "${name}"`);
      return "";
    }
    return `<svg class="x-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"${rest}>${paths}</svg>`;
  });
  // Shapes: a painted box clipped to the kind
  html = html.replace(/<x-shape kind="([a-z-]+)" style="([^"]*)"><\/x-shape>/g, (m, kind, style) => {
    const clip = SHAPES[kind];
    if (clip === undefined) warnings.push(`${slug}/${id}: unknown shape "${kind}"`);
    return `<div class="x-shape" style="${style};clip-path:${clip || "none"}"></div>`;
  });
  // Connectors: a line with a head, drawn in the coordinates of the nearest
  // positioned ancestor (the slide, or a position:relative div).
  html = html.replace(/<x-connector ([^>]*)><\/x-connector>/g, (m, attrs) => {
    const a = Object.fromEntries([...attrs.matchAll(/([\w-]+)="([^"]*)"/g)].map((x) => [x[1], x[2]]));
    const [x1, y1, x2, y2] = [a.x1, a.y1, a.x2, a.y2].map(Number);
    if ([x1, y1, x2, y2].some(Number.isNaN)) {
      warnings.push(`${slug}/${id}: connector without coordinates`);
      return "";
    }
    const color = (a.style || "").match(/color:([^;]+)/)?.[1]?.trim() || "#000";
    const width = Number((a.style || "").match(/border-width:(\d+)/)?.[1] || 2);
    const dash = /dashed/.test(a.style || "") ? ` stroke-dasharray="${width * 3} ${width * 2}"` : /dotted/.test(a.style || "") ? ` stroke-dasharray="${width} ${width * 2}"` : "";
    let pts;
    if (a.route === "hv") pts = [[x1, y1], [x2, y1], [x2, y2]];
    else if (a.route === "vh") pts = [[x1, y1], [x1, y2], [x2, y2]];
    else if (a.route === "elbow") pts = [[x1, y1], [(x1 + x2) / 2, y1], [(x1 + x2) / 2, y2], [x2, y2]];
    else pts = [[x1, y1], [x2, y2]];
    const head = a.head || "end";
    const size = Math.max(10, width * 4);
    const arrow = (from, to) => {
      const ang = Math.atan2(to[1] - from[1], to[0] - from[0]);
      const p = (d, s) => `${(to[0] - Math.cos(ang + d) * s).toFixed(1)},${(to[1] - Math.sin(ang + d) * s).toFixed(1)}`;
      return `<polygon points="${to[0]},${to[1]} ${p(0.5, size)} ${p(-0.5, size)}" fill="${color}"/>`;
    };
    const d = pts.map((p, i) => `${i ? "L" : "M"}${p[0]} ${p[1]}`).join(" ");
    let heads = "";
    if (head === "end" || head === "both") heads += arrow(pts[pts.length - 2], pts[pts.length - 1]);
    if (head === "both" || head === "start") heads += arrow(pts[1], pts[0]);
    return `<svg class="x-connector" aria-hidden="true"><path d="${d}" fill="none" stroke="${color}" stroke-width="${width}" stroke-linejoin="round"${dash}/>${heads}</svg>`;
  });
  // The section itself becomes the slide box; SlideFrame supplies .slide.
  html = html.replace(/^<section ([^>]*)>/, (m, attrs) => {
    const style = attrs.match(/style="([^"]*)"/)?.[1] || "";
    return `<div class="slide-body" style="${style};position:absolute;left:0;top:0;width:1920px;height:1080px;overflow:hidden">`;
  }).replace(/<\/section>\s*$/, "</div>");
  return { id, html, notes };
}

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    return e.isDirectory() ? walk(p) : [p];
  });
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
