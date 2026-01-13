import Link from "next/link";
import { Cpu, RefreshCw, Heart, ArrowRight } from "lucide-react";

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-secondary-900 via-secondary-800 to-secondary-900 py-24 text-white">
        <div className="container-page">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Government is about to{" "}
              <span className="text-primary-400">unlock something big.</span>
            </h1>
            <p className="mb-8 text-xl text-secondary-300 sm:text-2xl">
              The mission. The reach. The people who actually understand the
              problems. Now add tools that finally match the ambition.
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Link href="/resources" className="btn-primary text-lg">
                See What We&apos;re Building
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link href="/about" className="btn-secondary text-lg">
                The Vision
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* The Insight */}
      <section className="py-20">
        <div className="container-page">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-body-xl text-secondary-900">
              AI breaks the old tradeoff between speed and safety.
            </p>
            <p className="mt-4 text-body-lg text-secondary-600">
              But fast at what? Not the same old thing. Better services. Better
              outcomes. That requires transforming what you think technology is
              for.
            </p>
          </div>
        </div>
      </section>

      {/* Technology Is */}
      <section className="bg-secondary-50 py-16">
        <div className="container-page">
          <div className="mx-auto max-w-3xl">
            <div className="grid gap-8 md:grid-cols-2">
              <div>
                <p className="mb-4 text-sm font-semibold uppercase tracking-wider text-secondary-500">
                  Technology is not
                </p>
                <ul className="space-y-3 text-body text-secondary-600">
                  <li>A commodity you order at a drive-through</li>
                  <li>A custom thing you spec out and wait 3 years for</li>
                </ul>
              </div>
              <div>
                <p className="mb-4 text-sm font-semibold uppercase tracking-wider text-primary-600">
                  Technology is
                </p>
                <p className="text-body-lg text-secondary-900">
                  A living service, constantly adapting to meet community needs.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Three Lenses */}
      <section className="py-20">
        <div className="container-page">
          <h2 className="mb-4 text-center text-h2 text-secondary-900">
            The tech. The humans. Everything in between.
          </h2>
          <p className="mx-auto mb-12 max-w-xl text-center text-body-lg text-secondary-600">
            Three lenses. One vision.
          </p>
          <div className="grid gap-8 md:grid-cols-3">
            <LensCard
              icon={<Cpu className="h-8 w-8" />}
              title="Technology & AI"
              description="Tools that break the speed/safety tradeoff. Go fast without the historic dangers. The people closest to problems can now build solutions."
            />
            <LensCard
              icon={<RefreshCw className="h-8 w-8" />}
              title="Transformation"
              description="Changing what technology is FOR. Not order-taking. Not 3-year projects. Technology as living service—always adapting, always improving."
            />
            <LensCard
              icon={<Heart className="h-8 w-8" />}
              title="Service & Community"
              description="Technology is how government serves people. A website isn't a brochure—it's how residents get things done. Every touchpoint matters."
            />
          </div>
        </div>
      </section>

      {/* The Invitation */}
      <section className="bg-secondary-50 py-20">
        <div className="container-page">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="mb-6 text-h2 text-secondary-900">
              Government doesn&apos;t have to build alone.
            </h2>
            <p className="text-body-lg text-secondary-600">
              Imagine governments as an interconnected organism&mdash;sharing
              tools, sharing knowledge, building cooperatively. Not every city
              reinventing the same wheel. That&apos;s what we&apos;re testing.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary-500 py-16">
        <div className="container-page text-center">
          <h2 className="mb-4 text-h2 text-white">Everything here is free.</h2>
          <p className="mx-auto mb-8 max-w-xl text-lg text-primary-100">
            Use what we build. Learn from it. Build with us.
          </p>
          <Link
            href="/resources"
            className="inline-flex items-center rounded-lg bg-white px-8 py-3 text-lg font-medium text-primary-600 transition-colors hover:bg-primary-50"
          >
            Explore Resources
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>
    </>
  );
}

function LensCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border border-secondary-200 bg-white p-8 text-center">
      <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-primary-100 text-primary-600">
        {icon}
      </div>
      <h3 className="mb-3 text-h4 text-secondary-900">{title}</h3>
      <p className="text-body text-secondary-600">{description}</p>
    </div>
  );
}
