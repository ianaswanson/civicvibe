import Link from "next/link";
import { GITHUB_REPO } from "@/lib/system";
import type { Door } from "@/components/SiteFrame";

// The homepage's masthead, on a band of the door you came through.
const navigation = [
  { name: "Start", href: "/start", door: 1 },
  { name: "The system", href: "/system", door: 2 },
  { name: "GitHub", href: GITHUB_REPO },
];

export function Header({ door }: { door: Door }) {
  return (
    <header className="bg-door-lit text-ink">
      <a
        href="#main"
        className="absolute -left-full top-0 bg-ink px-4 py-2 text-paper focus:left-4 focus:top-4 focus:z-20"
      >
        Skip to content
      </a>
      <nav
        aria-label="Primary"
        className="container-page flex flex-wrap items-baseline justify-between gap-x-12 gap-y-2 py-4 md:py-6"
      >
        <Link
          href="/"
          className="font-display text-h4 font-black leading-none tracking-tight md:text-h3"
        >
          CivicVibe
        </Link>
        <ul className="flex flex-wrap gap-x-4 gap-y-2 md:gap-x-12">
          {navigation.map((item) => {
            const here = item.door === door;
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  aria-current={here ? "page" : undefined}
                  className={`border-b-4 pb-1 font-display text-body font-extrabold leading-none md:text-h4 ${
                    here ? "border-ink" : "border-transparent hover:border-ink"
                  }`}
                >
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}
