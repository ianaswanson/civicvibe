import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-secondary-200 bg-secondary-50">
      <div className="container-page py-8">
        <div className="flex flex-col items-center gap-4 text-center">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-500">
              <span className="text-lg font-bold text-white">C</span>
            </div>
            <span className="text-xl font-bold text-secondary-900">
              Civic<span className="text-primary-500">Vibe</span>
            </span>
          </Link>

          <nav className="flex gap-6">
            <Link
              href="/resources"
              className="text-sm text-secondary-600 hover:text-primary-600"
            >
              Resources
            </Link>
            <Link
              href="/about"
              className="text-sm text-secondary-600 hover:text-primary-600"
            >
              About
            </Link>
            <Link
              href="/contact"
              className="text-sm text-secondary-600 hover:text-primary-600"
            >
              Contact
            </Link>
          </nav>

          <div className="mt-4 space-y-2">
            <p className="text-sm text-secondary-500">
              {new Date().getFullYear()} CivicVibe. All content is open source.
            </p>
            <p className="text-xs text-secondary-400 max-w-lg">
              I work in local government technology. CivicVibe reflects what
              I&apos;ve learned and what I think might help others doing similar
              work. These are personal views, not official positions of my
              employer.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
