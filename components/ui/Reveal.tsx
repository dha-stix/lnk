"use client";

import type { CSSProperties, ElementType, ReactNode } from "react";
import { useInView } from "@/lib/hooks";
import { cn } from "@/lib/utils";

type RevealProps = {
  children: ReactNode;
  as?: ElementType;
  delay?: number;
  className?: string;
  style?: CSSProperties;
  id?: string;
};

/** Fades and slides its children up the first time they scroll into view. */
export function Reveal({ children, as: Tag = "div", delay = 0, className, style, id }: RevealProps) {
  const [ref, inView] = useInView<HTMLElement>({ threshold: 0.15 });
  return (
    <Tag ref={ref} id={id} className={cn("reveal", inView && "is-visible", className)} style={{ transitionDelay: `${delay}ms`, ...style }}>
      {children}
    </Tag>
  );
}
