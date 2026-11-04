import Image from "next/image";
import type { BoardVisual } from "@/lib/system";

// One chapter of the FigJam board, as an image with the chapter's own words
// under it. The board is drawn from the files, so the figure illustrates the
// page; it never says anything the page doesn't.
export function BoardFigure({ visual, priority = false }: { visual: BoardVisual; priority?: boolean }) {
  return (
    <figure className="max-w-4xl">
      <a href={visual.src} className="block overflow-hidden rounded-sm border border-paper/15 bg-paper">
        <Image
          src={visual.src}
          alt={visual.alt}
          width={visual.width}
          height={visual.height}
          sizes="(min-width: 1024px) 56rem, 100vw"
          priority={priority}
          className="h-auto w-full"
        />
      </a>
      <figcaption className="mt-3 text-small text-paper/60">
        <span className="font-mono text-door-lit">{visual.chapter}</span>{" "}
        <span className="font-display font-bold text-paper/85">{visual.title}.</span> {visual.caption}
      </figcaption>
    </figure>
  );
}
