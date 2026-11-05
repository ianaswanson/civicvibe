"use client";

import { useEffect, useRef, useState } from "react";

// A 1920x1080 slide, scaled to the width it is given. The slide's own inline
// styles do the layout; this only sets the scale.
export function SlideFrame({ html, label }: { html: string; label: string }) {
  const box = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.5);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const fit = () => setScale(el.clientWidth / 1920);
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={box} className="w-full overflow-hidden rounded-sm border border-paper/15 bg-paper" style={{ aspectRatio: "16 / 9" }}>
      <div
        role="img"
        aria-label={label}
        className="slide"
        style={{ transform: `scale(${scale})`, transformOrigin: "top left" }}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}
