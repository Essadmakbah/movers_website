import { motion, useReducedMotion } from "motion/react";
import { Coins, DeviceMobile, WifiSlash, type Icon } from "@phosphor-icons/react";
import Container from "../components/Container.tsx";
import Reveal from "../components/Reveal.tsx";

const FACTS: { icon: Icon; title: string; body: string }[] = [
  { icon: Coins, title: "Priced in dalasi.", body: "Every fare, receipt and payment is in GMD." },
  {
    icon: DeviceMobile,
    title: "Your number is your account.",
    body: "Sign in with an SMS code and keep it safe with a PIN.",
  },
  { icon: WifiSlash, title: "Patchy signal is fine.", body: "The crew app keeps working and catches up later." },
];

function Place({ children }: { children: string }) {
  const reduce = useReducedMotion();
  const band = "linear-gradient(var(--color-highlight), var(--color-highlight))";
  const base = {
    backgroundImage: band,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "0 88%",
    WebkitBoxDecorationBreak: "clone" as const,
    boxDecorationBreak: "clone" as const,
  };
  if (reduce) {
    return (
      <span className="text-ink" style={{ ...base, backgroundSize: "100% 0.32em" }}>
        {children}
      </span>
    );
  }
  return (
    <motion.span
      className="text-ink"
      style={base}
      initial={{ backgroundSize: "0% 0.32em" }}
      whileInView={{ backgroundSize: "100% 0.32em" }}
      viewport={{ once: true, amount: 0.6 }}
      transition={{ duration: 0.8, delay: 0.2, ease: [0.23, 1, 0.32, 1] }}
    >
      {children}
    </motion.span>
  );
}

export default function Local() {
  return (
    <section id="gambia" aria-labelledby="gambia-title" className="pb-20 pt-12 md:pb-28 md:pt-16 lg:pb-32">
      <Container>
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          <Reveal className="lg:col-span-7">
            <h2
              id="gambia-title"
              className="max-w-[22ch] font-display text-statement font-semibold text-ink-3"
            >
              Made for moving in <Place>Banjul, Serrekunda, Brikama</Place> and beyond.
            </h2>
          </Reveal>

          <ul className="divide-y divide-line border-y border-line lg:col-span-5 lg:self-center">
            {FACTS.map((f, i) => {
              const FactIcon = f.icon;
              return (
                <Reveal as="li" key={f.title} delay={i * 0.07} className="flex gap-4 py-5">
                  <span
                    aria-hidden="true"
                    className="grid size-11 shrink-0 place-items-center rounded-[12px] bg-brand-tint text-brand-ink"
                  >
                    <FactIcon size={22} />
                  </span>
                  <div>
                    <h3 className="font-display text-lg font-bold tracking-[-0.01em] text-ink">{f.title}</h3>
                    <p className="mt-1 text-ink-2">{f.body}</p>
                  </div>
                </Reveal>
              );
            })}
          </ul>
        </div>
      </Container>
    </section>
  );
}
