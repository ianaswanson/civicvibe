import type { Metadata } from "next";
import Link from "next/link";
import { CopyNeeded } from "@/components/CopyNeeded";
import { WhoIsWriting } from "@/components/WhoIsWriting";

export const metadata: Metadata = {
  title: "We know we need to change",
  description: "[copy needed]",
};

// Door 1. First screen is wireframe sentences 8-11, verbatim.
export default function StartPage() {
  return (
    <>
      <div className="container-page py-16 sm:py-20">
        <div className="max-w-2xl space-y-6 text-body-lg text-secondary-800">
          <p>
            We have a big team full of committed people, and we&apos;re good at
            delivering technology projects. Still, work takes a long time, big
            projects don&apos;t succeed, the people we serve are frustrated, and
            the business side and the technology side rub against each other.
          </p>
          <div>
            <p className="font-semibold text-secondary-900">Does this feel familiar?</p>
            <ul className="mt-3 list-disc space-y-2 pl-6">
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

        <div className="mt-16 max-w-2xl">
          <CopyNeeded what="one person's week" />
          <CopyNeeded what="the six shifts" />
          <CopyNeeded what="start Monday" />
        </div>

        <p className="mt-12">
          <Link href="/system" className="btn-primary">
            The system
          </Link>
        </p>
      </div>
      <WhoIsWriting />
    </>
  );
}
