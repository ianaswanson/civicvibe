"use client";

import { useEffect } from "react";

/*
  The homepage's motion, ported from design/homepage/index.html.

  1. The walk through the door: scroll opens the tree door, then carries you in.
  2. The way down: walls closer than the words, so they run faster; trinkets drift and
     turn past you; each tag and paragraph arrives as you reach it.

  Progressive: without this, or with reduced motion, the page is a plain, static stack.
*/
export function HomeMotion() {
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const root = document.querySelector<HTMLElement>(".home");
    if (!root) return;
    const q = <T extends HTMLElement>(sel: string) => root.querySelector<T>(sel)!;
    const qa = <T extends HTMLElement>(sel: string) => [...root.querySelectorAll<T>(sel)];

    const clamp = (v: number) => Math.min(1, Math.max(0, v));
    const seg = (p: number, a: number, b: number) => clamp((p - a) / (b - a));
    const inOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

    // ---- 1. the door in the tree ----
    root.classList.add("scrub");
    const entry = q(".entry");
    const stage = q(".stage");
    const scene = q(".scene");
    const leaf = q(".leaf-t");
    const inside = q(".inside");
    const headline = q(".headline");
    const mast = q(".mast");
    const bypass = q(".bypass");
    const dark = q(".dark");
    const tree = q<HTMLImageElement>(".tree");

    // door geometry in scene fractions (matches the CSS)
    const D = { w: 0.1101, h: 0.35417, ox: 0.5032, oy: 0.6214 };
    let g: { dx: number; dy: number; hy: number; lnS: number } | null = null;

    // keep the trunk out from behind the words: fade the engraving in only below the headline
    function clearHeadline() {
      const th = tree.offsetHeight;
      if (!th) return;
      const hb = headline.offsetTop + headline.offsetHeight + 12;
      const a = Math.max(4, ((hb - scene.offsetTop) / th) * 100);
      const b = Math.max(32, a + 20);
      const m = `linear-gradient(transparent ${a.toFixed(1)}%, #000 ${b.toFixed(1)}%)`;
      tree.style.webkitMaskImage = m;
      tree.style.maskImage = m;
    }

    function measure() {
      clearHeadline();
      const vw = stage.clientWidth;
      const vh = stage.clientHeight;
      const w = scene.offsetWidth;
      const h = scene.offsetHeight;
      const ox = scene.offsetLeft + w * D.ox;
      const oy = scene.offsetTop + h * D.oy;
      // big enough that the doorway's dark covers the whole screen, with room to spare
      const S = 1.3 * Math.max(vw / (w * D.w), vh / (0.62 * h * D.h));
      g = { dx: vw / 2 - ox, dy: vh * 0.5 - oy, hy: vh * 0.22 - oy, lnS: Math.log(S) };
    }

    function doorFrame() {
      if (!g) measure();
      const geo = g!;
      const total = entry.offsetHeight - stage.offsetHeight;
      const p = clamp(-entry.getBoundingClientRect().top / total);

      // the door swings in on its hinge, and the leaf falls into shadow as it turns
      const o = inOut(seg(p, 0.03, 0.36));
      leaf.style.setProperty("--open", `${7 + o * 81}deg`);
      inside.style.setProperty("--crack", String(1 - inOut(seg(p, 0.03, 0.22))));
      leaf.style.setProperty("--lid", String(1 - o * 0.55));

      // push in: scale in log space so the approach feels like steady travel, not a zoom
      const c = inOut(seg(p, 0.12, 0.72));
      const u = seg(p, 0.1, 0.97);
      const s = Math.exp(geo.lnS * (0.3 * u + 0.7 * u * u * u));
      scene.style.transform = `translate(${geo.dx * c}px, ${geo.dy * c}px) scale(${s})`;
      scene.style.filter = s > 2.2 ? `blur(${((s - 2.2) * 0.09).toFixed(2)}px)` : "none";
      // the words ride on the near plane: as you walk in they slide up and out of frame,
      // held until the push-in is under way so the sky never sits empty
      const lift = geo.hy * (s - 1) + geo.dy * c;
      headline.style.opacity = String(1 - inOut(seg(p, 0.24, 0.5)));
      headline.style.transform = `translateY(${Math.min(0, lift * 0.9)}px)`;
      mast.style.opacity = String(1 - seg(p, 0.03, 0.18));
      mast.style.visibility = p > 0.18 ? "hidden" : "";
      bypass.style.opacity = String(0.78 * (1 - seg(p, 0, 0.08)));
      bypass.style.visibility = p > 0.08 ? "hidden" : "";
      inside.style.setProperty("--glow", String(1 - inOut(seg(p, 0.5, 0.88))));
      dark.style.opacity = String(seg(p, 0.86, 0.99));
    }

    // ---- 2. the way down ----
    const fall = q(".fall");
    const walls = q(".walls");
    const num = (el: HTMLElement, prop: string, fallback: number) =>
      parseFloat(getComputedStyle(el).getPropertyValue(prop)) || fallback;
    const objs = qa(".obj").map((el) => ({
      el,
      amp: num(el, "--amp", 20),
      r0: num(el, "--r0", -10),
      r1: num(el, "--r1", 10),
    }));
    const lifts = qa(".lift");
    const saids = qa(".said");

    // how far an element has travelled through the screen: 0 entering at the bottom, 1 leaving at the top
    const through = (r: DOMRect, vh: number) => clamp((vh - r.top) / (vh + r.height));
    const arrival = (r: DOMRect, vh: number, from: number, span: number) =>
      clamp((vh * (1 - from) - r.top) / (vh * span));

    function fallFrame() {
      const vh = innerHeight;
      const fr = fall.getBoundingClientRect();
      if (fr.bottom < -vh || fr.top > 2 * vh) return;
      const p = through(fr, vh);
      walls.style.translate = `0 ${-(walls.offsetHeight / 3 + vh / 3) * p}px`;
      for (const o of objs) {
        const t = through(o.el.getBoundingClientRect(), vh);
        o.el.style.translate = `0 ${o.amp * (1 - 2 * t)}vh`;
        o.el.style.rotate = `${o.r0 + (o.r1 - o.r0) * t}deg`;
      }
      for (const el of lifts) {
        const a = arrival(el.getBoundingClientRect(), vh, 0.1, 0.45);
        el.style.opacity = String(a);
        el.style.scale = String(0.86 + 0.14 * a);
      }
      for (const el of saids) {
        const a = arrival(el.getBoundingClientRect(), vh, 0, 0.4);
        el.style.opacity = String(a);
        el.style.translate = `0 ${48 * (1 - a)}px`;
      }
    }

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        doorFrame();
        fallFrame();
      });
    };
    const onResize = () => {
      measure();
      doorFrame();
      fallFrame();
    };
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", onResize);
    addEventListener("load", onResize);
    onResize();

    return () => {
      removeEventListener("scroll", onScroll);
      removeEventListener("resize", onResize);
      removeEventListener("load", onResize);
      root.classList.remove("scrub");
    };
  }, []);

  return null;
}
