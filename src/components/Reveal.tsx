import type { ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";

type RevealTag = "div" | "section" | "li" | "ul" | "ol" | "article" | "header" | "p" | "h2" | "h3" | "span" | "figure";

export type RevealProps = {
  children: ReactNode;
  /** Delay in seconds. Default 0. Keep sibling staggers at 0.08 or less. */
  delay?: number;
  /** Element to render. Default "div". */
  as?: RevealTag;
  className?: string;
  /** Vertical travel in px. Default 24. */
  y?: number;
  id?: string;
};

/** Fade plus small rise once in view (transform + opacity only). Reduced motion: opacity only, 200ms. */
export default function Reveal({ children, delay = 0, as = "div", className, y = 24, id }: RevealProps) {
  const reduce = useReducedMotion();
  const Tag = motion[as];
  return (
    <Tag
      id={id}
      className={className}
      initial={reduce ? { opacity: 0 } : { opacity: 0, y }}
      whileInView={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={reduce ? { duration: 0.2 } : { duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </Tag>
  );
}
