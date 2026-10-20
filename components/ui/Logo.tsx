import Link from "next/link";
import { cn } from "@/lib/utils";

type LogoProps = {
  size?: "sm" | "md" | "lg";
  tone?: "ink" | "white";
  href?: string | null;
  className?: string;
};

const SIZES = { sm: { icon: 24, text: "text-xl" }, md: { icon: 30, text: "text-2xl" }, lg: { icon: 36, text: "text-3xl" } };

export function LogoMark({ size = 30, className }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden className={cn("animate-wiggle", className)}>
      <rect x="3" y="12" width="20" height="14" rx="7" fill="none" stroke="#5B3DF5" strokeWidth="4" />
      <rect x="17" y="14" width="20" height="14" rx="7" fill="none" stroke="currentColor" strokeWidth="4" />
    </svg>
  );
}

export function Logo({ size = "md", tone = "ink", href = "/", className }: LogoProps) {
  const s = SIZES[size];
  const content = (
    <span className={cn("jelly inline-flex items-center gap-1.5 font-display leading-none", s.text, tone === "white" ? "text-white" : "text-ink", className)}>
      <LogoMark size={s.icon} />
      lnk<span className={tone === "white" ? "text-lime" : "text-violet"}>.</span>
    </span>
  );
  if (!href) return content;
  return (
    <Link href={href} aria-label="Lnk home" className="inline-flex">
      {content}
    </Link>
  );
}
