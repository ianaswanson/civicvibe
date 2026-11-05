import Link from "next/link";
import type { TemplateMeta } from "@/lib/system";

// A grid of template links: artifact name and how often it changes.
export function TemplateList({ templates }: { templates: TemplateMeta[] }) {
  return (
    <ul className="mt-6 grid gap-x-8 gap-y-1 sm:grid-cols-2 lg:grid-cols-3">
      {templates.map((t) => (
        <li key={t.slug}>
          <Link
            href={`/templates/${t.slug}`}
            className="group block border-b border-paper/15 py-3 hover:border-door-lit"
          >
            <span className="block font-display font-bold text-paper group-hover:text-door-lit">
              {t.artifact}
            </span>
            <span className="block text-small text-paper/60">{t.changes}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
