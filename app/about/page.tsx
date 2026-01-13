import Link from "next/link";
import { ArrowRight, Cpu, RefreshCw, Heart } from "lucide-react";

export const metadata = {
  title: "About",
  description: "The vision behind CivicVibe.",
};

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-secondary-900 py-20 text-white">
        <div className="container-page">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-6 text-h1">The Vision</h1>
            <p className="text-body-xl text-secondary-300">
              The tech. The humans. Everything in between.
            </p>
          </div>
        </div>
      </section>

      {/* The Setup */}
      <section className="py-20">
        <div className="container-page">
          <div className="mx-auto max-w-3xl">
            <p className="mb-6 text-body-xl text-secondary-900">
              Government has always had something the private sector
              doesn&apos;t: people who genuinely understand community needs,
              paired with the mission and mandate to serve everyone.
            </p>
            <p className="text-body-lg text-secondary-600">
              The barrier was tooling. That barrier is falling.
            </p>
          </div>
        </div>
      </section>

      {/* The Core Insight */}
      <section className="bg-primary-50 py-16">
        <div className="container-page">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-6 text-h2 text-secondary-900">
              AI is &ldquo;magic&rdquo; in a specific way.
            </h2>
            <p className="mb-4 text-body-lg text-secondary-700">
              It breaks the old tradeoff between speed and safety. Historically,
              going fast meant cutting corners, creating risk, accumulating
              debt. AI lets you go fast <em>without</em> those dangers.
            </p>
            <p className="text-body-lg text-secondary-700">
              But fast at what? Not the same old thing, just faster.{" "}
              <strong>Better services. Better outcomes.</strong> To unlock that,
              you need more than new tools&mdash;you need to transform your
              concept of what technology is for.
            </p>
          </div>
        </div>
      </section>

      {/* Technology Is / Is Not */}
      <section className="py-20">
        <div className="container-page">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-8 text-h2 text-secondary-900">
              What technology actually is.
            </h2>
            <div className="grid gap-8 md:grid-cols-2">
              <div className="rounded-xl border border-secondary-200 bg-white p-6">
                <p className="mb-4 text-sm font-semibold uppercase tracking-wider text-secondary-500">
                  Technology is not
                </p>
                <ul className="space-y-4 text-body text-secondary-600">
                  <li>A commodity you order at a drive-through</li>
                  <li>
                    A custom thing you spec out and wait 3 years for delivery
                  </li>
                </ul>
              </div>
              <div className="rounded-xl border-2 border-primary-200 bg-primary-50 p-6">
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
      <section className="bg-secondary-50 py-20">
        <div className="container-page">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-4 text-h2 text-secondary-900">Three lenses.</h2>
            <p className="mb-12 text-body-lg text-secondary-600">
              This site is about the tech, the humans, and everything in
              between.
            </p>

            <div className="space-y-8">
              <LensBlock
                icon={<Cpu className="h-6 w-6" />}
                title="Technology & AI"
                body="The tools that break the speed/safety tradeoff. Automate, accelerate, unlock—without the historic dangers of moving fast. The people closest to problems can now build solutions themselves."
              />
              <LensBlock
                icon={<RefreshCw className="h-6 w-6" />}
                title="Transformation"
                body="Changing what you think technology is FOR. Not order-taking. Not 3-year projects. Technology as living service—constantly adapting, continuously improving, always oriented toward outcomes. This is what it means to be a technologist now."
              />
              <LensBlock
                icon={<Heart className="h-6 w-6" />}
                title="Service & Community"
                body="Technology isn't just internal tooling. It's how government serves people. A website isn't a brochure—it's how residents get things done. Communication isn't a nice-to-have—it's a service government provides (and largely isn't providing well). Every touchpoint is an opportunity."
              />
            </div>
          </div>
        </div>
      </section>

      {/* What This Is */}
      <section className="py-20">
        <div className="container-page">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-8 text-h2 text-secondary-900">What this is</h2>
            <div className="space-y-6">
              <WhatItem
                title="A testing ground"
                description="We build things to see what works. Real tools, real experiments."
              />
              <WhatItem
                title="A showcase"
                description="We share what we learn—the ideas, the tools, the failures, the wins."
              />
              <WhatItem
                title="An invitation"
                description="Use what we build. Learn from it. Or build with us."
              />
              <WhatItem
                title="Open by default"
                description="Free resources. Open source tools. No gatekeeping."
              />
            </div>
          </div>
        </div>
      </section>

      {/* Interconnected */}
      <section className="bg-secondary-900 py-20 text-white">
        <div className="container-page">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-6 text-h2">
              Government doesn&apos;t have to build alone.
            </h2>
            <p className="mb-4 text-body-lg text-secondary-300">
              Imagine governments as an interconnected organism&mdash;sharing
              tools, sharing knowledge, building cooperatively. Not every city
              reinventing the same wheel. Not every county buying the same
              vendor solution.
            </p>
            <p className="text-body-lg text-secondary-300">
              Can you build technology in a way that fosters this? Can open
              source thinking apply to government in a real way? That&apos;s
              part of what we&apos;re testing.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary-500 py-16">
        <div className="container-page">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-4 text-h3 text-white">
              See what we&apos;re building.
            </h2>
            <div className="mt-6 flex flex-col justify-center gap-4 sm:flex-row">
              <Link
                href="/projects"
                className="inline-flex items-center justify-center rounded-lg bg-white px-6 py-3 font-medium text-primary-600 transition-colors hover:bg-primary-50"
              >
                Explore Projects
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                href="/articles"
                className="inline-flex items-center justify-center rounded-lg border-2 border-white px-6 py-3 font-medium text-white transition-colors hover:bg-white/10"
              >
                Read Articles
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function WhatItem({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-4 rounded-lg bg-secondary-50 p-5">
      <div className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-primary-500" />
      <div>
        <h3 className="text-h4 text-secondary-900">{title}</h3>
        <p className="mt-1 text-body text-secondary-600">{description}</p>
      </div>
    </div>
  );
}

function LensBlock({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <div className="flex gap-6 rounded-xl border border-secondary-200 bg-white p-6">
      <div className="flex-shrink-0">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-100 text-primary-600">
          {icon}
        </div>
      </div>
      <div>
        <h3 className="mb-2 text-h4 text-secondary-900">{title}</h3>
        <p className="text-body text-secondary-600">{body}</p>
      </div>
    </div>
  );
}
