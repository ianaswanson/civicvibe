/* eslint-disable @next/next/no-img-element -- the engravings are composited with blend
   modes, masks and percentage geometry; next/image's wrappers and srcset would break the fit. */
import type { CSSProperties } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Schibsted_Grotesk, Work_Sans } from "next/font/google";
import { HomeMotion } from "@/components/home/HomeMotion";
import { GITHUB_REPO } from "@/lib/system";
import "./home.css";

// The homepage, ported from design/homepage/index.html (see PROCESS.md there for how it was made).
// Copy is Ian's, verbatim; it matches BRAND.md's opener.

const display = Schibsted_Grotesk({
  subsets: ["latin"],
  weight: ["500", "700", "800", "900"],
  display: "swap",
  variable: "--font-schibsted",
});
const text = Work_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
  variable: "--font-work-sans",
});

export const metadata: Metadata = {
  title: { absolute: "CivicVibe" },
};

const img = (name: string) => `/home/${name}`;

// The passage walls, top to bottom: roots, stone, shelves, maps, cupboards, rock, the hall's ceiling.
// --h is each strip's height relative to its width, so they stack without stretching.
const leftWall: [string, number][] = [
  ["w-roots.jpg", 1.97],
  ["w-brick2.jpg", 1.83],
  ["w-shelves.jpg", 3.93],
  ["w-maps.jpg", 3.24],
  ["w-cupboards.jpg", 3.84],
  ["w-rock.jpg", 3.19],
  ["w-rock2.jpg", 1.81],
  ["w-hall.jpg", 4.32],
];
const rightWall: [string, number][] = [
  ["w-roots.jpg", 1.97],
  ["w-brick2.jpg", 1.83],
  ["w-maps.jpg", 3.24],
  ["w-shelves.jpg", 3.93],
  ["w-cupboards.jpg", 3.84],
  ["w-rock2.jpg", 1.81],
  ["w-rock.jpg", 3.19],
  ["w-hall.jpg", 4.32],
];

function Wall({ side, strips }: { side: "l" | "r"; strips: [string, number][] }) {
  return (
    <div className={`wall wall--${side}`}>
      {strips.map(([name, h], i) => (
        <img
          key={`${name}-${i}`}
          src={img(name)}
          alt=""
          loading={i < 2 ? undefined : "lazy"}
          style={{ "--h": h } as CSSProperties}
        />
      ))}
    </div>
  );
}

function Arrow() {
  return (
    <svg className="door__arrow" viewBox="0 0 132 28" aria-hidden="true" focusable="false">
      <g>
        <path d="M0 14H112" />
        <path d="M99 2L114 14L99 26" />
      </g>
    </svg>
  );
}

export default function HomePage() {
  return (
    <div className={`home ${display.variable} ${text.variable}`}>
      <a className="skip" href="#doors">
        Skip to the two doors
      </a>

      {/* invert an engraving and ink it green or pink, for the passage walls */}
      <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true" focusable="false">
        <filter id="to-green" colorInterpolationFilters="sRGB">
          <feColorMatrix type="matrix" values="-1 0 0 0 1  -1 0 0 0 1  -1 0 0 0 1  0 0 0 1 0" />
          <feComponentTransfer>
            <feFuncR type="linear" slope="2.8" intercept="-1.25" />
            <feFuncG type="linear" slope="2.8" intercept="-1.25" />
            <feFuncB type="linear" slope="2.8" intercept="-1.25" />
          </feComponentTransfer>
          <feColorMatrix type="matrix" values="0.047 0 0 0 0  0 0.949 0 0 0  0 0 0.337 0 0  0 0 0 1 0" />
        </filter>
        <filter id="to-pink" colorInterpolationFilters="sRGB">
          <feColorMatrix type="matrix" values="-1 0 0 0 1  -1 0 0 0 1  -1 0 0 0 1  0 0 0 1 0" />
          <feComponentTransfer>
            <feFuncR type="linear" slope="2.8" intercept="-1.25" />
            <feFuncG type="linear" slope="2.8" intercept="-1.25" />
            <feFuncB type="linear" slope="2.8" intercept="-1.25" />
          </feComponentTransfer>
          <feColorMatrix type="matrix" values="0.957 0 0 0 0  0 0.09 0 0 0  0 0 0.678 0 0  0 0 0 1 0" />
        </filter>
      </svg>

      <div className="entry">
        <header className="stage">
          <div className="wrap mast">
            <Link className="mark" href="/">
              CivicVibe
            </Link>
            <nav aria-label="Primary">
              <ul>
                <li>
                  <Link href="/start">Start</Link>
                </li>
                <li>
                  <Link href="/system">The system</Link>
                </li>
                <li>
                  <a href={GITHUB_REPO}>GitHub</a>
                </li>
              </ul>
            </nav>
          </div>
          <h1 className="wrap headline">
            Everyone in government tech who yearns for digital transformation but has hit the wall
            too many times, I&apos;m gonna help you <span className="ruled">make a door</span>.
          </h1>
          <div className="scene" aria-hidden="true">
            <img className="tree" src={img("tree.jpg")} alt="" width={1544} height={672} />
            <div className="doorway">
              <div className="inside">
                <img src={img("w-roots.jpg")} alt="" />
                <img src={img("w-roots.jpg")} alt="" />
              </div>
              <div className="leaf-t">
                <img src={img("tree.jpg")} alt="" width={1544} height={672} />
              </div>
            </div>
          </div>
          <a className="bypass" href="#doors">
            skip to the doors ↓
          </a>
          <div className="dark" aria-hidden="true" />
        </header>
      </div>

      <main id="main">
        <section className="fall" aria-label="What this is">
          <div className="walls" aria-hidden="true">
            <Wall side="l" strips={leftWall} />
            <Wall side="r" strips={rightWall} />
          </div>

          <div className="beat b1">
            <figure className="obj" aria-hidden="true">
              <img src={img("jar.jpg")} alt="" width={800} height={800} />
            </figure>
            <p className="lift">it&apos;s possible</p>
            <p className="said">
              I believe Government Digital Services can take all the best things about how to
              develop great software from the private sector and then add in the best mission and a
              sincere commitment to impacting lives. I&apos;ve been in the business of local digital
              government transformation for 4 years now and I&apos;ve done it.
            </p>
          </div>

          <div className="beat b2">
            <figure className="obj obj--map" aria-hidden="true">
              <img src={img("map.jpg")} alt="" width={1200} height={896} loading="lazy" />
            </figure>
            <figure className="obj obj--watch" aria-hidden="true">
              <img src={img("watch.jpg")} alt="" width={600} height={600} loading="lazy" />
            </figure>
            <p className="lift">this is how I did it</p>
            <p className="said">
              Civic Vibe is where I have open sourced all the tools, tricks, techniques that helped
              make it possible... and a few stories on how it actually unfolds, because y&apos;all,
              it ain&apos;t some straight and happy path.
            </p>
          </div>

          <div className="beat b3">
            <figure className="obj" aria-hidden="true">
              <img src={img("bottle.jpg")} alt="" width={597} height={800} loading="lazy" />
            </figure>
            <p className="lift">rebuild from the ground up</p>
            <p className="said">
              Also here is the obligatory AI. It&apos;s a thing, you&apos;ve heard. But I think AI is
              the moment government finally gets to rebuild how it works from the foundation up, do
              way more with way less, and be more radically human than ever. It just takes a full
              embrace, an open mind, and a willingness to take some risk on what&apos;s possible.
            </p>
          </div>

          <div className="beat b4">
            <figure className="obj" aria-hidden="true">
              <img src={img("key.jpg")} alt="" width={1024} height={1024} loading="lazy" />
            </figure>
            <p className="lift">
              go on,
              <br /> <span className="pk">look around</span>
            </p>
            <p className="said">
              Join me if you want the secrets, or you just want to hear all the wild stories of
              evolving technology in the most human way possible under the mountain of bureaucracy.
            </p>
          </div>
        </section>

        {/* The bottom of the well: a long low hall, doors all round, all locked, and two standing
            open. Everything is placed in the engraving's own percentages, like the tree above. */}
        <section className="hall" id="doors" aria-label="Two ways in">
          <div className="hall__scene" aria-hidden="true">
            <img className="hall__print" src={img("hall.jpg")} alt="" width={1600} height={893} loading="lazy" />
            <span className="portal portal--1">
              <img src={img("portal-garden.jpg")} alt="" width={600} height={804} loading="lazy" />
            </span>
            <span className="portal portal--2">
              <img src={img("portal-works.jpg")} alt="" width={600} height={795} loading="lazy" />
            </span>
            <span className="hall__light" />
          </div>
          <div className="hall__doors">
            <Link className="door door--1" href="/start">
              <span className="door__label">
                We want to transform but need to convince people to let us try
              </span>
              <span className="door__sub">
                Start here if this is new to you, or if you brought along someone who still needs
                convincing.
              </span>
              <Arrow />
            </Link>
            <span className="or" aria-hidden="true">
              or
            </span>
            <Link className="door door--2" href="/system">
              <span className="door__label">
                We run digital services, but it&apos;s not delivering what we&apos;d hoped.
              </span>
              <span className="door__sub">
                Start here if you want the system and the files, not the argument.
              </span>
              <Arrow />
            </Link>
          </div>
        </section>
      </main>

      <footer className="foot">
        <p>
          All of this came out of years of doing it inside government, after a long stretch doing
          it in a software company, and then relearning it with AI. The story of how is{" "}
          <Link href="/story">here</Link>, if you want it. It&apos;s not required reading.
        </p>
        <p className="fine">Code MIT. Content CC-BY.</p>
      </footer>

      <HomeMotion />
    </div>
  );
}
