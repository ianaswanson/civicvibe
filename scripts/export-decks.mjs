#!/usr/bin/env node
// Prints each deck to a PDF, one slide per page, with Chrome.
//
// Reads the rendered decks the sync wrote to content/decks/ (so run
// `npm run sync` first) and writes public/files/decks/<slug>.pdf, which the
// sync keeps and the deck page links. Needs Chrome on this machine; it is a
// local step, not part of the build.
//
//   node scripts/export-decks.mjs            # every deck
//   node scripts/export-decks.mjs team-kickoff

import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const CHROME =
  process.env.CHROME ||
  ["/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", "/usr/bin/google-chrome", "/usr/bin/chromium"].find((p) => fs.existsSync(p));
if (!CHROME) {
  console.error("export-decks: no Chrome found; set CHROME=/path/to/chrome");
  process.exit(1);
}

const css = fs.readFileSync(path.join(ROOT, "app", "globals.css"), "utf8");
const slideCss = css.slice(css.indexOf("/* Decks:"));

const only = process.argv.slice(2);
const files = fs
  .readdirSync(path.join(ROOT, "content", "decks"))
  .filter((f) => f.endsWith(".json") && (!only.length || only.includes(f.replace(/\.json$/, ""))));

for (const file of files) {
  const deck = JSON.parse(fs.readFileSync(path.join(ROOT, "content", "decks", file), "utf8"));
  const html = `<!doctype html>
<html><head><meta charset="utf-8"><title>${deck.title}</title>
${deck.fonts.map((h) => `<link rel="stylesheet" href="${h}">`).join("\n")}
<style>
@page { size: 1920px 1080px; margin: 0; }
html, body { margin: 0; padding: 0; }
.page { width: 1920px; height: 1080px; page-break-after: always; overflow: hidden; }
${slideCss}
.slide-body img { max-width: none; }
</style></head><body>
${deck.slides.map((s) => `<div class="page"><div class="slide">${s.html.replaceAll('src="/images/', `src="file://${path.join(ROOT, "public", "images")}/`)}</div></div>`).join("\n")}
</body></html>`;
  const tmp = path.join(os.tmpdir(), `civicvibe-${deck.slug}.html`);
  fs.writeFileSync(tmp, html);
  const out = path.join(ROOT, "public", "files", "decks", `${deck.slug}.pdf`);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  execFileSync(
    CHROME,
    [
      "--headless=new",
      "--disable-gpu",
      "--no-pdf-header-footer",
      "--virtual-time-budget=8000",
      `--print-to-pdf=${out}`,
      `file://${tmp}`,
    ],
    { stdio: "pipe" },
  );
  const kb = Math.round(fs.statSync(out).size / 1024);
  console.log(`${deck.slug}: ${deck.slides.length} slides, ${kb} KB`);
}
