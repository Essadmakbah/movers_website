import { Check, Package } from "@phosphor-icons/react";
import StatusPill from "../components/StatusPill.tsx";

const STEPS = ["Accepted", "En route", "At pickup", "Loading", "In transit", "Unloading"] as const;
const CURRENT = 3;

/** Illustrative crew job card (there is no crew screenshot). Non-interactive. */
export default function JobCard() {
  return (
    <div
      className="w-full max-w-[400px] rounded-[20px] bg-surface p-5 shadow-float ring-1 ring-line">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[13px] font-medium tabular-nums text-ink-3">MOV-0717-004</p>
          <p className="mt-1 font-display text-lg font-bold tracking-[-0.015em] text-ink">
            Full house relocation
          </p>
        </div>
        <StatusPill tone="warning" icon={<Package size={14} weight="fill" />}>
          Loading
        </StatusPill>
      </div>

      <div className="mt-5 grid grid-cols-[14px_1fr] gap-x-3">
        <span aria-hidden="true" className="mt-1.5 size-3 rounded-full ring-2 ring-brand-ink" />
        <p className="text-[15px] font-medium text-ink">
          <span className="sr-only">From </span>Banjul
        </p>
        <span aria-hidden="true" className="mx-auto my-1 h-5 w-0 border-l-2 border-dashed border-line-strong" />
        <span />
        <span aria-hidden="true" className="mt-1.5 size-3 rounded-full bg-brand-ink" />
        <p className="text-[15px] font-medium text-ink">
          <span className="sr-only">To </span>Brikama
        </p>
      </div>

      <ol className="mt-5 flex flex-wrap gap-1.5" aria-label="Job progress">
          {STEPS.map((step, i) => {
            const done = i < CURRENT;
            const current = i === CURRENT;
            const tone = done
              ? "bg-positive-bg text-positive-fg ring-positive-line"
              : current
                ? "bg-warning-bg text-warning-fg ring-2 ring-warning-fg/40"
                : "bg-neutral-bg text-neutral-fg ring-neutral-line";
            return (
              <li
                key={step}
                aria-current={current ? "step" : undefined}
                className={`inline-flex h-7 items-center gap-1 rounded-full px-2.5 text-[12.5px] font-semibold ring-1 ${tone}`}
              >
                {done && <Check size={12} weight="bold" aria-hidden="true" />}
                {step}
              </li>
            );
          })}
      </ol>

      <button
        type="button"
        tabIndex={-1}
        aria-hidden="true"
        className="pointer-events-none mt-5 flex h-12 w-full items-center justify-center rounded-full bg-action font-display text-[15px] font-semibold text-on-action"
      >
        Start driving
      </button>
    </div>
  );
}
