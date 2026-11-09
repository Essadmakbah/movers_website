import type { ElementType, ReactNode } from "react";

export type ContainerProps = {
  children: ReactNode;
  /** Element to render. Default "div". */
  as?: ElementType;
  /** "default" = 1200px, "narrow" = max-w-3xl, "wide" = max-w-7xl. */
  size?: "narrow" | "default" | "wide";
  className?: string;
};

const widths = { narrow: "max-w-3xl", default: "max-w-[1200px]", wide: "max-w-7xl" } as const;

/** 16px gutter on phones (328px content at 360), 24px at sm, 32px at lg. */
export default function Container({ children, as: Tag = "div", size = "default", className = "" }: ContainerProps) {
  return <Tag className={`mx-auto w-full ${widths[size]} px-4 sm:px-6 lg:px-8 ${className}`}>{children}</Tag>;
}
