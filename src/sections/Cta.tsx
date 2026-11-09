import { ArrowRight } from "@phosphor-icons/react";
import Container from "../components/Container.tsx";
import Phone from "../components/Phone.tsx";
import Reveal from "../components/Reveal.tsx";
import { STORE_LINKS } from "../lib/storeLinks.ts";
import StoreBadges from "./StoreBadges.tsx";

export default function Cta() {
  return (
    <section id="get-app" aria-labelledby="get-app-title" className="py-16 md:py-24">
      <Container>
        <Reveal>
          <div className="rounded-[32px] bg-[rgb(0_83_68/0.10)] p-1.5 ring-1 ring-line">
            <div
              className="relative grid overflow-hidden rounded-[26px] bg-brand shadow-brand-hi [&_:focus-visible]:outline-gold lg:grid-cols-[1.25fr_0.75fr] lg:gap-10"
              style={{
                backgroundImage: "radial-gradient(120% 80% at 100% 0%, rgb(150 235 213 / 0.14), transparent 60%)",
              }}
            >
              <div className="p-6 pb-10 md:p-10 lg:p-16">
                <h2
                  id="get-app-title"
                  className="max-w-[16ch] font-display text-display-l text-on-brand"
                >
                  Ready when your boxes are.
                </h2>
                <p className="mt-4 max-w-[38ch] text-lede text-on-brand-muted">
                  Get the Movers app and book your move in a few minutes.
                </p>
                <div className="mt-8">
                  <StoreBadges
                    ios={STORE_LINKS.customerIos}
                    android={STORE_LINKS.customerAndroid}
                    surface="panel"
                    appName="Movers app"
                  />
                </div>
              </div>

              <div className="flex justify-center px-6 lg:items-end lg:px-0 lg:pr-16">
                <Phone
                  src="/screens/booking-confirmed.png"
                  alt="Movers app screen confirming a booked move."
                  className="-mb-24 lg:-mb-20 lg:mt-16"
                />
              </div>
            </div>
          </div>
        </Reveal>

        <p className="mt-8 text-center text-ink-2">
          Own a truck?{" "}
          <a
            href="#drive"
            className="group inline-flex min-h-11 items-center gap-1.5 font-display font-semibold text-brand-ink"
          >
            Drive with Movers
            <ArrowRight
              size={16}
              aria-hidden="true"
              className="transition-transform duration-200 ease-out group-hover:translate-x-[3px]"
            />
          </a>
        </p>
      </Container>
    </section>
  );
}
