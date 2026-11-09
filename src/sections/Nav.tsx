import { useEffect, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowRight } from "@phosphor-icons/react";
import Logo from "../components/Logo.tsx";
import Button from "../components/Button.tsx";

const LINKS = [
  { href: "#how-it-works", label: "How it works" },
  { href: "#why-movers", label: "Why Movers" },
  { href: "#apps", label: "The apps" },
  { href: "#drive", label: "Drive with Movers" },
  { href: "#faq", label: "FAQ" },
] as const;

const SECTION_IDS = ["how-it-works", "why-movers", "apps", "gambia", "drive", "faq", "get-app"];
const EASE_OUT = [0.23, 1, 0.32, 1] as const;
const EASE_IN_OUT = "cubic-bezier(0.77, 0, 0.175, 1)";

export default function Nav() {
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const [heroCtaOut, setHeroCtaOut] = useState(false);
  const [getAppIn, setGetAppIn] = useState(false);

  const sentinelRef = useRef<HTMLDivElement>(null);
  const burgerRef = useRef<HTMLButtonElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);

  // Scrolled state: sentinel at the very top of the document.
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setScrolled(!entry.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Active section for the nav pill.
  useEffect(() => {
    const els = SECTION_IDS.map((id) => document.getElementById(id)).filter((el): el is HTMLElement => !!el);
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(e.target.id);
        }
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    els.forEach((el) => io.observe(el));
    const top = document.getElementById("top");
    const topIo = new IntersectionObserver(([e]) => e.isIntersecting && setActive(null), {
      rootMargin: "-45% 0px -50% 0px",
    });
    if (top) topIo.observe(top);
    return () => {
      io.disconnect();
      topIo.disconnect();
    };
  }, []);

  // Sticky mobile bar: shows once the hero CTA leaves, hides while #get-app is on screen.
  useEffect(() => {
    const heroCta = document.getElementById("hero-cta");
    const getApp = document.getElementById("get-app");
    const ios: IntersectionObserver[] = [];
    if (heroCta) {
      const io = new IntersectionObserver(([e]) => setHeroCtaOut(!e.isIntersecting && e.boundingClientRect.top < 0));
      io.observe(heroCta);
      ios.push(io);
    }
    if (getApp) {
      const io = new IntersectionObserver(([e]) => setGetAppIn(e.isIntersecting));
      io.observe(getApp);
      ios.push(io);
    }
    return () => ios.forEach((io) => io.disconnect());
  }, []);

  // Menu: Escape closes, scroll lock, focus first row, close when crossing into desktop.
  useEffect(() => {
    if (!open) return;
    const html = document.documentElement;
    const prev = html.style.overflow;
    html.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        burgerRef.current?.focus();
      }
    };
    const mql = window.matchMedia("(min-width: 1024px)");
    const onMql = () => mql.matches && setOpen(false);
    document.addEventListener("keydown", onKey);
    mql.addEventListener("change", onMql);
    const t = window.setTimeout(() => sheetRef.current?.querySelector<HTMLElement>("a")?.focus(), 30);
    return () => {
      html.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
      mql.removeEventListener("change", onMql);
      window.clearTimeout(t);
    };
  }, [open]);

  // Focus trap across the burger and the sheet.
  const onSheetKeyDown = (e: ReactKeyboardEvent) => {
    if (e.key !== "Tab" || !sheetRef.current) return;
    const items = [burgerRef.current, ...Array.from(sheetRef.current.querySelectorAll<HTMLElement>("a"))].filter(
      Boolean,
    ) as HTMLElement[];
    const first = items[0];
    const last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  const showBar = heroCtaOut && !getAppIn && !open;

  return (
    <>
      <a
        href="#main"
        className="fixed left-3 top-3 z-[var(--z-skip)] -translate-y-24 rounded-full bg-action px-4 py-3 font-display text-[14px] font-semibold text-on-action focus:translate-y-0"
      >
        Skip to content
      </a>
      <div ref={sentinelRef} aria-hidden="true" className="pointer-events-none absolute left-0 top-0 h-px w-px" />

      <header
        className="fixed inset-x-0 z-[var(--z-nav)] flex justify-center px-3 top-[max(12px,env(safe-area-inset-top))] md:top-4"
        onKeyDown={open ? onSheetKeyDown : undefined}
      >
        <nav
          aria-label="Main"
          className={`flex h-14 w-full max-w-[960px] items-center gap-2 rounded-full bg-surface/80 pl-2 pr-2 ring-1 ring-line backdrop-blur-xl backdrop-saturate-150 transition-shadow duration-[280ms] ease-out md:h-16 [@media(prefers-reduced-transparency:reduce)]:bg-surface ${
            scrolled ? "shadow-[var(--shadow-float)]" : ""
          }`}
        >
          <a href="#top" className="flex items-center rounded-full pr-2" aria-label="Movers, back to top">
            <Logo size={40} />
          </a>

          <ul className="mx-auto hidden items-center gap-0.5 lg:flex">
            {LINKS.map((l) => {
              const isActive = active === l.href.slice(1);
              return (
                <li key={l.href} className="relative">
                  {isActive ? (
                    <motion.span
                      layoutId="nav-pill"
                      aria-hidden="true"
                      className="absolute inset-0 rounded-full bg-brand-tint"
                      transition={{ type: "spring", bounce: 0, duration: 0.35 }}
                    />
                  ) : null}
                  <a
                    href={l.href}
                    aria-current={isActive ? "true" : undefined}
                    className={`relative flex h-9 items-center whitespace-nowrap rounded-full px-3.5 text-[14px] font-medium transition-colors duration-200 hover:text-ink ${
                      isActive ? "text-ink" : "text-ink-2 hover:bg-surface-alt"
                    }`}
                  >
                    {l.label}
                  </a>
                </li>
              );
            })}
          </ul>

          <div className="ml-auto flex items-center gap-2 lg:ml-0">
            <Button href="#get-app" size="sm" className="max-[339px]:hidden">
              Book a move
            </Button>
            <button
              ref={burgerRef}
              type="button"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((o) => !o)}
              className="relative grid size-11 place-items-center rounded-full bg-surface-alt transition-transform duration-[140ms] ease-out active:scale-[0.97] lg:hidden"
            >
              <span aria-hidden="true" className="relative block h-[9px] w-[18px]">
                <span
                  className="absolute left-0 top-0 h-[1.5px] w-[18px] rounded-full bg-ink"
                  style={{
                    transform: open ? "translateY(3.75px) rotate(45deg)" : "none",
                    transition: `transform 280ms ${EASE_IN_OUT}`,
                  }}
                />
                <span
                  className="absolute bottom-0 left-0 h-[1.5px] w-[18px] rounded-full bg-ink"
                  style={{
                    transform: open ? "translateY(-3.75px) rotate(-45deg)" : "none",
                    transition: `transform 280ms ${EASE_IN_OUT}`,
                  }}
                />
              </span>
            </button>
          </div>
        </nav>

        <AnimatePresence>
          {open ? (
            <>
              <motion.div
                key="scrim"
                aria-hidden="true"
                className="fixed inset-0 z-[var(--z-scrim)] bg-canvas/60 lg:hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.16 } }}
                transition={{ duration: 0.24, ease: EASE_OUT }}
                onClick={() => setOpen(false)}
              />
              <motion.div
                key="sheet"
                id="mobile-menu"
                ref={sheetRef}
                role="dialog"
                aria-modal="true"
                aria-label="Menu"
                className="fixed inset-x-3 z-[var(--z-menu)] origin-top-right rounded-[28px] bg-surface p-2 shadow-[var(--shadow-float)] ring-1 ring-line top-[calc(max(12px,env(safe-area-inset-top))+64px)] md:top-[88px] lg:hidden"
                initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: -8 }}
                animate={reduce ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
                exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: -8, transition: { duration: 0.16, ease: EASE_OUT } }}
                transition={{ duration: 0.24, ease: EASE_OUT }}
              >
                <ul>
                  {LINKS.map((l, i) => (
                    <motion.li
                      key={l.href}
                      initial={reduce ? false : { opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.24, delay: reduce ? 0 : 0.04 * i, ease: EASE_OUT }}
                    >
                      <a
                        href={l.href}
                        onClick={() => setOpen(false)}
                        className="flex h-14 items-center justify-between rounded-[20px] px-4 font-display text-[20px] font-semibold text-ink transition-colors duration-200 hover:bg-surface-alt active:bg-surface-alt"
                      >
                        {l.label}
                        <ArrowRight size={20} className="text-ink-3" aria-hidden="true" />
                      </a>
                    </motion.li>
                  ))}
                </ul>
                <div className="p-2 pt-3">
                  <Button href="#get-app" orb className="w-full justify-between" onClick={() => setOpen(false)}>
                    Book a move
                  </Button>
                </div>
              </motion.div>
            </>
          ) : null}
        </AnimatePresence>
      </header>

      {/* Mobile sticky booking bar */}
      <div
        aria-hidden={!showBar}
        className={`fixed inset-x-0 bottom-0 z-[var(--z-nav)] px-4 pt-3 pb-[max(12px,env(safe-area-inset-bottom))] transition-[transform,opacity] duration-[280ms] ease-out md:hidden ${
          showBar ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-full opacity-0"
        }`}
      >
        <Button href="#get-app" orb tabIndex={showBar ? 0 : -1} className="w-full justify-between shadow-[var(--shadow-float)]">
          Book a move
        </Button>
      </div>
    </>
  );
}
