import { GITHUB_REPO } from "@/lib/system";

export function Footer() {
  return (
    <footer className="border-t border-secondary-200 bg-secondary-50">
      <div className="container-page space-y-3 py-10 text-sm text-secondary-600">
        <p className="max-w-2xl">
          I work in local government technology. CivicVibe reflects what
          I&apos;ve learned and what I think might help others doing similar
          work. These are personal views, not official positions of my employer.
        </p>
        <p>
          Code:{" "}
          <a href="https://opensource.org/license/mit" className="link">
            MIT
          </a>
          . Content:{" "}
          <a href="https://creativecommons.org/licenses/by/4.0/" className="link">
            CC BY 4.0
          </a>
          .
        </p>
        <p className="flex flex-wrap gap-x-6 gap-y-1">
          <a href="mailto:hello@civicvibe.com" className="link">
            hello@civicvibe.com
          </a>
          <a href={GITHUB_REPO} className="link">
            GitHub
          </a>
        </p>
      </div>
    </footer>
  );
}
