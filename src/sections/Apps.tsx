import { useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, CheckCircle, HardHat, House, SquaresFour, type Icon } from "@phosphor-icons/react";
import Container from "../components/Container.tsx";
import BrowserFrame from "../components/BrowserFrame.tsx";
import Phone from "../components/Phone.tsx";
import Reveal from "../components/Reveal.tsx";
import JobCard from "./JobCard.tsx";

type TabId = "customer" | "crew" | "dispatch";

const TABS: { id: TabId; label: string; icon: Icon }[] = [
  { id: "customer", label: "Customer", icon: House },
  { id: "crew", label: "Crew", icon: HardHat },
  { id: "dispatch", label: "Dispatch", icon: SquaresFour },
];

const COPY: Record<TabId, { title: string; checks: string[] }> = {
  customer: {
    title: "For the people moving",
    checks: [
      "Build your inventory room by room",
      "Review the full fare before you confirm",
      "Pay by card or mobile money",
      "Follow the truck live on the map",
    ],
  },
  crew: {
    title: "For drivers and helpers",
    checks: [
      "See your jobs and the route",
      "Move the job forward one tap at a time",
      "Check items in, even with no signal",
      "Collect the customer's signature at the end",
    ],
  },
  dispatch: {
    title: "For our dispatch team",
    checks: [
      "One queue for every booking",
      "Assign drivers, helpers and trucks",
      "Approve new drivers before their first job",
      "Set pricing and read customer reviews",
    ],
  },
};

type Screen = { src: string; alt: string; w: number; h: number; label: string };

/** Screens at their real pixel sizes. Rendered at or below native size, never upscaled. */
const CUSTOMER_SCREENS: Screen[] = [
  {
    src: "/screens/review-price.png",
    w: 183,
    h: 512,
    label: "Fare",
    alt: "Moviin fare review screen with an example itemised fare of GMD 4,500 before booking.",
  },
  {
    src: "/screens/booking-confirmed.png",
    w: 226,
    h: 512,
    label: "Booked",
    alt: "Moviin booking confirmation screen with the move reference, date and time.",
  },
  {
    src: "/screens/live-tracking.png",
    w: 226,
    h: 512,
    label: "Tracking",
    alt: "Moviin live tracking screen with the truck on the map and the arrival time.",
  },
];

/** Phone frame scaled down to a target height (never upscaled, never cropped). */
function Device({ screen, height, className = "" }: { screen: Screen; height: number; className?: string }) {
  const h = Math.min(height, screen.h);
  return (
    <Phone
      src={screen.src}
      alt={screen.alt}
      nativeWidth={screen.w}
      nativeHeight={screen.h}
      width={Math.round((screen.w * h) / screen.h)}
      className={className}
    />
  );
}

function CustomerVisual() {
  const [shown, setShown] = useState(0);
  const [left, center, right] = CUSTOMER_SCREENS;
  return (
    <>
      {/* Desktop: a fan of three phones */}
      <div className="relative hidden items-end justify-center sm:flex">
        <Device screen={left} height={392} className="z-0 -mr-8 translate-y-6 -rotate-6" />
        <Device screen={center} height={440} className="z-[1]" />
        <Device screen={right} height={392} className="z-0 -ml-8 translate-y-6 rotate-6" />
      </div>

      {/* Mobile: one phone at a time, switched in place, so the page never scrolls sideways */}
      <div className="flex flex-col items-center gap-4 sm:hidden">
        <div className="grid h-[416px] place-items-end">
          <motion.div
            key={shown}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
          >
            <Device screen={CUSTOMER_SCREENS[shown]} height={400} />
          </motion.div>
        </div>
        <div className="flex gap-1" role="group" aria-label="Choose a screen">
          {CUSTOMER_SCREENS.map((s, i) => (
            <button
              key={s.src}
              type="button"
              onClick={() => setShown(i)}
              aria-pressed={shown === i}
              className={`h-11 rounded-full px-4 text-[13px] font-semibold transition-colors duration-200 active:scale-[0.97] ${
                shown === i ? "bg-brand-tint text-ink" : "text-ink-2"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}

function CrewVisual() {
  return (
    <figure className="flex w-full flex-col items-center gap-3">
      <JobCard />
      <figcaption className="text-[13px] text-ink-3">Illustration</figcaption>
    </figure>
  );
}

function DispatchVisual() {
  return (
    <div className="flex w-full justify-center">
      <BrowserFrame
        src="/screens/dispatch.png"
        alt="Moviin dispatch console with the booking queue and crew assignment."
        width={512}
        height={410}
      />
    </div>
  );
}

const VISUALS: Record<TabId, () => ReactNode> = {
  customer: () => <CustomerVisual />,
  crew: () => <CrewVisual />,
  dispatch: () => <DispatchVisual />,
};

export default function Apps() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState<TabId>("customer");
  const [dir, setDir] = useState(1);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const select = (next: number, focus = false) => {
    const i = (next + TABS.length) % TABS.length;
    const cur = TABS.findIndex((t) => t.id === active);
    setDir(i >= cur ? 1 : -1);
    setActive(TABS[i].id);
    if (focus) tabRefs.current[i]?.focus();
  };

  const onKey = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    const map: Record<string, number> = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: TABS.length - 1 };
    if (e.key in map) {
      e.preventDefault();
      select(map[e.key], true);
    }
  };

  const ease = [0.32, 0.72, 0, 1] as const;

  return (
    <section id="apps" aria-labelledby="apps-title" className="py-20 md:py-28 lg:py-32">
      <Container>
        <Reveal className="mb-10 md:mb-14">
          <h2 id="apps-title" className="max-w-[20ch] font-display text-display-l text-ink">
            One move, three apps, same picture.
          </h2>
          <p className="mt-4 max-w-[44ch] text-lede text-ink-2">
            Customers, crew and our dispatch team all see the same job, in real time.
          </p>
        </Reveal>

        <Reveal delay={0.08}>
          <div
            role="tablist"
            aria-label="Moviin apps"
            className="grid w-full grid-cols-3 rounded-full bg-surface-container p-1 ring-1 ring-line sm:inline-grid sm:w-auto"
          >
            {TABS.map((t, i) => {
              const selected = t.id === active;
              const TabIcon = t.icon;
              return (
                <button
                  key={t.id}
                  ref={(el) => {
                    tabRefs.current[i] = el;
                  }}
                  id={`tab-${t.id}`}
                  role="tab"
                  type="button"
                  aria-selected={selected}
                  aria-controls={`panel-${t.id}`}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => select(i)}
                  onKeyDown={(e) => onKey(e, i)}
                  className={`relative flex h-11 min-w-0 items-center justify-center gap-1.5 rounded-full px-2 sm:gap-2 text-[14px] font-semibold transition-colors duration-200 sm:px-5 ${
                    selected ? "text-ink" : "text-ink-2 hover:text-ink"
                  }`}
                >
                  {selected && (
                    <motion.span
                      layoutId="apps-tab-pill"
                      aria-hidden="true"
                      className="absolute inset-0 rounded-full bg-surface shadow-tab"
                      transition={reduce ? { duration: 0 } : { type: "spring", bounce: 0, duration: 0.35 }}
                    />
                  )}
                  <TabIcon size={18} weight={selected ? "fill" : "regular"} aria-hidden="true" className="relative" />
                  <span className="relative">{t.label}</span>
                </button>
              );
            })}
          </div>
        </Reveal>

        <Reveal delay={0.12} className="mt-6">
          {/* Double bezel: tray then core */}
          <div className="rounded-[32px] bg-tray p-1.5 ring-1 ring-line">
            <div className="overflow-hidden rounded-[26px] bg-surface ring-1 ring-line">
              {TABS.map((t) => {
                const selected = t.id === active;
                const copy = COPY[t.id];
                return (
                  <div
                    key={t.id}
                    id={`panel-${t.id}`}
                    role="tabpanel"
                    aria-labelledby={`tab-${t.id}`}
                    tabIndex={0}
                    hidden={!selected}
                    className="grid items-center gap-10 p-6 md:p-10 lg:min-h-[560px] lg:grid-cols-[0.85fr_1.15fr] lg:p-14"
                  >
                    {selected && (
                      <>
                        <motion.div
                          initial={reduce ? { opacity: 0 } : { opacity: 0, transform: "translateY(8px)" }}
                          animate={reduce ? { opacity: 1 } : { opacity: 1, transform: "translateY(0px)" }}
                          transition={{ duration: reduce ? 0.15 : 0.26, ease: [0.23, 1, 0.32, 1] }}
                        >
                          <h3 className="font-display text-title text-ink">
                            {copy.title}
                          </h3>
                          <ul className="mt-6 space-y-4">
                            {copy.checks.map((c) => (
                              <li key={c} className="flex gap-3 text-ink-2">
                                <CheckCircle
                                  size={20}
                                  aria-hidden="true"
                                  className="mt-[3px] shrink-0 text-brand-ink"
                                />
                                <span>{c}</span>
                              </li>
                            ))}
                          </ul>
                          {t.id === "crew" && (
                            <a
                              href="#drive"
                              className="group mt-8 inline-flex min-h-11 items-center gap-2 font-display font-semibold text-brand-ink"
                            >
                              Drive with Moviin
                              <ArrowRight
                                size={18}
                                aria-hidden="true"
                                className="transition-transform duration-200 ease-out group-hover:translate-x-[3px]"
                              />
                            </a>
                          )}
                        </motion.div>
                        <motion.div
                          className="flex min-w-0 justify-center"
                          initial={
                            reduce
                              ? { opacity: 0 }
                              : { opacity: 0, transform: `translateX(${16 * dir}px) scale(0.98)`, filter: "blur(4px)" }
                          }
                          animate={
                            reduce
                              ? { opacity: 1 }
                              : { opacity: 1, transform: "translateX(0px) scale(1)", filter: "blur(0px)" }
                          }
                          transition={{ duration: reduce ? 0.15 : 0.32, ease }}
                        >
                          {VISUALS[t.id]()}
                        </motion.div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
