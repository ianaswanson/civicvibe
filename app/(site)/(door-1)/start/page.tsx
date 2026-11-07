import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getIndex } from "@/lib/system";
import { Arrow } from "@/components/Arrow";
import { DeckList } from "@/components/DeckList";
import { PageHead } from "@/components/PageHead";
import { Shift } from "@/components/Shift";
import { WhoIsWriting } from "@/components/WhoIsWriting";

export const metadata: Metadata = {
  title: "We know we need to change",
  description: "We know we need to change. We don't know how. Start here if this is new to you, or if you brought along someone who still needs convincing.",
};

// The team kickoff deck's illustrations, copied to public/ by the sync.
const img = (id: string) => `/images/system/decks/team-kickoff/${id}.jpg`;

// Door 1. First screen is wireframe sentences 8-11, verbatim. Then the beats
// from SITE-CONCEPT: one person's week, the six shifts (doc 02), start Monday
// (doc 15), and the three decks that bring a room along.
export default function StartPage() {
  const rooms = getIndex().decks.filter((d) => d.kind === "room");

  return (
    <>
      <div className="container-page py-12 md:py-20">
        <PageHead door={1}>
          <p className="font-display text-h4 font-extrabold text-paper md:text-h3">
            We have a big team full of committed people, and we&apos;re good at
            delivering technology projects. Still, work takes a long time, big
            projects don&apos;t succeed, the people we serve are frustrated, and
            the business side and the technology side rub against each other.
          </p>
        </PageHead>

        <div className="mt-14 max-w-measure space-y-6 text-body text-paper/85 md:ml-portal md:text-body-lg">
          <div>
            <p className="font-display font-extrabold text-door-lit">Does this feel familiar?</p>
            <ul className="mt-3 list-disc space-y-2 pl-6 marker:text-door-lit">
              <li>The request queue that never gets shorter.</li>
              <li>The timeline that gets re-estimated halfway through.</li>
              <li>
                The project that lands on time and on budget, and the partner is
                still unhappy.
              </li>
              <li>IT as a black box that closes tickets.</li>
            </ul>
          </div>
          <p>
            The people aren&apos;t the cause. The model is. We work as a vendor
            to a client: they bring requirements, we estimate, negotiate and
            deliver. That works for fixed things like hardware. It breaks for
            services that keep changing, serve many people, and start with
            unknown needs.
          </p>
          <p>
            Maybe 10% of what you do changes. But change your heading a few
            degrees and you land somewhere else entirely.
          </p>
        </div>

        {/* Beat 2: one person's week. A draft from the DMV thread (docs 01, 08, 13),
            not Ian's words yet; he rewrites it. Nothing on the page says so. */}
        <section className="mt-20 max-w-measure md:ml-portal">
          <h2 className="font-display text-h3 font-extrabold text-paper">One person&apos;s week</h2>
          <div className="mt-6 space-y-4 text-body text-paper/85">
              <p className="font-display font-extrabold text-door-lit">Before</p>
              <p>
                A counter clerk at a DMV field office. It&apos;s Wednesday and she has just sent
                the eighth person this week home: the copy of his birth certificate isn&apos;t one
                the state accepts, and nothing he read before coming in told him that. He took the
                morning off work for this. She tells her supervisor, who emails IT. Nothing comes
                back. The next time she has an idea, she tells a coworker instead.
              </p>
              <p className="font-display font-extrabold text-door-lit">After</p>
              <p>
                January 15. She types one line into the intake form: &ldquo;Show a document checklist
                before someone comes in for a new license.&rdquo; Tuesday the 21st, the team&apos;s
                weekly triage reads it, calls it an idea for improvement, and tags it to a goal the
                whole roadmap is built around: nobody should need two trips for a standard license.
                She hears back that week, in plain words, with what happens next.
              </p>
              <p>
                At the next quarter&apos;s planning the idea becomes an Initiative, and the product
                manager and the researcher come to her office to listen before anyone designs
                anything. A checklist gets prototyped and dropped: people didn&apos;t trust it. The
                thing that gets built instead lets an applicant send a photo of the document before
                the visit and hear within two business days whether it will be accepted. She is one
                of the field office staff invited to the sprint review where it&apos;s shown.
              </p>
              <p>
                When it ships, the release note goes to her too. On the appointment record she can
                now see which documents were already checked. The eighth person that week stops
                happening.
              </p>
          </div>
          <p className="mt-6 text-small text-paper/60">
            The same thread, artifact by artifact, is in{" "}
            <Link href="/system/shared-terms-and-artifacts#dmv-example" className="link">
              Shared terms and artifacts
            </Link>
            .
          </p>
        </section>

        {/* Beat 3: the six shifts, from doc 02 beats 3-8, with the kickoff deck's pictures. */}
        <section className="mt-20 md:ml-portal">
          <h2 className="font-display text-h3 font-extrabold text-paper">Six shifts</h2>
          <p className="mt-4 max-w-measure text-body text-paper/85 md:text-body-lg">
            Digital services changes where you start. Six shifts, each with an everyday comparison,
            because the idea lands faster than the argument does.
          </p>
          <div className="mt-10 space-y-10">
            <Shift
              from="outputs"
              to="outcomes"
              images={[
                { src: img("d43e6d8602e7f2f24f6808950d25dd41"), alt: "A checklist: the things we release, the work we completed", fit: "contain" },
                { src: img("4e0fce4cf70a3249d0af1ef17d5bc793"), alt: "A target with an arrow in the center: the results we achieve, the change people experience", fit: "contain" },
              ]}
            >
              <p>Success is the change you create, not the thing you shipped.</p>
              <p>
                &ldquo;We launched online renewal on schedule, all requirements met&rdquo; is an
                output. &ldquo;Six months later, three quarters of renewals are done online in under
                five minutes&rdquo; is an outcome. &ldquo;We built what you asked for&rdquo; becomes
                &ldquo;we achieved the outcome you need.&rdquo;
              </p>
            </Shift>
            <Shift
              from="incremental"
              to="iterative"
              images={[
                { src: img("14a5804fdd629fcc4b54017454dbf24b"), alt: "Top row: a wheel, an axle, a chassis, a car, with an unhappy face until the end. Bottom row: a skateboard, a scooter, a bike, a motorcycle, a car, happier at every step", fit: "contain" },
              ]}
            >
              <p>Deliver something that works early, then make it better.</p>
              <p>
                Wheels, then chassis, then engine, then body, usable in month eleven. Against that:
                skateboard, scooter, bike, motorcycle, usable in week two. Wheels are a component. A
                skateboard is something you can ride. Beware agile in name only, a faster assembly line
                that still builds the wrong car if the plan was wrong.
              </p>
            </Shift>
            <Shift
              from="order takers"
              to="collaborative partners"
              images={[
                { src: img("eeada3c095fa180765bb54f18c784311"), alt: "A sandwich shop line, each worker adding one ingredient" },
                { src: img("5c039b4c967e8873ceb8f6ca2bf91751"), alt: "A soccer team moving the ball together toward the goal" },
              ]}
            >
              <p>Partners bring problems and goals. The team figures out how.</p>
              <p>
                The sandwich line is great at filling orders. The soccer team has a fixed goal and a
                path that changes every few seconds. Both are skilled; they&apos;re built for different
                work. The question changes from &ldquo;what features, by when?&rdquo; to &ldquo;what
                problem are you solving, and what does success look like?&rdquo;
              </p>
            </Shift>
            <Shift from="requirements" to="feedback">
              <p>Learn what people need by putting working things in their hands.</p>
              <p>
                The skateboard teaches whether they need transportation at all. The scooter teaches
                speed. The bike teaches cargo. Each increment answers questions a conversation
                can&apos;t. Some requirements are real: security, compliance, integration. Separate
                those from habits dressed up as requirements.
              </p>
            </Shift>
            <Shift
              from="competing priorities"
              to="clear direction"
              images={[
                { src: img("24c4c2a0d9bfbc940e920e3123058253"), alt: "A chaotic orchestra with several people conducting at once" },
                { src: img("babd58183d499a65166cbc712999ddcc"), alt: "An orchestra playing together under one conductor" },
              ]}
            >
              <p>One accountable lead, inside the team, sets the order of work.</p>
              <p>
                Today several people each hold a &ldquo;number one&rdquo; priority and the team picks
                by biggest fire. There is no single direction of forward. One conductor; the section
                leaders still contribute.
              </p>
            </Shift>
            <Shift
              from="indirectly"
              to="directly serving the community"
              images={[
                { src: img("9de81154336b43dd4eb89bca6dbbca55"), alt: "A staff member working alone at a computer" },
                { src: img("d1d88e408fa24be8a6a173b88c73dd12"), alt: "A staff member helping a resident apply for benefits" },
              ]}
            >
              <p>
                We still serve staff, in service of the community. &ldquo;We help you serve the
                community&rdquo; replaces &ldquo;we do what you tell us.&rdquo;
              </p>
              <p>
                Residents use the website directly, so see the service from their side: not the IT
                window at the back of the office, but side by side at the public counter, helping the
                same person.
              </p>
            </Shift>
          </div>
          <div className="mt-12 grid items-center gap-6 border-t border-paper/15 pt-8 sm:grid-cols-2">
            <div className="max-w-measure space-y-4 text-body text-paper/85">
              <p className="font-display text-h4 font-extrabold text-paper">Only 10% is different</p>
              <p>
                Most of this won&apos;t feel new. The 10% that is sits at the foundation: each shift
                changes where you start, not the skills you use. Two ships leave the same port ten
                degrees apart and reach different islands.
              </p>
            </div>
            <div className="relative overflow-hidden rounded-sm border border-paper/15 bg-paper" style={{ aspectRatio: "3 / 2" }}>
              <Image
                src={img("580d18c85656ecb17de72898bc6870d4")}
                alt="Two paths leaving the same shore ten degrees apart and reaching different islands"
                fill
                sizes="(min-width: 640px) 24rem, 100vw"
                className="object-contain p-6"
              />
            </div>
          </div>
          <p className="mt-6 text-small text-paper/60">
            The whole story, with the questions people ask and how growth feels, is{" "}
            <Link href="/system/why-digital-services" className="link">
              Why digital services
            </Link>
            .
          </p>
        </section>

        {/* Beat 4: start Monday, from doc 15. */}
        <section className="mt-20 max-w-measure md:ml-portal">
          <h2 className="font-display text-h3 font-extrabold text-paper">Start Monday</h2>
          <p className="mt-4 text-body text-paper/85 md:text-body-lg">
            One team, one quarter. Go in order, and don&apos;t skip the first step to get to the team
            faster: a team that hears the model before its managers have agreed to it will be told
            two different things in the same week.
          </p>
          <ol className="mt-6 space-y-3 text-body text-paper/85">
            <li className="flex gap-4"><span className="w-8 shrink-0 font-mono text-small text-door-lit">1</span><span><b className="text-paper">Leaders.</b> Agreement on the why. A named steering group and advisory group. A date for the first direction review.</span></li>
            <li className="flex gap-4"><span className="w-8 shrink-0 font-mono text-small text-door-lit">2</span><span><b className="text-paper">Partners.</b> They know how to work with the team: how requests get an answer, when planning happens, what they will hear and when.</span></li>
            <li className="flex gap-4"><span className="w-8 shrink-0 font-mono text-small text-door-lit">3</span><span><b className="text-paper">The team.</b> The vision, the roles, what starts now, and the red flags written down.</span></li>
            <li className="flex gap-4"><span className="w-8 shrink-0 font-mono text-small text-door-lit">4</span><span><b className="text-paper">A working agreement.</b> Written as situations in time order, updated whenever someone hits a confusion point.</span></li>
            <li className="flex gap-4"><span className="w-8 shrink-0 font-mono text-small text-door-lit">5</span><span><b className="text-paper">Each practice, the week before the team first uses it.</b> Training weeks ahead is wasted; people forget it before they need it.</span></li>
          </ol>
          <p className="mt-6 text-body text-paper/85">
            Treat the first quarter as a rehearsal. Commit anyway: teams new to planning don&apos;t
            know how to commit yet, and committing is how they learn. Say what isn&apos;t ready at the
            start of the planning week.
          </p>
          <h3 className="mt-8 font-display text-h4 font-extrabold text-paper">What &ldquo;working&rdquo; looks like, by when</h3>
          <dl className="mt-4 divide-y divide-paper/15 border-y border-paper/15 text-body">
            {[
              ["The kickoff", "Steering and advisory groups named. Every request channel points to one intake form."],
              ["The first quarter starts", "Triage has run at least twice and every requester heard back. Quarterly commitments are written and each person committed out loud."],
              ["Sprint 1 review", "The first sprint report row exists, with a sprint goal and a yes or no."],
              ["The first month", "The first steering and advisory meetings have happened and changed something you can point to."],
              ["The end of the quarter", "The quarter review has marked each commitment Done or rolled forward. The team has held a retro on the system itself."],
            ].map(([by, what]) => (
              <div key={by} className="grid gap-1 py-3 sm:grid-cols-3 sm:gap-6">
                <dt className="font-display font-bold text-paper">{by}</dt>
                <dd className="text-paper/85 sm:col-span-2">{what}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-4 text-small text-paper/60">
            If one of these is missing, that is where to spend the next two weeks. The sequence, the
            rehearsal and the retro on the system itself are{" "}
            <Link href="/system/leading-the-change" className="link">
              Leading the change
            </Link>
            .
          </p>
        </section>

        {/* Beat 5: the three decks that bring a room along. */}
        <section className="mt-20 md:ml-portal">
          <h2 className="font-display text-h3 font-extrabold text-paper">If you brought someone along</h2>
          <p className="mt-4 max-w-measure text-body text-paper/85 md:text-body-lg">
            Three decks, one for each room, with the speaker notes and a PDF. Each says what the
            session should leave behind.
          </p>
          <DeckList decks={rooms} />
        </section>

        <p className="mt-16 md:ml-portal">
          <Link href="/system" className="btn-primary">
            The system
            <Arrow className="h-5 w-16" />
          </Link>
        </p>
      </div>
      <WhoIsWriting />
    </>
  );
}
