/* eslint-disable @next/next/no-img-element -- blended into the door's colour, like the hall's portals. */
import type { Door } from "@/components/SiteFrame";

// What you see through each door from the hall: door 1 opens on a garden, door 2 on the works.
const worlds: Record<Door, { src: string; width: number; height: number }> = {
  1: { src: "/home/portal-garden.jpg", width: 600, height: 804 },
  2: { src: "/home/portal-works.jpg", width: 600, height: 795 },
};

// The top of a door's landing page: the doorway you just walked through, and the first words.
export function PageHead({ door, children }: { door: Door; children: React.ReactNode }) {
  const world = worlds[door];
  return (
    <div className="grid items-end gap-8 md:grid-cols-portal md:gap-12">
      <div className="relative w-24 overflow-hidden rounded-t-full bg-door-lit md:w-full" aria-hidden="true">
        <img
          src={world.src}
          alt=""
          width={world.width}
          height={world.height}
          className="block w-full contrast-125 mix-blend-multiply"
        />
      </div>
      <div className="max-w-measure">{children}</div>
    </div>
  );
}
