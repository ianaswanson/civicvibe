import Link from "next/link";

// Copy: wireframe sentences 1-7, verbatim (.claude/wireframe-homepage.html).
export default function HomePage() {
  return (
    <div className="container-page py-16 sm:py-24">
      <div className="max-w-3xl">
        <h1 className="text-3xl font-semibold leading-tight text-secondary-900 sm:text-5xl sm:leading-tight">
          Everyone in government technology has a wall they stopped trying to
          get through. This is the toolkit for going through it.
        </h1>
        <p className="mt-8 text-body-lg text-secondary-700">
          Government can run its own digital services like the best software
          teams on earth. This is the whole system for doing it: how the team
          works, who decides what, how an idea becomes something people can use,
          and how AI now does a lot of the building.
        </p>
        <p className="mt-4 text-body-lg text-secondary-700">
          All the documents and templates are here, and one made-up DMV service
          runs through every one of them so you can see how the pieces fit
          together. It came out of real government work and it&apos;s free.
        </p>
      </div>

      <div className="mt-16 grid gap-6 md:grid-cols-2">
        <Door
          href="/start"
          label="We know we need to change. We don't know how."
          sub="Start here if this is new to you, or if you brought along someone who still needs convincing."
        />
        <Door
          href="/system"
          label="We run digital services, but it's not delivering what we'd hoped."
          sub="Start here if you want the system and the files, not the argument."
        />
      </div>
    </div>
  );
}

function Door({ href, label, sub }: { href: string; label: string; sub: string }) {
  return (
    <Link
      href={href}
      className="group block border border-secondary-300 p-6 transition-colors hover:border-primary-600 sm:p-8"
    >
      <p className="text-xl font-semibold leading-snug text-secondary-900 group-hover:text-primary-700 sm:text-2xl sm:leading-snug">
        {label}
      </p>
      <p className="mt-3 text-secondary-600">{sub}</p>
    </Link>
  );
}
