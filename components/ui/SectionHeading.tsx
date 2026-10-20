import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  children: ReactNode;
  as?: "h1" | "h2" | "h3";
  size?: "md" | "lg" | "xl";
  className?: string;
};

const SIZES = {
  md: "text-[clamp(28px,3.6vw,44px)]",
  lg: "text-[clamp(32px,4.6vw,58px)]",
  xl: "text-[clamp(38px,5.4vw,76px)]",
};

export function SectionHeading({ children, as: Tag = "h2", size = "lg", className }: SectionHeadingProps) {
  return <Tag className={cn("font-display leading-[1.05] tracking-[-0.02em] text-balance", SIZES[size], className)}>{children}</Tag>;
}

export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2 self-start rounded-full border-2 border-ink bg-white px-3.5 py-2 text-sm font-semibold shadow-brutal-sm", className)}>
      {children}
    </span>
  );
}
