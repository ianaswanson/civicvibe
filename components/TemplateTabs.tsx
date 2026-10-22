"use client";

import { useState } from "react";

interface Panel {
  label: string;
  filename: string;
  markdown: string;
  html: string;
}

// Blank template and DMV example as two tabs, each with Copy and Download.
export function TemplateTabs({ panels }: { panels: Panel[] }) {
  const [active, setActive] = useState(0);
  const [copied, setCopied] = useState<number | null>(null);
  const panel = panels[active];

  async function copy() {
    await navigator.clipboard.writeText(panel.markdown);
    setCopied(active);
    setTimeout(() => setCopied(null), 2000);
  }

  function download() {
    const blob = new Blob([panel.markdown], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = panel.filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-secondary-200">
        <div role="tablist" className="flex gap-1">
          {panels.map((p, i) => (
            <button
              key={p.label}
              role="tab"
              type="button"
              aria-selected={i === active}
              onClick={() => setActive(i)}
              className={
                i === active
                  ? "-mb-px border-b-2 border-primary-600 px-4 py-2 font-medium text-secondary-900"
                  : "-mb-px border-b-2 border-transparent px-4 py-2 text-secondary-500 hover:text-secondary-900"
              }
            >
              {p.label}
            </button>
          ))}
        </div>
        <div className="flex gap-2 pb-2">
          <button type="button" onClick={copy} className="btn-small">
            {copied === active ? "Copied" : "Copy"}
          </button>
          <button type="button" onClick={download} className="btn-small">
            Download
          </button>
        </div>
      </div>
      <div role="tabpanel" className="pt-6">
        <div className="prose" dangerouslySetInnerHTML={{ __html: panel.html }} />
      </div>
    </div>
  );
}
