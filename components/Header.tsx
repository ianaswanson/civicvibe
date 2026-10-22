import Link from "next/link";
import { GITHUB_REPO } from "@/lib/system";

// Door labels are shortened from wireframe sentences 4 and 6.
const navigation = [
  { name: "We need to change", href: "/start" },
  { name: "We run digital services", href: "/system" },
  { name: "The system", href: "/system#documents" },
  { name: "GitHub", href: GITHUB_REPO },
];

export function Header() {
  return (
    <header className="border-b border-secondary-200 bg-white">
      <nav className="container-page flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
        <Link href="/" className="text-lg font-semibold text-secondary-900">
          Civic<span className="text-primary-600">Vibe</span>
        </Link>
        <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
          {navigation.map((item) => (
            <li key={item.name}>
              <Link
                href={item.href}
                className="text-secondary-600 hover:text-primary-700 hover:underline"
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
