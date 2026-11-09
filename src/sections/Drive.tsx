import { Truck } from "@phosphor-icons/react";
import Container from "../components/Container.tsx";
import Reveal from "../components/Reveal.tsx";
import { STORE_LINKS } from "../lib/storeLinks.ts";
import JobCard from "./JobCard.tsx";
import StoreBadges from "./StoreBadges.tsx";

const STEPS = [
  { title: "Register.", body: "Sign up with your phone number." },
  { title: "Get approved.", body: "Our team checks your details." },
  { title: "Take jobs.", body: "Accept moves and run them from the app." },
];

export default function Drive() {
  return (
    <section id="drive" aria-labelledby="drive-title" className="py-20 md:py-28 lg:py-32">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          <div>
            <Reveal>
              <span className="inline-flex h-8 items-center gap-2 rounded-full bg-surface px-3 text-micro text-ink-2 ring-1 ring-line">
                <Truck size={14} weight="fill" aria-hidden="true" className="text-brand-ink" />
                For truck owners
              </span>
              <h2
                id="drive-title"
                className="mt-5 max-w-[18ch] font-display text-display-l text-ink"
              >
                Own a truck? Drive with Moviin.
              </h2>
              <p className="mt-4 max-w-[46ch] text-lede text-ink-2">
                Register in the crew app, add your details, and start getting jobs once our team approves you.
              </p>
            </Reveal>

            <ol className="mt-10 grid gap-6 sm:grid-cols-3 sm:gap-4">
              {STEPS.map((s, i) => (
                <Reveal as="li" key={s.title} delay={i * 0.07} className="flex gap-4 sm:flex-col sm:gap-3">
                  <span
                    aria-hidden="true"
                    className="grid size-9 shrink-0 place-items-center rounded-full bg-brand-tint font-display text-[15px] font-bold tabular-nums text-brand-ink"
                  >
                    {i + 1}
                  </span>
                  <p className="text-ink-2">
                    <span className="block font-display font-bold text-ink">{s.title}</span>
                    {s.body}
                  </p>
                </Reveal>
              ))}
            </ol>

            <Reveal delay={0.1} className="mt-10">
              <StoreBadges
                ios={STORE_LINKS.crewIos}
                android={STORE_LINKS.crewAndroid}
                surface="page"
                appName="Moviin crew app"
              />
            </Reveal>
          </div>

          <Reveal delay={0.12} className="flex flex-col items-center gap-3">
            <div className="w-full max-w-[400px] rounded-[32px] bg-tray p-1.5 ring-1 ring-line">
              <div className="flex justify-center rounded-[26px] bg-surface-alt p-4 sm:p-8">
                <JobCard />
              </div>
            </div>
            <p className="text-[13px] text-ink-3">Illustration</p>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
