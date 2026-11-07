import Image from "next/image";

export interface ShiftImage {
  src: string;
  alt: string;
  // "cover" for a photo, "contain" for an icon or drawing on its own ground.
  fit?: "cover" | "contain";
}

// One of the six shifts from doc 02: the from/to, a few sentences, and the
// everyday comparison as a pair of pictures (the team kickoff deck's).
export function Shift({
  from,
  to,
  children,
  images = [],
}: {
  from: string;
  to: string;
  children: React.ReactNode;
  images?: ShiftImage[];
}) {
  return (
    <section className="border-t border-paper/15 pt-8">
      <h3 className="font-display text-h4 font-extrabold text-paper">
        <span className="text-paper/60">From</span> {from} <span className="text-paper/60">to</span>{" "}
        <span className="text-door-lit">{to}</span>
      </h3>
      <div className="mt-4 max-w-measure space-y-4 text-body text-paper/85">{children}</div>
      {images.length > 0 && (
        <div className={`mt-6 grid gap-4 ${images.length > 1 ? "sm:grid-cols-2" : ""}`}>
          {images.map((img) => (
            <div
              key={img.src}
              className="relative overflow-hidden rounded-sm border border-paper/15 bg-paper"
              style={{ aspectRatio: "3 / 2" }}
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                sizes="(min-width: 640px) 24rem, 100vw"
                className={img.fit === "contain" ? "object-contain p-6" : "object-cover"}
              />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
