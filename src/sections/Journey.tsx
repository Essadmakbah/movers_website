import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { Truck } from "@phosphor-icons/react";
import Container from "../components/Container.tsx";
import Reveal from "../components/Reveal.tsx";
import { useMediaQuery } from "../components/useActiveLoop.ts";

const STEPS = [
  { title: "Book.", body: "Add your items room by room, pick a date and get your fare in dalasi." },
  { title: "Get matched.", body: "Our team assigns an approved driver, helpers and the right truck." },
  { title: "Track live.", body: "Follow the truck on the map and get an update at every stage." },
  { title: "Sign off.", body: "Every item is checked again at dropoff. You sign when you are happy." },
] as const;

const LAST = STEPS.length - 1;
const EASE_IN_OUT = [0.77, 0, 0.175, 1] as const;

export default function Journey() {
  const reduce = useReducedMotion();
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const listRef = useRef<HTMLOListElement>(null);
  const lastRef = useRef<HTMLLIElement>(null);
  const [trackH, setTrackH] = useState(0);
  const [activeIdx, setActiveIdx] = useState(reduce ? LAST : 0);

  // Desktop: time-based, plays once when half in view.
  const timeP = useMotionValue(reduce ? 1 : 0);
  const inView = useInView(listRef, { once: true, amount: 0.5 });

  // Mobile: scroll-linked, sprung.
  const { scrollYProgress } = useScroll({ target: listRef, offset: ["start 70%", "end 55%"] });
  const scrollP = useSpring(scrollYProgress, { stiffness: 140, damping: 30 });

  const fixedP = useMotionValue(1);
  const p = reduce ? fixedP : isDesktop ? timeP : scrollP;

  useEffect(() => {
    if (reduce || !isDesktop || !inView) return;
    const a = animate(timeP, [0, 0, 1 / 3, 1 / 3, 2 / 3, 2 / 3, 1], {
      duration: 2.8,
      times: [0, 0.08, 0.3, 0.4, 0.62, 0.72, 0.95],
      ease: EASE_IN_OUT,
    });
    return () => a.stop();
  }, [reduce, isDesktop, inView, timeP]);

  useMotionValueEvent(p, "change", (v) => {
    let idx = 0;
    for (let i = 0; i <= LAST; i++) if (v >= i / LAST - 0.02) idx = i;
    setActiveIdx((cur) => (cur === idx ? cur : idx));
  });

  useEffect(() => {
    if (reduce) setActiveIdx(LAST);
    else setActiveIdx(Math.round(p.get() * LAST));
  }, [reduce, p]);

  // Vertical track length = distance from the first dot centre to the last.
  useLayoutEffect(() => {
    const last = lastRef.current;
    if (!last) return;
    const measure = () => setTrackH(last.offsetTop);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(listRef.current ?? last);
    return () => ro.disconnect();
  }, []);

  const truckX = useTransform(p, (v) => `translateX(${v * 100}%)`);
  const truckY = useTransform(p, (v) => `translateY(${v * 100}%)`);
  const fillX = useTransform(p, (v) => `scaleX(${v})`);
  const fillY = useTransform(p, (v) => `scaleY(${v})`);

  const truckChip = (
    <span className="grid size-11 place-items-center rounded-full bg-gold text-on-gold shadow-[var(--shadow-raised)]">
      <Truck size={22} weight="fill" aria-hidden="true" />
    </span>
  );

  return (
    <section id="how-it-works" aria-labelledby="how-title" className="py-20 md:py-28 lg:py-32">
      <Container>
        <Reveal>
          <h2 id="how-title" className="max-w-[20ch] font-display text-display-l text-ink">
            Always know where your move is.
          </h2>
          <p className="mt-4 max-w-[38ch] text-lede text-ink-2">Four steps from first tap to last box.</p>
        </Reveal>

        <div className="relative mt-12 md:mt-16">
          {/* Desktop track */}
          <span
            aria-hidden="true"
            className="absolute left-5 right-[calc(25%-44px)] top-[19px] hidden h-0.5 rounded-full bg-line-strong md:block"
          />
          <motion.span
            aria-hidden="true"
            className="absolute left-5 right-[calc(25%-44px)] top-[19px] hidden h-0.5 origin-left rounded-full bg-brand-ink md:block"
            style={{ transform: fillX }}
          />
          {/* Truck rail: the wrapper is one track-length wide and sits just left of the
              track, with the truck pinned to its right edge. Translating it by p*100%
              moves the truck exactly the track length, and any overhang falls on the
              left (unscrollable) side, so the page never gains horizontal scroll. */}
          <motion.span
            aria-hidden="true"
            className="absolute -top-0.5 right-[calc(100%+2px)] z-[1] hidden w-[calc(75%+24px)] md:block"
            style={{ transform: truckX }}
          >
            <span className="absolute left-full top-0">{truckChip}</span>
          </motion.span>

          {/* Mobile track */}
          <span
            aria-hidden="true"
            className="absolute left-[19px] top-5 w-0.5 rounded-full bg-line-strong md:hidden"
            style={{ height: trackH }}
          />
          <motion.span
            aria-hidden="true"
            className="absolute left-[19px] top-5 w-0.5 origin-top rounded-full bg-brand-ink md:hidden"
            style={{ height: trackH, transform: fillY }}
          />
          <motion.span
            aria-hidden="true"
            className="absolute -left-0.5 z-[1] w-11 md:hidden"
            style={{ top: -2 - trackH, height: trackH, transform: truckY }}
          >
            <span className="absolute left-0 top-full">{truckChip}</span>
          </motion.span>

          <ol ref={listRef} className="space-y-10 md:grid md:grid-cols-4 md:gap-8 md:space-y-0">
            {STEPS.map((s, i) => {
              const on = i <= activeIdx;
              return (
                <li key={s.title} ref={i === LAST ? lastRef : undefined} className="relative pl-16 md:pl-0 md:pt-16">
                  <span
                    aria-hidden="true"
                    className={`absolute left-0 top-0 grid size-10 place-items-center rounded-full bg-surface ring-1 transition-shadow duration-[240ms] ease-out ${
                      on ? "ring-brand-ink shadow-[0_0_0_6px_var(--color-brand-tint)]" : "ring-line-strong"
                    }`}
                  >
                    <span
                      className={`size-2.5 rounded-full transition-[transform,background-color] duration-[240ms] ease-out ${
                        on ? "scale-100 bg-brand-ink" : "scale-[0.6] bg-line-strong"
                      }`}
                    />
                  </span>
                  <h3
                    className={`pt-1.5 font-display text-[20px] font-bold leading-7 tracking-[-0.015em] transition-colors duration-[240ms] md:pt-0 ${
                      on ? "text-ink" : "text-ink-3"
                    }`}
                  >
                    {s.title}
                  </h3>
                  <p className="mt-1.5 max-w-[30ch] text-meta text-ink-2 md:max-w-[26ch]">{s.body}</p>
                </li>
              );
            })}
          </ol>
        </div>
      </Container>
    </section>
  );
}
