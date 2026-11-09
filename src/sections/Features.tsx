import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  AnimatePresence,
  animate,
  motion,
  useInView,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
} from "motion/react";
import { Check, CheckCircle, MapPin, Package, Truck, WifiSlash } from "@phosphor-icons/react";
import Container from "../components/Container.tsx";
import Reveal from "../components/Reveal.tsx";
import Phone from "../components/Phone.tsx";
import StatusPill, { type StatusTone } from "../components/StatusPill.tsx";
import { useActiveLoop } from "../components/useActiveLoop.ts";

const EASE_OUT = [0.23, 1, 0.32, 1] as const;
const EASE_REVEAL = [0.16, 1, 0.3, 1] as const;

type Variant = "white" | "brand" | "gold";

const tray: Record<Variant, string> = {
  white: "bg-tray",
  brand: "bg-[rgb(0_83_68/.10)]",
  gold: "bg-[rgb(253_191_53/.12)]",
};
const core: Record<Variant, string> = {
  white: "bg-surface ring-1 ring-line shadow-[var(--shadow-core-hi)]",
  brand: "bg-brand shadow-[var(--shadow-brand-hi)] text-on-brand",
  gold: "bg-gold-tint ring-1 ring-gold-line",
};

/** Double-bezel cell: tinted tray, 6px gap, inner core. Flat, no drop shadow. */
function Cell({
  variant,
  className = "",
  coreClassName = "",
  index,
  children,
}: {
  variant: Variant;
  className?: string;
  coreClassName?: string;
  index: number;
  children: ReactNode;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.article
      className={`rounded-[32px] p-1.5 ring-1 ring-line ${tray[variant]} ${className}`}
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24 }}
      whileInView={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={reduce ? { duration: 0.2 } : { duration: 0.6, delay: index * 0.07, ease: EASE_REVEAL }}
    >
      <div className={`relative h-full overflow-hidden rounded-[26px] p-6 md:p-8 ${core[variant]} ${coreClassName}`}>
        {children}
      </div>
    </motion.article>
  );
}

/* ---------------- Price ---------------- */

const FARE_ROWS = [
  { label: "Base fare", value: "GMD 1,000" },
  { label: "Distance, 12 km", value: "GMD 500" },
  { label: "Inventory, 24 items", value: "GMD 3,000" },
] as const;
const FARE_TOTAL = 4500;
const fmt = (n: number) => `GMD ${Math.round(n).toLocaleString("en-US")}`;

function FareTile() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const totalRef = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const total = useMotionValue(reduce ? FARE_TOTAL : 0);

  useMotionValueEvent(total, "change", (v) => {
    if (totalRef.current) totalRef.current.textContent = fmt(v);
  });

  useEffect(() => {
    if (reduce) {
      total.set(FARE_TOTAL);
      return;
    }
    if (!inView) return;
    const a = animate(total, FARE_TOTAL, { duration: 0.9, delay: FARE_ROWS.length * 0.06 + 0.1, ease: EASE_OUT });
    return () => a.stop();
  }, [inView, reduce, total]);

  return (
    <div ref={ref} className="rounded-[16px] bg-surface-alt p-5">
      <p className="text-micro text-ink-3">Example fare</p>
      <dl className="mt-3 space-y-2">
        {FARE_ROWS.map((r, i) => (
          <motion.div
            key={r.label}
            className="flex justify-between gap-4 text-meta"
            initial={reduce ? false : { opacity: 0, y: 6 }}
            animate={inView || reduce ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.4, delay: i * 0.06, ease: EASE_OUT }}
          >
            <dt className="text-ink-2">{r.label}</dt>
            <dd className="font-medium text-ink num">{r.value}</dd>
          </motion.div>
        ))}
      </dl>
      <div className="mt-4 flex items-baseline justify-between gap-4 border-t border-line pt-4">
        <span className="text-meta font-medium text-ink-2">Total</span>
        <span className="font-display text-[28px] font-extrabold leading-none tracking-[-0.02em] text-ink num">
          <span aria-hidden="true" ref={totalRef}>
            {fmt(reduce ? FARE_TOTAL : 0)}
          </span>
          <span className="sr-only">{fmt(FARE_TOTAL)}</span>
        </span>
      </div>
    </div>
  );
}

/* ---------------- Manifest ---------------- */

const MANIFEST = [
  { item: "Sofa, 3 seater", room: "Living room" },
  { item: "Fridge", room: "Kitchen" },
  { item: "Double bed frame", room: "Bedroom" },
  { item: "TV, 55 inch", room: "Living room" },
  { item: "Boxes x 12", room: "Study" },
] as const;

function Manifest() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLUListElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const checked = reduce || inView;

  return (
    <ul ref={ref} className="mt-6 space-y-2" aria-label="Example manifest, all items checked">
      {MANIFEST.map((m, i) => {
        const delay = reduce ? 0 : 0.2 + i * 0.18;
        return (
          <li
            key={m.item}
            className="flex h-12 items-center gap-3 rounded-[12px] bg-white/[.06] px-3 ring-1 ring-white/10"
          >
            <span className="relative grid size-6 shrink-0 place-items-center rounded-full ring-1 ring-white/30">
              <motion.span
                aria-hidden="true"
                className="absolute inset-0 rounded-full bg-mint"
                initial={reduce ? false : { opacity: 0 }}
                animate={checked ? { opacity: 1 } : undefined}
                transition={{ duration: 0.22, delay, ease: EASE_OUT }}
              />
              <motion.span
                aria-hidden="true"
                className="relative text-brand-strong"
                initial={reduce ? false : { opacity: 0, scale: 0.6 }}
                animate={checked ? { opacity: 1, scale: 1 } : undefined}
                transition={{ duration: 0.22, delay, ease: EASE_OUT }}
              >
                <Check size={14} weight="bold" />
              </motion.span>
            </span>
            <span className="min-w-0 truncate font-medium text-on-brand">{m.item}</span>
            <span className="ml-auto shrink-0 text-[12.5px] text-on-brand-muted/80">{m.room}</span>
          </li>
        );
      })}
    </ul>
  );
}

/* ---------------- Live status cycler ---------------- */

const STAGES: { label: string; tone: StatusTone; icon: ReactNode }[] = [
  { label: "En route to pickup", tone: "info", icon: <Truck size={14} weight="fill" /> },
  { label: "At pickup", tone: "warning", icon: <MapPin size={14} weight="fill" /> },
  { label: "Loading", tone: "warning", icon: <Package size={14} weight="fill" /> },
  { label: "In transit", tone: "info", icon: <Truck size={14} weight="fill" /> },
  { label: "At dropoff", tone: "warning", icon: <MapPin size={14} weight="fill" /> },
  { label: "Unloading", tone: "warning", icon: <Package size={14} weight="fill" /> },
  { label: "Completed", tone: "positive", icon: <CheckCircle size={14} weight="fill" /> },
];
const STATIC_STAGE = 3; // "In transit"

function StatusCycler() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const active = useActiveLoop(ref, 0.5);
  const [i, setI] = useState(0);

  useEffect(() => {
    if (reduce || !active) return;
    const hold = i === STAGES.length - 1 ? 4000 : 2400;
    const t = window.setTimeout(() => setI((v) => (v + 1) % STAGES.length), hold);
    return () => window.clearTimeout(t);
  }, [i, active, reduce]);

  const stage = STAGES[reduce ? STATIC_STAGE : i];

  return (
    <div
      ref={ref}
      aria-hidden="true"
      aria-live="off"
      className="grid h-20 place-items-center overflow-hidden rounded-[16px] bg-surface ring-1 ring-gold-line"
    >
      <AnimatePresence initial={false} mode="popLayout">
        <motion.div
          key={stage.label}
          initial={{ opacity: 0, transform: "translateY(10px)" }}
          animate={{ opacity: 1, transform: "translateY(0px)", filter: "blur(0px)" }}
          exit={{ opacity: 0, transform: "translateY(-10px)", filter: "blur(2px)", transition: { duration: 0.18 } }}
          transition={{ duration: 0.26, ease: EASE_OUT }}
        >
          <StatusPill tone={stage.tone} icon={stage.icon}>
            {stage.label}
          </StatusPill>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/* ---------------- Section ---------------- */

export default function Features() {
  return (
    <section id="why-moviin" aria-labelledby="why-title" className="py-20 md:py-28 lg:py-32">
      <Container>
        <Reveal>
          <h2 id="why-title" className="max-w-[20ch] font-display text-display-l text-ink">
            Built for what goes wrong on moving day.
          </h2>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-3 md:mt-16 md:grid-cols-2 md:gap-4 lg:grid-cols-12">
          {/* 1. Price */}
          <Cell variant="white" index={0} className="md:col-span-2 lg:col-span-7">
            <div className="grid gap-8 md:grid-cols-2 md:items-center">
              <div>
                <h3 className="font-display text-title text-ink">A price before you commit</h3>
                <p className="mt-3 max-w-[40ch] text-body text-ink-2">
                  Your fare is worked out from distance and what you are moving. No haggling at the door.
                </p>
              </div>
              <FareTile />
            </div>
          </Cell>

          {/* 2. Manifest */}
          <Cell variant="brand" index={1} className="md:row-span-2 lg:col-span-5" coreClassName="flex flex-col">
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0"
              style={{ background: "radial-gradient(120% 80% at 100% 0%, rgb(150 235 213 / .14), transparent 60%)" }}
            />
            <div className="relative flex h-full flex-col">
              <h3 className="font-display text-title text-on-brand">Every item, accounted for</h3>
              <p className="mt-3 max-w-[40ch] text-body text-on-brand-muted">
                The crew check your items at pickup and again at dropoff. Any damage is logged with a photo and a note.
              </p>
              <Manifest />
              <p className="mt-auto flex items-center gap-2 pt-6 text-meta text-on-brand-muted">
                <WifiSlash size={18} aria-hidden="true" className="shrink-0" />
                Checks save offline and sync when signal returns.
              </p>
            </div>
          </Cell>

          {/* 3. Live */}
          <Cell variant="gold" index={2} className="lg:col-span-3">
            <h3 className="font-display text-title text-ink">Updates, not phone calls</h3>
            <div className="mt-5">
              <StatusCycler />
              <p className="sr-only">Example job status: In transit.</p>
            </div>
            <p className="mt-5 text-body text-ink-2">The crew update the job as they go. Your phone updates with them.</p>
          </Cell>

          {/* 4. Payment */}
          <Cell variant="white" index={3} className="lg:col-span-4" coreClassName="flex flex-col !pb-0">
            <h3 className="font-display text-title text-ink">Pay your way</h3>
            <p className="mt-3 text-body text-ink-2">Card or mobile money, confirmed in the app.</p>
            <div
              className="relative mt-6 flex h-[232px] justify-center overflow-hidden"
              style={{
                maskImage: "linear-gradient(to bottom, black 70%, transparent)",
                WebkitMaskImage: "linear-gradient(to bottom, black 70%, transparent)",
              }}
            >
              <Phone
                src="/screens/payment-method.png"
                alt="Moviin app payment screen where you choose how to pay for your move."
                className="self-start"
              />
            </div>
          </Cell>
        </div>
      </Container>
    </section>
  );
}
