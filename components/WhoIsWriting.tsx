import Link from "next/link";

// Wireframe sentence 16. Sits above the footer on /start and /system.
export function WhoIsWriting({ linkStory = true }: { linkStory?: boolean }) {
  return (
    <section className="container-page">
      <p className="max-w-2xl border-t border-secondary-200 py-10 text-secondary-600">
        All of this came out of years of doing it inside government, after a
        long stretch doing it in a software company, and then relearning it with
        AI.{" "}
        {linkStory ? (
          <>
            The story of how is{" "}
            <Link href="/story" className="link">
              here
            </Link>
            , if you want it.
          </>
        ) : (
          <>The story of how is here, if you want it.</>
        )}{" "}
        It&apos;s not required reading.
      </p>
    </section>
  );
}
