import type { ReactNode } from "react";

export type StatusTone = "positive" | "warning" | "info" | "danger" | "neutral";

export type StatusPillProps = {
  children: ReactNode;
  tone?: StatusTone;
  /** Leading icon (Phosphor, weight "fill", size 14). */
  icon: ReactNode;
  className?: string;
};

const tones: Record<StatusTone, string> = {
  positive: "bg-positive-bg text-positive-fg ring-positive-line",
  warning: "bg-warning-bg text-warning-fg ring-warning-line",
  info: "bg-info-bg text-info-fg ring-info-line",
  danger: "bg-danger-bg text-danger-fg ring-danger-line",
  neutral: "bg-neutral-bg text-neutral-fg ring-neutral-line",
};

/** Sentence-case status pill using the brand status tones from theme.ts. */
export default function StatusPill({ children, tone = "neutral", icon, className = "" }: StatusPillProps) {
  return (
    <span
      className={`inline-flex h-7 items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 text-micro ring-1 ring-inset ${tones[tone]} ${className}`}
    >
      <span aria-hidden="true" className="inline-flex">
        {icon}
      </span>
      {children}
    </span>
  );
}
