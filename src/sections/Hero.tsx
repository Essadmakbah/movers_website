import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion, type Variants } from "motion/react";
import { CheckCircle, MapPin, Package, Truck } from "@phosphor-icons/react";
import Container from "../components/Container.tsx";
import Button from "../components/Button.tsx";
import Phone from "../components/Phone.tsx";
import StatusPill from "../components/StatusPill.tsx";
import { useActiveLoop } from "../components/useActiveLoop.ts";

const EASE_REVEAL = [0.16, 1, 0.3, 1] as const;
const EASE_OUT = [0.23, 1, 0.32, 1] as const;

/** Example ETA that only ever counts down (12, 11, 10) and then resets, every 9s while visible. */
function EtaNumber() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const active = useActiveLoop(ref, 0.5);
  const [n, setN] = useState(12);

  useEffect(() => {
    if (reduce || !active) return;
    const id = window.setInterval(() => setN((v) => (v <= 10 ? 12 : v - 1)), 9000);
    return () => window.clearInterval(id);
  }, [reduce, active]);

  return (
    <span ref={ref} className="relative inline-flex h-[1.15em] w-[2ch] justify-center overflow-hidden align-bottom num">
      <AnimatePresence initial={false} mode="popLayout">
        <motion.span
          key={n}
          className="block"
          initial={{ transform: "translateY(100%)" }}
          animate={{ transform: "translateY(0%)" }}
          exit={{ transform: "translateY(-100%)" }}
          transition={{ duration: 0.32, ease: EASE_OUT }}
        >
          {n}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

function EtaCard({ className = "" }: { className?: string }) {
  return (
    <div className={`rounded-[20px] bg-surface p-3 shadow-[var(--shadow-float)] ring-1 ring-line sm:p-4 ${className}`}>
      <StatusPill tone="info" icon={<Truck size={14} weight="fill" />}>
        En route to pickup
      </StatusPill>
      <p className="mt-2.5 font-display text-[18px] font-bold leading-tight tracking-[-0.015em] text-ink sm:text-[22px]">
        Arriving in <EtaNumber /> min
      </p>
      <p className="mt-1 text-meta text-ink-3">Kairaba Avenue, Serrekunda</p>
    </div>
  );
}

function ItemsCard({ className = "" }: { className?: string }) {
  return (
    <div
      className={`flex items-center gap-3 rounded-[20px] bg-surface p-4 shadow-[var(--shadow-float)] ring-1 ring-line ${className}`}
    >
      <span className="grid size-10 shrink-0 place-items-center rounded-[12px] bg-brand-tint text-brand-ink">
        <Package size={22} aria-hidden="true" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-display text-[15px] font-bold leading-snug text-ink num">24 of 24 items checked</span>
        <span className="block text-meta text-ink-3">Pickup manifest complete</span>
      </span>
      <CheckCircle size={22} weight="fill" className="shrink-0 text-positive-fg" aria-hidden="true" />
    </div>
  );
}

export default function Hero() {
  const reduce = useReducedMotion();

  const copy: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: reduce ? 0 : 0.08 } },
  };
  const item: Variants = reduce
    ? { hidden: { opacity: 0 }, show: { opacity: 1, transition: { duration: 0.2 } } }
    : {
        hidden: { opacity: 0, y: 16 },
        show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE_REVEAL } },
      };

  const card = (delay: number) =>
    reduce
      ? { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.2 } }
      : {
          initial: { opacity: 0, scale: 0.94 },
          animate: { opacity: 1, scale: 1 },
          transition: { duration: 0.6, delay, ease: EASE_OUT },
        };

  return (
    <section
      id="top"
      aria-labelledby="hero-title"
      className="relative pt-24 pb-16 sm:pt-28 lg:min-h-[min(100svh,880px)] lg:pt-[8.5rem] lg:pb-24"
    >
      <Container className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
        <motion.div variants={copy} initial="hidden" animate="show" className="min-w-0">
          <motion.p
            variants={item}
            className="inline-flex h-8 items-center gap-2 rounded-full bg-surface px-3 text-micro text-ink-2 ring-1 ring-line"
          >
            <MapPin size={14} weight="fill" className="text-brand-ink" aria-hidden="true" />
            Moving across The Gambia
          </motion.p>

          <motion.h1
            id="hero-title"
            variants={item}
            className="mt-5 max-w-[13ch] pb-1 font-display text-display-xl leading-[1.08] text-ink"
          >
            Your whole move,{" "}
            <em className="hero-highlight font-bold italic text-brand-ink">in one app.</em>
          </motion.h1>

          <motion.p variants={item} className="mt-4 max-w-[38ch] text-lede text-ink-2 sm:mt-5">
            Book a truck and crew, see the price upfront, and follow every item to your new door.
          </motion.p>

          <motion.div variants={item} className="mt-8 flex flex-col gap-3 min-[480px]:flex-row">
            <Button id="hero-cta" href="#get-app" orb fullOnMobile>
              Book a move
            </Button>
            <Button href="#how-it-works" variant="ghost" fullOnMobile>
              See how it works
            </Button>
          </motion.div>
        </motion.div>

        {/* Visual */}
        <div className="relative mx-auto w-full max-w-[520px] lg:max-w-none">
          <figure className="relative m-0 flex h-[584px] items-start justify-center lg:h-[600px] lg:items-center">
            <span
              aria-hidden="true"
              className="pointer-events-none absolute left-1/2 top-1/2 size-[340px] -translate-x-1/2 -translate-y-1/2 rounded-full sm:size-[460px] lg:left-[56%]"
              style={{ background: "radial-gradient(closest-side, var(--halo), transparent)" }}
            />
            <motion.div
              className="relative lg:translate-x-[6%]"
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 32, scale: 0.98 }}
              animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
              transition={reduce ? { duration: 0.2 } : { duration: 0.9, delay: 0.15, ease: EASE_REVEAL }}
            >
              <Phone
                src="/screens/live-tracking.png"
                alt="Movers app live tracking screen showing the driver on the way to pickup."
                priority
              />
            </motion.div>

            {/* Card A: desktop top-left, mobile overlapping the phone's bottom edge */}
            <div className="absolute bottom-0 left-1/2 z-[var(--z-float)] w-[min(244px,100%)] -translate-x-1/2 lg:bottom-auto lg:left-0 lg:top-[12%] lg:translate-x-0">
              <motion.div style={{ transformOrigin: "right center" }} {...card(0.55)}>
                <EtaCard />
              </motion.div>
            </div>

            {/* Card B: desktop only */}
            <div className="absolute bottom-[14%] right-0 z-[var(--z-float)] hidden w-[248px] lg:block">
              <motion.div style={{ transformOrigin: "left center" }} {...card(0.7)}>
                <ItemsCard />
              </motion.div>
            </div>

            <figcaption className="absolute -bottom-8 left-0 right-0 text-center text-[12px] text-ink-3 lg:bottom-0 lg:text-left">
              Example move shown
            </figcaption>
          </figure>
        </div>
      </Container>
    </section>
  );
}
