import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "The story",
  description: "All of this came out of years of doing it inside government, after a long stretch doing it in a software company, and then relearning it with AI.",
};

export default function StoryPage() {
  return (
    <div className="container-page py-12 md:py-20">
      <div className="max-w-measure">
        <p className="font-display text-h4 font-extrabold text-paper md:text-h3">
          All of this came out of years of doing it inside government, after a
          long stretch doing it in a software company, and then relearning it
          with AI. The story of how is here, if you want it. It&apos;s not
          required reading.
        </p>
        {/* The story itself is not written yet. Ian writes it; nothing on the page says so. */}
      </div>
    </div>
  );
}
