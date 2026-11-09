import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { ArrowUpRight } from "@phosphor-icons/react";

/**
 * primary   green fill (mint in dark), the "Book a move" intent
 * ghost     ring outline, "See how it works"
 */
type Variant = "primary" | "ghost";
type Size = "sm" | "md";

type BaseProps = {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  /** Optional trailing icon inside a round orb. Pass `orb` for the default ArrowUpRight. */
  icon?: ReactNode;
  /** Shorthand: render the default ArrowUpRight orb. */
  orb?: boolean;
  /** Full width below 480px (spec: primary CTAs on small phones). */
  fullOnMobile?: boolean;
  className?: string;
};

/** Renders an <a> when `href` is set, otherwise a <button>. */
export type ButtonProps =
  | (BaseProps & { href: string } & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof BaseProps | "href">)
  | (BaseProps & { href?: undefined } & Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof BaseProps>);

const base =
  "group inline-flex items-center justify-center rounded-full font-display font-semibold whitespace-nowrap select-none " +
  "transition-[transform,background-color,color,box-shadow] duration-200 ease-out active:scale-[0.97] active:duration-[140ms] " +
  "disabled:pointer-events-none disabled:opacity-50";

const variants: Record<Variant, string> = {
  primary: "bg-action text-on-action hover:bg-action-hover",
  ghost: "ring-1 ring-inset ring-line-strong text-ink hover:bg-surface-alt",
};

const sizes: Record<Size, { plain: string; withIcon: string; orb: string; icon: number }> = {
  sm: { plain: "h-10 px-4 text-[14px] gap-2", withIcon: "h-10 pl-4 pr-1 text-[14px] gap-2", orb: "size-8", icon: 16 },
  md: { plain: "h-12 px-5 text-[15px] gap-3", withIcon: "h-12 pl-6 pr-1.5 text-[15px] gap-3", orb: "size-9", icon: 18 },
};

const orbVariants: Record<Variant, string> = {
  primary: "bg-on-action/15",
  ghost: "bg-surface-container",
};

export default function Button(props: ButtonProps) {
  const { children, variant = "primary", size = "md", icon, orb, fullOnMobile, className = "", ...rest } = props;
  const s = sizes[size];
  const orbIcon = icon ?? (orb ? <ArrowUpRight size={s.icon} weight="bold" /> : null);
  const cls = `${base} ${variants[variant]} ${orbIcon ? s.withIcon : s.plain} ${
    fullOnMobile ? "w-full min-[480px]:w-auto" : ""
  } ${orbIcon && fullOnMobile ? "justify-between min-[480px]:justify-center" : ""} ${className}`;
  const content = (
    <>
      <span>{children}</span>
      {orbIcon ? (
        <span
          aria-hidden="true"
          className={`${s.orb} ${orbVariants[variant]} grid shrink-0 place-items-center rounded-full transition-transform duration-200 ease-out group-hover:translate-x-[2px] group-hover:-translate-y-[2px] group-hover:scale-[1.06] motion-reduce:transform-none`}
        >
          {orbIcon}
        </span>
      ) : null}
    </>
  );

  if (rest.href !== undefined) {
    return (
      <a {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)} className={cls}>
        {content}
      </a>
    );
  }
  const { type = "button", ...btn } = rest as ButtonHTMLAttributes<HTMLButtonElement>;
  return (
    <button type={type} {...btn} className={cls}>
      {content}
    </button>
  );
}
